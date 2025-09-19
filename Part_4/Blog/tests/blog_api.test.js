const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

let token;
let userId;

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
  await User.deleteMany({});

  const newUser = {
    username: "unitest0",
    name: "test0",
    password: "password",
  };

  await api.post("/api/users").send(newUser);
  const login = await api.post("/api/login").send({
    username: "unitest0",
    password: "password",
  });

  token = login.body.token;
  userId = login.body.id;
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("blog with unique identifier named id", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
  const blog = response.body[0];
  assert.ok(blog.id, "Unique id is missing");
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Backend blog",
    author: "mahesh",
    url: "https://facebook.com/initxmahesh",
    likes: 502658,
  };
  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const titles = response.body.map((ele) => ele.title);

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);
  assert(titles.includes("Backend blog"));
});

test("if likes property is missing, it will by default set to 0", async () => {
  const newBlog = {
    title: "No Likes Blog",
    author: "Mahesh",
    url: "https://example.com/nolikes",
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test("if title property is missing, it will respond with status code 400 Bad Request", async () => {
  const missingTitle = {
    author: "Mahesh Shiva",
    url: "https://notfound.com/id",
    likes: 5820,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(missingTitle)
    .expect(400)
    .expect("Content-Type", /application\/json/);
});

test("if url property is missing, it will respond with status code 400 Bad Request", async () => {
  const missingUrl = {
    title: "No URL",
    author: "Ram Saha",
    likes: 10000,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(missingUrl)
    .expect(400)
    .expect("Content-Type", /application\/json/);
});

test("adding a blog fails with status code 401 Unauthorized, if token is not provided", async () => {
  const newBlog = {
    title: "No token",
    author: "Author",
    url: "http://www.notoken.com/notfound",
    likes: 5504223,
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(401)
    .expect("Content-Type", /application\/json/);
  assert.ok(
    response.body.error.includes("token missing") ||
      response.body.error.includes("token invalid")
  );
});

test("deletion succeeds with status code 204 if id is valid and user is admin", async () => {
  const blogAtStart = await helper.blogsInDb();
  const deleteBlog = blogAtStart[0];

  await api
    .delete(`/api/blogs/${deleteBlog.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);

  const finalBlog = await helper.blogsInDb();
  const titles = finalBlog.map((b) => b.title);
  assert(!titles.includes(deleteBlog.title));
  assert.strictEqual(finalBlog.length, helper.initialBlogs.length - 1);
});

test("succeeds in updating blog", async () => {
  const blogAtStart = await helper.blogsInDb();
  const updateBlog = blogAtStart[0];

  const responseData = { likes: updateBlog.likes + 10 };

  const response = await api
    .put(`/api/blogs/${updateBlog.id}`)
    .set("Authorization", `Bearer ${token}`)
    .send(responseData)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsUpdate = await helper.blogsInDb();
  const updatedBlogs = blogsUpdate.find((b) => b.id === updateBlog.id);

  assert.strictEqual(updatedBlogs.likes, responseData.likes);
});

after(async () => {
  await mongoose.connection.close();
});
