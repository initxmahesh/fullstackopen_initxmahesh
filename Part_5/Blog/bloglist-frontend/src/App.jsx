import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Login from "./components/login";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, [user]);

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
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
    <div>
      <h2>blogs</h2>
      <div>{user.name} logged in</div>
      <br />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
