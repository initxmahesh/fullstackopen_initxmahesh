const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  try {
    const user = await User.findById(request.body.userId);

    if (!user) {
      return response
        .status(400)
        .json({ error: "userId missing or not valid" });
    }

    console.log("request", request.body);
    const { title, url, author, likes } = request.body;
    if (!title || !url) {
      return response.status(400).json({ error: "title or url missing" });
    }
    const blog = new Blog({
      title,
      author,
      url,
      likes,
      user: user._id,
    });
    const saveBlog = await blog.save();
    user.blogs = user.blogs.concat(saveBlog._id);
    await user.save();

    response.status(201).json(saveBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
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
});

module.exports = blogsRouter;
