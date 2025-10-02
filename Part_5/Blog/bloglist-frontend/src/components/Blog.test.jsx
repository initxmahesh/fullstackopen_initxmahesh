import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { expect, vi } from "vitest";
import CreateBlog from "./CreateBlog";

const blog = {
  title: "Component testing is done with react-testing-library",
  author: "Test Author",
  url: "https://testurl.com",
  likes: 5,
  user: {
    username: "testuser",
    name: "Test User",
  },
};

test("renders title and author by default", () => {
  render(<Blog blog={blog} />);

  expect(screen.getByText(`${blog.title} ${blog.author}`)).toBeDefined();

  const data = screen.queryByText(blog.url);
  expect(data).toBeNull();

  const likes = screen.queryByText(`likes ${blog.likes}`);
  screen.debug(likes);
  expect(likes).toBeNull();
});

test("renders title", () => {
  const blogWithTitleOnly = {
    title: "Component testing is done with react-testing-library",
  };

  render(<Blog blog={blogWithTitleOnly} />);

  const element = screen.getByText(
    "Component testing is done with react-testing-library"
  );
  screen.debug(element);
  expect(element).toBeDefined();
});

test("renders title and author, but not url or likes by default", () => {
  render(<Blog blog={blog} />);

  const titleEle = screen.getByText(
    "Component testing is done with react-testing-library Test Author"
  );
  expect(titleEle).toBeInTheDocument();

  const urlEle = screen.queryByText("https://testurl.com");
  expect(urlEle).toBeNull();

  const likesEle = screen.queryByText("likes 5");
  expect(likesEle).toBeNull();
});

test("shows url and likes when view button is clicked", async () => {
  const user = userEvent.setup();
  render(<Blog blog={blog} />);

  const viewButton = screen.getByText("view");
  await user.click(viewButton);

  expect(screen.getByText(blog.url)).toBeInTheDocument();
  expect(screen.getByText(`likes ${blog.likes}`)).toBeInTheDocument();
});

test("calls event handler twice when like button is clicked twice", async () => {
  const user = userEvent.setup();
  const handleLike = vi.fn();
  render(<Blog blog={blog} handleLike={handleLike} />);

  const viewButton = screen.getByText("view");
  await user.click(viewButton);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(handleLike).toHaveBeenCalledTimes(2);
});

test("form calls event handler with correct details when new blog is created", async () => {
  const handleCreate = vi.fn();
  const user = userEvent.setup();

  render(<CreateBlog createBlog={handleCreate} />);

  const TitleField = screen.getByLabelText("title:");
  const AuthorField = screen.getByLabelText("author:");
  const UrlField = screen.getByLabelText("url:");

  await user.type(TitleField, "Test Blog Title");
  await user.type(AuthorField, "Test Author");
  await user.type(UrlField, "http://testurl.com");

  const createButton = screen.getByRole("button", { name: /create/i });
  await user.click(createButton);

  expect(handleCreate).toHaveBeenCalledTimes(1);
  expect(handleCreate).toHaveBeenCalledWith({
    title: "Test Blog Title",
    author: "Test Author",
    url: "http://testurl.com",
  });
});
