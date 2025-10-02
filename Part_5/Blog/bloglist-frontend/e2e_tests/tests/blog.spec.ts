const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith } = require("./helper");

describe("Blog app", () => {
  let userdb;
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");

    (userdb = {
      username: "initxmahesh",
      name: "maheshfirst",
      password: "password",
    }),
      await request.post("/api/users", {});

    await page.goto("/");
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

      await page.getByLabel("title:").fill("Testing title");
      await page.getByLabel("author:").fill("Testing author");
      await page.getByLabel("url:").fill("http://testblog.com");

      await page.getByRole("button", { name: /create/i }).click();

      await expect(
        page.getByText("Testing title by Testing author")
      ).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await page.getByRole("button", { name: "create new blog" }).click();
      await page.getByLabel("title:").fill("Testing like title");
      await page.getByLabel("author:").fill("Liked author");
      await page.getByLabel("url:").fill("http://testlike.com");
      await page.getByRole("button", { name: /create/i }).click();

      await expect(
        page.getByText("Testing like title by Liked author")
      ).toBeVisible();

      const blog = page
        .getByText("Testing like title Liked author")
        .nth(-1)
        .locator("..");
      await blog.getByRole("button", { name: /view/i }).click();

      const likeButton = blog.getByRole("button", { name: /like/i });
      await expect(likeButton).toBeVisible();
      await likeButton.click();

      await expect(blog.getByText(/likes 1/i)).toBeVisible();
    });
  });
});
