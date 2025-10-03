import { useState } from "react";

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [view, setView] = useState(false);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const removeStyle = {
    backgroundColor: "blue",
    border: "none",
    padding: "3px 6px",
    borderRadius: "3px",
    marginBottom: 2,
  };

  const showDelete = user && blog.user && blog.user.username === user.username;

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setView(!view)}>{view ? "hide" : "view"}</button>
      </div>
      {view && (
        <div>
          <div>
            <a href={blog.url} target="blank">
              {blog.url}
            </a>
          </div>
          <div>
            likes {blog.likes}{" "}
            <button onClick={() => handleLike(blog)}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {showDelete && (
            <button
              style={removeStyle}
              onClick={() => {
                if (
                  window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
                ) {
                  handleDelete(blog);
                }
              }}
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
