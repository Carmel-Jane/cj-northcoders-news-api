const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const endpoints = require("../endpoints.json");
const { toBeSorted, toBeSortedBy } = require('jest-sorted');

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
});
describe("error handling get requests", () => {
  test("should respond with status code 404 if the endpoint is not found", () => {
    return request(app).get("/api/invalid-endpoint").expect(404);
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
});
describe("error handling get article id", () => {
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
        console.log(res.body);
        const msg = res.body.msg;
        expect(msg).toBe("No article found for article_id: 9999");
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
  test("articles in the array should be sorted by date in descending order", () =>{
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then((res) => {
      const articles = res.body;
      expect(articles).toBeSortedBy('created_at', {descending: true})
    })
  })
});
