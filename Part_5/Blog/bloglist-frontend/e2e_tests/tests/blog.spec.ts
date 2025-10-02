const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith } = require("./helper");

describe("Blog app", () => {
  let userdb;
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:5173/api/testing/reset");

    (userdb = {
      username: "initxmahesh",
      name: "maheshfirst",
      password: "password",
    }),
      await request.post("http://localhost:5173/api/users", {});

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByLabel("username")).toBeVisible();
    await expect(page.getByLabel("password")).toBeVisible();
    await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      //   await page.getByLabel("username").fill(userdb.username);
      //   await page.getByLabel("password").fill(userdb.password);
      //     await page.getByRole("button", { name: /login/i }).click();
      await loginWith(page, userdb.username, userdb.password);

      await expect(page.getByText("maheshfirst logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      //   await page.getByLabel("username").fill(userdb.username);
      //   await page.getByLabel("password").fill("wrong");
      //   await page.getByRole("button", { name: /login/i }).click();
      await loginWith(page, userdb.username, "wrong");

      await expect(page.getByText(/wrong username or password/i)).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, userdb.username, userdb.password);
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: "create new blog" }).click();

      await page.getByLabel("title:").fill("Test Blog Title");
      await page.getByLabel("author:").fill("Test Author");
      await page.getByLabel("url:").fill("http://testblog.com");

      await page.getByRole("button", { name: /create/i }).click();

      await expect(
        page.getByText("Test Blog Title by Test Author")
      ).toBeVisible();
    });
  });
});
