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
      ).toBeVisible({ timeout: 4000 });

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

    test("creator only has remove button", async ({ page, request }) => {
      const rand = Date.now();
      const title = `Blog Title ${rand}`;
      await createBlog(page, title, "Blog Author", "https://blog.test.com");

      await expect(
        page.getByText(`a new blog ${title} by Blog Author added`)
      ).toBeVisible({ timeout: 8000 });

      const blog = page
        .locator(".blog")
        .filter({ hasText: `Blog Title ${rand} Blog Author` });
      await blog.getByRole("button", { name: /view/i }).click();
      await expect(blog.getByRole("button", { name: /remove/i })).toBeVisible();

      await page.getByRole("button", { name: /logout/i }).click();
      await request.post("/api/users", {
        userdb: {
          username: "initxmahesh1",
          name: "mahesh",
          password: "password",
        },
      });

      await loginWith(page, "initxmahesh1", "password");

      await blog.getByRole("button", { name: /view/i }).click();
      await expect(
        blog.getByRole("button", { name: /remove/i })
      ).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "initxmahesh", "password");
    });

    test("sorted blogs acc. to likes", async ({ page }) => {
      const rand = Date.now();
      const rand1 = rand + 1;
      const title1 = `Blog Title ${rand}`;
      const title2 = `Blog Title ${rand1}`;

      await createBlog(page, title1, "Blog Author1", "https://blog.test1.com");
      await createBlog(page, title2, "Blog Author2", "https://blog.test2.com");

      const blog1 = page
        .locator(".blog")
        .filter({ hasText: `${title1} Blog Author1` });
      const blog2 = page
        .locator(".blog")
        .filter({ hasText: `${title2} Blog Author2` });

      await blog1.getByRole("button", { name: /view/i }).click();
      await blog2.getByRole("button", { name: /view/i }).click();

      await blog2.getByRole("button", { name: /like/i }).click();
      await expect(blog2).toContainText("likes 1");

      await blog2.getByRole("button", { name: /like/i }).click();
      await expect(blog2).toContainText("likes 2");

      await expect(blog1).toContainText("likes 0");

      const allBlogs = page.locator(".blog");
      const count = await allBlogs.count();

      let blog1Index = -1;
      let blog2Index = -1;
      for (let i = 0; i < count; i++) {
        const text = await allBlogs.nth(i).textContent();
        if (text.includes(`${title1} Blog Author1`)) blog1Index = i;
        if (text.includes(`${title2} Blog Author2`)) blog2Index = i;
      }

      expect(blog2Index).toBeLessThan(blog1Index);
    });
  });
});
