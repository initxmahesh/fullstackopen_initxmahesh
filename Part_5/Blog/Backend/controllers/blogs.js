const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
// const User = require("../models/user");
// const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post(
  "/",
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const user = request.user;
      const { title, url, author, likes } = request.body;
      if (!title || !url) {
        return response.status(400).json({ error: "title or url missing" });
      }
      const blog = new Blog({
        title,
        author,
        url,
        likes: likes || 0,
        user: user._id,
      });
      const saveBlog = await blog.save();
      user.blogs = user.blogs.concat(saveBlog._id);
      await user.save();

      response.status(201).json(saveBlog);
    } catch (error) {
      next(error);
    }
  }
);

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const user = request.user;

      const blog = await Blog.findById(request.params.id);
      if (!blog) {
        return response.status(404).json({ error: "blog not found" });
      }

      if (blog.user.toString() !== user._id.toString()) {
        return response
          .status(403)
          .json({ error: "only the creator can delete this blog" });
      }

      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

blogsRouter.put(
  "/:id",
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const body = request.body;
      const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { likes: body.likes },
        { new: true, runValidators: true, context: "query" }
      );
      response.json(updatedBlog);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = blogsRouter;
