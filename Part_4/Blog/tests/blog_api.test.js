const assert = require('node:assert')
const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require('../models/blog')

const api = supertest(app);

const initialBlogs = [
  {
    title: "Python",
    author: "initxmahesh",
    url: "https://localhost:5000",
    likes: 25000,
  },
  {
    title: "Javascript",
    author: "John",
    url: "https://localhost:4000",
    likes: 250,
  },
  {
    title: "Maya is Maya",
    author: "Rajmohan",
    url: "https://localhost:5020",
    likes: 154000,
  },
];

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[2]);
    await blogObject.save();
})

test.only("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test.only("all blogs are returned", async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
});


after(async () => {
  await mongoose.connection.close();
});
