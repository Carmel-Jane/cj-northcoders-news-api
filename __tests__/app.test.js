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
    test("404: should respond with status code 404 if the endpoint is not found", () => {
      return request(app)
        .get("/api/invaid-endpoint")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("404 Error. This page doesn't exist");
        });
    });
  });
});
describe("POST/api/topics", () => {
  test("shoul respond with the new posted topic", () => {
    const newTopic = {
      slug: "topic name",
      description: "description",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic).toMatchObject({
          slug: "topic name",
          description: "description",
        });
      });
  });
  describe("error handling for post topic",() =>{
  test("400. Should respond with 400 and error message if the request has missing fields", () => {
    const newTopic = {
      description: "missing field",
    };
    return request(app)
      .post("/api/topics")
      .expect(400)
      .send(newTopic)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
})
})
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
    })
      test("should respond with an article with a comment count property", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toHaveProperty("comment_count", 11);
          });
      });
  
  describe("error handling for GET article id", () => {
    test("400. Should respond with 400 and an error message when passed a bad article ID", () => {
      return request(app)
        .get("/api/articles/notAnID")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });

    test("404. Should respond with 404 if article_id does not exist", () => {
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
  test("should respond by with an array of article objects with correct properties, if no query is provided", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articles = res.body.articles
  
        expect(articles.length).toBe(10);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
            votes: expect.any(Number),
            article_id: expect.any(Number)
          });
        });
      });
  });
  test("articles in the array should be sorted by date in descending order by default, if no query is provided", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articles = res.body.articles
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  describe("GET/api/articles topic query", () =>{
    test("responds with an array of articles according to the topic query", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({body}) => {
            expect(body.articles.length).toBe(1);
          });
      });
      describe("error handling for get article topic query", ()=>{
        test("404. Should respond with 404 and error message if the topic doesn't exist", () => {
          return request(app)
            .get("/api/articles?topic=carmel")
            .expect(404)
            .then(({ body: { msg } }) => {
             
              expect(msg).toBe("404 Error. This topic doesn't exist");
            });
        });
  })
});
describe("GET/api/articles sort_by query",() => {
  test("should return articles sorted by the requested column", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
})
describe("GET/api/articles order query",() => {
  test("should return articles ordered ascending if asc is requested", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { ascending: true });
      });
  });
})
describe("GET/api/articles limit query", () =>{
  test("should respond with the same number of articles as the limit request. Limit request is 3, should respond with 3 articles", () => {
    return request(app)
      .get("/api/articles?limit=3")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(3);
      });
  });
  test("should respond with 10 articles if no limit is provided ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
      });
  });
  test("400. Responds with 400 and error message if limit query is invalid", () => {
    return request(app)
      .get("/api/articles?limit=carmel")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
})
describe("GET/api/articles page query", () => {
  test("should respond with the articles on the specified page according to limit and page query", () => {
    return request(app)
      .get("/api/articles?limit=2&page=2")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(2);
        expect(articles).toEqual([
          {
            article_id: 2,
            author: 'icellusedkars',
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            created_at: '2020-10-16T05:03:00.000Z',
            votes: 0,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
            comment_count: 0
          },
          {
            article_id: 13,
            author: 'butter_bridge',
            title: 'Another article about Mitch',
            topic: 'mitch',
            created_at: '2020-10-11T11:24:00.000Z',
            votes: 0,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
            comment_count: 0
          }
        ]
    );
      });
  });
  test("400. Should respond with 400 and error message if page query is invalid", () => {
    return request(app)
      .get("/api/articles?page=carmel")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});
})
describe("POST/api/articles", () => {
  test("should responds with the posted article with the correct properties", () => {
    const newArticle = {
      author: "lurker",
      title: "Posted article",
      body: "Body of new article",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          author: "lurker",
          title: "Posted article",
          body: "Body of new article",
          topic: "cats",
          article_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
        });
      });
  });

  describe("error handling for post article", () => {
    test("400. Should respond with 400 and error message if request is missing a field", () => {
      const newArticle = {
        author: "lurker",
        body: "Mising fields(no title)",
        topic: "cats",
      };
      return request(app)
        .post("/api/articles")
        .expect(400)
        .send(newArticle)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("404. Should respond with 404 and error message if the username doesn't exist", () => {
      const newArticle = {
        author: "Carmel",
        title: "Title",
        body: "Body",
        topic: "cats",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("404 Error. This username doesn't exist");
        });
    });
    test("404. Should respond with 404 and error message if the topic doesn't exist", () => {
      const newArticle = {
        author: "lurker",
        title: "Title",
        body: "Body",
        topic: "carmel",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("404 Error. This topic doesn't exist");
        });
    });
  });
});

describe("GET/api/articles/:article_id/comments", () => {
  test("should respond with an array of comments for given article_id, each with the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const comments = res.body.comments
        expect(comments).toHaveLength(10);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: 1,
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
        const comments = res.body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  describe("error handling for GET comments", () => {
    test("400. Should respond with 400 and an error message when passed a bad article ID", () => {
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
          expect(response.body.comments).toEqual([]);
        });
    });
  });
  describe("GET/api/articles/article_id/comments limit query", () => {
    test("should respond with the number of comments specified by the limit query", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=5")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(5);
        });
    });
    test("should respond with 10 comments by default if there isn't a limit query", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(10);
        });
    });
    test("400. Should respond with 400 and error message if there's an invalid limit query", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=carmel")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
  describe("GET/api/articles/article_id/comments page query", () => {
    test("should return the comments on the page requested by the page query", () => {
      return request(app)
        .get("/api/articles/1/comments?page=2&&limit=2")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([
            {
              comment_id: 18,
              body: "This morning, I showered for nine minutes.",
              article_id: 1,
              author: "butter_bridge",
              votes: 16,
              created_at: "2020-07-21T00:20:00.000Z",
            },
            {
              comment_id: 13,
              body: "Fruit pastilles",
              article_id: 1,
              author: "icellusedkars",
              votes: 0,
              created_at: "2020-06-15T10:25:00.000Z",
            },
          ]);
        });
    });
    test("should return the first page by default if there isn't a page query", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=2")
        .expect(200)
        .then(({ body: { comments } }) => {
      
          expect(comments).toEqual([
            {
              comment_id: 5,
              body: "I hate streaming noses",
              article_id: 1,
              author: "icellusedkars",
              votes: 0,
              created_at: "2020-11-03T21:00:00.000Z",
            },
            {
              comment_id: 2,
              body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
              article_id: 1,
              author: "butter_bridge",
              votes: 14,
              created_at: "2020-10-31T03:03:00.000Z",
            },
          ]);
        });
    });
    test('400. Should return 400 and error message if page query is invalid', () => {
      return request(app)
      .get('/api/articles/1/comments?page=carmel')
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe('Bad request');
      })
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
          body: "this is a new comment",
          votes: expect.any(Number),
          author: "lurker",
          article_id: 1,
          created_at: expect.any(String),
        });
    })})
    test("should return the comment from the user and status 201, even if there are extra properties added to the inputted comment", () => {
        const inputComment = {
          username: "lurker",
          body: "this is a new comment",
          extraProperty: "extra property"
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
        })
  describe("error handling for post comment", () => {
      test("404. Should respond with 404 and error message if the article Id doesn't exist", () => {
        return request(app)
          .post("/api/articles/12345")
          .send({
            username: "lurker",
            body: "New comment",
          })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("404 Error. This page doesn't exist");
          });
      });
      test("404. Should respond with 404 and error message if the username doesn't exist", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "cj",
            body: "New comment",
          })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("404 Error. This username doesn't exist");
          });
      });
      test("400. Should respond with 400 and error message if there is an invalid article ID", () => {
        return request(app)
          .get("/api/articles/carmel/comments")
          .send({
            username: "lurker",
            body: "New comment",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
    });
    test("400. Should responsd with 400 and error message if the body is missing", () => {
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
    
  });

describe("PATCH/api/articles/:article_id", () => {
  test("should respond with updated article with new number of votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 23 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: expect.any(String),
          votes: 123,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  describe("error handling for patch articles", () => {
    test("404. Should respond with 404 error and message when requesting an article that does not exist", () => {
      return request(app)
        .patch("/api/articles/12345")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("404 Error. This article doesn't exist");
        });
    });
    test("400.Should respond with 400 error and message when requesting an invalid ID", () => {
      return request(app)
        .patch("/api/articles/carmel")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("400.Should respond with 400 error and message when request has missing fields, not sending a number", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("400. Should respond with 400 error and message when request has the wrong content, sending a word instead of number", () => {
      return request(app)
        .patch("/api/articles/5")
        .send({ inc_votes: "one" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
});
describe("DELETE/api/comments/:comment_id", () => {
  test("204. Should respond with 204 and no content", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  test("404. Should respond with 404 and error message when the comment id doesn't exist", () => {
    return request(app)
      .delete("/api/comments/12345")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("404 Error. Comment doesn't exist");
      });
  });
  test("400. Should respond with 400 and error message when comment id is invalid", () => {
    return request(app)
      .delete("/api/comments/carmel")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
})
describe("PATCH/api/comments/:comment_id", () => {
  test("should update the votes on comment", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ inc_votes: 10})
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          votes: 24,
          author: "butter_bridge",
          article_id: 1,
          created_at: expect.any(String),
        });
      });
  });
  describe("error handling for patch comments", () =>{
  test("404: responds with 404 and message if comment doesn't exist", () => {
    return request(app)
      .patch("/api/comments/12345")
      .send({ inc_votes: -5 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("404 Error. This comment doesn't exist");
      });
  });
  test("400. Returns 400 and error message if comment ID is invalid", () => {
    return request(app)
      .patch("/api/comments/carmel")
      .send({ inc_votes: 96 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("400. Returns 400 and error message if request is missing a field", () => {
    return request(app)
      .patch("/api/comments/4")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("400. Returns 400 and error message if request has invalid content", () => {
    return request(app)
      .patch("/api/comments/4")
      .send({ inc_votes: "carmel" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});
})
describe("GET/api/users", () =>{
    test("should respond with an array of all users", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users.length).toBe(4);
            users.forEach((user) => {
              expect(user).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              });
            });
          });
      });
})
describe("GET/api/users:username", () =>{
  test("should respond with user object belonging to username", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          avatar_url: expect.any(String),
          name: expect.any(String),
        });
      });
  });
  test("404. Should responds with 404  error message when username does not exist", () => {
    return request(app)
      .get("/api/users/carmel")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("404 Error. This username doesn't exist");
      });
  });
});

