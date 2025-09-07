const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");

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

let token;
let userId;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const newUser = {
    username: "testuser",
    name: "Test User",
    password: "password",
  };

  await api.post("/api/users").send(newUser);
  const login = await api.post("/api/login").send({
    username: "testuser",
    password: "password",
  });

  token = login.body.token;
  userId = login.body.id;

  for (const blog of initialBlogs) {
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blog);
  }
});

describe("adding the blogs", () => {
  test("a valid blog can be added with a token", async () => {
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

    assert.strictEqual(response.body.length, initialBlogs.length + 1);
    const titles = response.body.map((ele) => ele.title);
    assert(titles.includes("Backend blog"));
  });

  test("if likes property missing, it defaults to 0", async () => {
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

  test("missing title returns 400", async () => {
    const missingTitle = {
      author: "Mahesh Shiva",
      url: "https://notfound.com/id",
      likes: 5820,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(missingTitle)
      .expect(400);
  });

  test("missing url returns 400", async () => {
    const missingUrl = {
      title: "No URL",
      author: "Ram Saha",
      likes: 10000,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(missingUrl)
      .expect(400);
  });
  test("adding a blog fails if token is not given", async () => {
    const newBlog = {
      title: "No token",
      author: "Author",
      url: "http://www.notoken.com/notfound",
      likes: 5504223,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);
  });
});

describe("delete a blog", () => {
  test("if id is valid and user is admin", async () => {
    const response = await api.get("/api/blogs");
    const deleteBlog = response.body[0];

    await api
      .delete(`/api/blogs/${deleteBlog.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const finalBlog = await Blog.find({});
    assert.strictEqual(finalBlog.length, initialBlogs.length - 1);

    const titles = finalBlog.map((b) => b.title);
    assert(!titles.includes(deleteBlog.title));
  });
});

describe("update the blog list", () => {
  test("succeeds in updating likes", async () => {
    const res = await api.get("/api/blogs");
    const updateBlog = res.body[0];

    const responseData = { likes: updateBlog.likes + 10 };

    const response = await api
      .put(`/api/blogs/${updateBlog.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(responseData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, updateBlog.likes + 10);
  });
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, initialBlogs.length);
});

after(async () => {
  await mongoose.connection.close();
});
