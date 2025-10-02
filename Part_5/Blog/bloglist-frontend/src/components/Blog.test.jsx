import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

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
