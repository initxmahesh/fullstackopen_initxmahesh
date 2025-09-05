const { test, describe, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.deepStrictEqual(result, 5);
  });
});

describe("favorite blog", () => {
  const blogs = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Harmful",
      author: "Edsger Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 1005,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f9",
      title: "Go To Considered Harmful",
      author: "Edsger",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 95,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f5",
      title: "Go Considered Harmful",
      author: "W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 2005,
      __v: 0,
    },
  ];

  test("of many is the one with most likes", () => {
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, {
      _id: "5a422aa71b54a676234d17f5",
      title: "Go Considered Harmful",
      author: "W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 2005,
      __v: 0,
    });
  });
});

describe("most blogs", () => {
  const blogs = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Harmful",
      author: "Mahesh Chaudhary",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 1005,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f9",
      title: "Go To Considered Harmful",
      author: "Edsger",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 95,
      __v: 0,
    },
    {
      _id: "5a439aa74b54a676234d37f6",
      title: "Muna Madan",
      author: "Mahesh Chaudhary",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 20000,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f5",
      title: "Go Considered Harmful",
      author: "W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 2005,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d27f6",
      title: "Jungle of Hurdle",
      author: "Mahesh Chaudhary",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 200,
      __v: 0,
    },
  ];

  test("author with most blogs", () => {
    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, {
      author: "Mahesh Chaudhary",
      blogs: 3,
    });
  });
});

describe("most likes", () => {
  const blogs = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Harmful",
      author: "Mahesh Chaudhary",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 1005,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f9",
      title: "Go To Considered Harmful",
      author: "Edsger",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 95,
      __v: 0,
    },
    {
      _id: "5a439aa74b54a676234d37f6",
      title: "Muna Madan",
      author: "Mahesh Chaudhary",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 20000,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f5",
      title: "Go Considered Harmful",
      author: "W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 2005,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d27f6",
      title: "Jungle of Hurdle",
      author: "Mahesh Chaudhary",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 200,
      __v: 0,
    },
  ];

  test("author with most likes", () => {
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, {
      author: "Mahesh Chaudhary",
      likes: 21205,
    });
  });
});
