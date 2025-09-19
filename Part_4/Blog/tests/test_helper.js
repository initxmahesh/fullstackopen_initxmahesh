const Blog = require("../models/blog");
const User = require("../models/user");

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
];

const nonExistingId = async () => {
  const blog = new Blog({ title: "willremovethissoon" });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const newUser = [
  {
    username: "testuser1",
    name: "User1",
    password: "password1",
  },
  {
    username: "testuser2",
    name: "User2",
    password: "password2",
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((b) => b.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  newUser,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
