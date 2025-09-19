const helper = require("./test_helper");
const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ username: "root", passwordHash });

  await user.save();
});

test("users are returned as json", async () => {
  const response = await api
    .get("/api/users")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert(Array.isArray(response.body));
  assert(response.body.some((u) => u.username === "root"));
});

test("creation succeeds with a fresh username", async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: "mluukkai",
    name: "Matti Luukkainen",
    password: "salainen",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await helper.usersInDb();
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

  const usernames = usersAtEnd.map((u) => u.username);
  assert(usernames.includes(newUser.username));
});

test("creation fails with proper statuscode and message if username already taken", async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: "root",
    name: "Superuser",
    password: "salainen",
  };

  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await helper.usersInDb();
  assert(result.body.error.includes("expected `username` must be unique"));

  assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

test("user creation fails if username is missing", async () => {
  const newUser = { name: "No Username", password: "validpass" };
  const result = await api.post("/api/users").send(newUser).expect(400);
  assert(result.body.error.includes("username and password required"));
});

test("user creation fails if password is missing", async () => {
  const newUser = { username: "nouser", name: "No Password" };
  const result = await api.post("/api/users").send(newUser).expect(400);
  assert(result.body.error.includes("username and password required"));
});

test("user creation is fails if username is too short", async () => {
  const newUser = {
    username: "in",
    name: "User1",
    password: "password",
  };
  const result = await api.post("/api/users").send(newUser).expect(400);
  assert(
    result.body.error.includes(
      "username and password must be at least 3 character long"
    )
  );
});

test("user creation fails if password is too short", async () => {
  const newUser = {
    username: "validuser",
    name: "Short Password",
    password: "ab",
  };
  const result = await api.post("/api/users").send(newUser).expect(400);
  assert(
    result.body.error.includes(
      "username and password must be at least 3 character long"
    )
  );
});

after(async () => {
  await mongoose.connection.close();
});
