const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, blog) => (
        sum = acc + blog.likes
    ),0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    return blogs.reduce((acc, blog) => (
        blog.likes > acc.likes ? blog : acc
    ))
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
      return null
  }

  const blogMap = {}

  blogs.forEach(blog => {
    blogMap[blog.author] = (blogMap[blog.author] || 0) + 1
  })

  const topAuthor = Object.keys(blogMap).reduce((max, author)=> {
    return blogMap[author] > blogMap[max] ? author : max
  })

  return {
    author: topAuthor,
    blogs: blogMap[topAuthor]
  }
}


module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs
}