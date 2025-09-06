const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  // return blogs.reduce((acc, blog) => acc + blog.likes, 0);

  // Using Lodash Library
  return _.sumBy(blogs, "likes");
};

const favoriteBlog = (blogs) => {
  // return blogs.reduce((acc, blog) => (blog.likes > acc.likes ? blog : acc));

  // Using Lodash Library
  return _.maxBy(blogs, "likes");
};

const mostBlogs = (blogs) => {
  // const blogMap = {};

  // blogs.forEach((blog) => {
  //   blogMap[blog.author] = (blogMap[blog.author] || 0) + 1;
  // });

  // let topAuthor = "";
  // let maxBlogs = 0;

  // for (const author in blogMap) {
  //   if (blogMap[author] > maxBlogs) {
  //     topAuthor = author;
  //     maxBlogs = blogMap[author];
  //   }
  // }
  // return { author: topAuthor, blogs: maxBlogs };

  // Using Lodash Library

  const countBlog = _.countBy(blogs, "author");
  const countAuthor = _.maxBy(
    Object.keys(countBlog),
    (author) => countBlog[author]
  );
  return { author: countAuthor, blogs: countBlog[countAuthor] };
};

const mostLikes = (blogs) => {
  // const likeMap = {};
  // blogs.forEach((blog) => {
  //   likeMap[blog.author] = (likeMap[blog.author] || 0) + blog.likes;
  // });

  // let topAuthor = "";
  // let maxLikes = 0;

  // for (const author in likeMap) {
  //   if (likeMap[author] > maxLikes) {
  //     topAuthor = author;
  //     maxLikes = likeMap[author];
  //   }
  // }
  // return { author: topAuthor, likes: maxLikes };

  // Using Lodash Library

  const countLikes = _.groupBy(blogs, "author");
  const countAuthor = _.maxBy(Object.keys(countLikes), (author) =>
    _.sumBy(countLikes[author], "likes")
  );

  return {
    author: countAuthor,
    likes: _.sumBy(countLikes[countAuthor], "likes"),
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
