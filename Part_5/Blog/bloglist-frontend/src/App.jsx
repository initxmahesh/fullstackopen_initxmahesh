import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Login from "./components/login";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Logout from "./components/Logout";

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
      setErrorMessage(null);
    } catch {
      setErrorMessage("wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <>
      <h2>blogs</h2>
      <div>
        {user.name} logged in <Logout />
      </div>
      <br />
      {blogs
        .filter((blog) => {
          return blog.user?.username === user.username;
        })
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </>
  );
};

export default App;
