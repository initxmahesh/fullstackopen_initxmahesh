import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Login from "./components/login";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Logout from "./components/Logout";
import CreateBlog from "./components/CreateBlog";
import Notify from "./components/Notify";

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const createBlog = async (blog) => {
    const newBlog = await blogService.create(blog);
    setBlogs(blogs.concat(newBlog));
    setSuccessMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`);
    setTimeout(() => setSuccessMessage(null), 5000);

    {
      /* Showing Particular User Logged in Blog */
    }
    // setBlogs(blogs.concat({ ...newBlog, user }));
  };

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
      setErrorMessage(null);
    } catch {
      setErrorMessage("wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {/* {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>} */}
        <Notify message={errorMessage} type="error" />
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <>
      <h2>blogs</h2>
      <Notify message={successMessage} type="success" />
      <div>
        {user.name} logged in <Logout />
      </div>
      <br />
      <div>
        <CreateBlog createBlog={createBlog} />
      </div>

      {/* For particular user logged in */}
      {/* {blogs.filter(blog => blog.user?.username ===user.username)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))} */}

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  );
};

export default App;
