const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
        response.json(blogs)
})

blogsRouter.post('/', async(request, response, next) => {
    try {
        console.log('request', request.body)
        const { title, url, author, likes } = request.body;
        if (!title || !url) {
          return response.status(400).json({ error: "title or url missing" });
        }
        const blog = new Blog({title, author, url, likes})
        const saveBlog = await blog.save()
        response.status(201).json(saveBlog)
    } catch (error) {
        next(error)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    }
    catch(error) {
        next(error)
    }
})

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

module.exports = blogsRouter