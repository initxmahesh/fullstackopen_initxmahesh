const loginWith = async (page, username, password) => {
  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: /login/i }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: /create new blog/i }).click();
  await page.getByLabel("title:").fill(title);
  await page.getByLabel("author:").fill(author);
  await page.getByLabel("url:").fill(url);
  await page.getByRole("button", { name: /create/i }).click();
  await page.getByText(`a new blog ${title} by ${author} added`).waitFor();
};
export { loginWith, createBlog };
