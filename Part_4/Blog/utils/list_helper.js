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

module.exports = {
  dummy, totalLikes, favoriteBlog
}