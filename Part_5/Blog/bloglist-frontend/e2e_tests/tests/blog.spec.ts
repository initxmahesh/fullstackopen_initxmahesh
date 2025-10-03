import { loginWith, createBlog } from "./helper";
const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      userdb: {
        username: "initxmahesh",
        name: "maheshfirst",
        password: "password",
      },
    });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("Log in to application")).toBeVisible();
    await expect(page.getByLabel("username")).toBeVisible();
    await expect(page.getByLabel("password")).toBeVisible();
    await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      //   await page.getByLabel("username").fill(userdb.username);
      //   await page.getByLabel("password").fill(userdb.password);
      //     await page.getByRole("button", { name: /login/i }).click();
      await loginWith(page, "initxmahesh", "password");

      await expect(page.getByText("maheshfirst logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      //   await page.getByLabel("username").fill(userdb.username);
      //   await page.getByLabel("password").fill("wrong");
      //   await page.getByRole("button", { name: /login/i }).click();
      await loginWith(page, "initxmahesh", "wrong");

      await expect(page.getByText(/wrong username or password/i)).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "initxmahesh", "password");
    });

    test("a new blog can be created", async ({ page }) => {
      const rand = Date.now();
      const title = `Blog Title ${rand}`;
      await createBlog(page, title, "Blog Author", "https://blog.test.com");

      await expect(
        page.getByText(`a new blog Blog Title ${rand} by Blog Author added`)
      ).toBeVisible({ timeout: 2000 });

      await expect(
        page.getByRole("button", { name: /create new blog/i })
      ).toBeVisible();
      await expect(
        page.getByText(`Blog Title ${rand} Blog Author`)
      ).toBeVisible();
    });
    test("a blog can be liked", async ({ page }) => {
      const rand = Date.now();
      const title = `Blog Title ${rand}`;
      await createBlog(page, title, "Blog Author", "https://blog.test.com");

      const blog = page
        .locator(".blog")
        .filter({ hasText: `Blog Title ${rand} Blog Author` });
      await blog.getByRole("button", { name: /view/i }).click();

      await expect(blog.getByText("likes 0")).toBeVisible();
      await blog.getByRole("button", { name: /like/i }).click();

      await expect(blog.getByText("likes 1")).toBeVisible();
    });

    test("creator can only delete the blog", async ({ page }) => {
      const rand = Date.now();
      const title = `Blog Title ${rand}`;
      await createBlog(page, title, "Blog Author", "https://blog.test.com");

      const blog = page
        .locator(".blog")
        .filter({ hasText: `Blog Title ${rand} Blog Author` });
      await blog.getByRole("button", { name: /view/i }).click();
      await expect(blog.getByRole("button", { name: /remove/i })).toBeVisible();

      page.on("dialog", async (dialog) => {
        await dialog.accept();
      });
      await page.getByRole("button", { name: /remove/i }).click();

      await expect(
        blog.getByText(`Blog Title ${rand} Blog Author`)
      ).not.toBeVisible();
    });
  });
});
