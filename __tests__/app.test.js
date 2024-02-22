const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const endpoints = require("../endpoints.json");
const { toBeSorted, toBeSortedBy } = require("jest-sorted");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("should respond with an array of topic objects with correct properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const topics = res.body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  describe("error handling get requests", () => {
    test("should respond with status code 404 if the endpoint is not found", () => {
        return request(app)
        .get("/api/invaid-endpoint")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("404 Error. This page doesn't exist");
        });
    });
  });
});
describe("GET /api", () => {
  test("should return the endpoints JSON object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(endpoints);
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("should respond with an object with the correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        const body = res.body;
        expect(body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  describe("error handling for GET article id", () => {
    test("status:400, responds with an error message when passed a bad article ID", () => {
      return request(app)
        .get("/api/articles/notAnID")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });

    test("should respond with 404 if article_id does not exist", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then((res) => {
          const msg = res.body.msg;
          expect(msg).toBe("No article found for article_id: 9999");
        });
    });
  });
});
describe("GET/api/articles", () => {
  test("should respond with an array of article objects with correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articles = res.body;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
          });
        });
      });
  });
  test("articles in the array should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articles = res.body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("GET/api/articles/:article_id/comments", () => {
  test("should respond with an array of comments for given article_id, each with the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        
        expect(res.body).toHaveLength(11);
        res.body.forEach((comment) => {
          expect(comment).toMatchObject({
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("comments in the array should be sorted by date in descending order, the most recent comment first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const comments = res.body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  describe("error handling for GET comments", () => {
    test("status:400, responds with an error message when passed a bad article ID", () => {
      return request(app)
        .get("/api/articles/notAnID/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("responds with status 200 and returns an empty array when given a valid article ID when article does not have comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([]);
        });
    });
  });
});
describe("POST/api/articles/:article_id/comments", () => {
  test("should return the comment from the user with the correct properties and a status 201", () => {
    const inputComment = {
      username: "lurker",
      body: "this is a new comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(inputComment)
      .expect(201)
      .then((response) => {
       
        const newComment = response.body.comment;
        expect(newComment).toMatchObject({
          body: expect.any(String),
          votes: expect.any(Number),
          author: expect.any(String),
          article_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  describe("error handling for post comment", () => {
    test("should response with Status 400 if the body is missing", () => {
      const inputComment = {
        username: "lurker",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(inputComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("should response with Status 400 if the username is missing", () => {
      const inputComment = {
        body: "body without username",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(inputComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
});
