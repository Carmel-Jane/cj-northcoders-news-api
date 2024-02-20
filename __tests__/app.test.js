const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const endpoints = require("../endpoints.json");

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
describe("error handling", () => {
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
describe("GET /api/articles/:article_id", () =>{
    test("should respond with an object with the correct properties", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then((res) => {
            console.log(res.body)
            const body = res.body;
            expect(typeof body).toBe("object");
            expect(body.article).toHaveProperty("author");
            expect(body.article).toHaveProperty("title");
            expect(body.article).toHaveProperty("article_id");
            expect(body.article).toHaveProperty("body");
            expect(body.article).toHaveProperty("topic");
            expect(body.article).toHaveProperty("created_at");
            expect(body.article).toHaveProperty("votes");
            expect(body.article).toHaveProperty("article_img_url");
          });
      });
    });

