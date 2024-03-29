const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("GET", () => {
  describe("/api/{invalid path}", () => {
    it("404: should return path not found for invalid paths", () => {
      return request(app)
        .get("/api/invalid-path")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path not found!");
        });
    });
  });
  describe("/api/topics", () => {
    it("200: should return an array of all topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body).toHaveLength(3);
          body.forEach((topic) => {
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            });
          });
        });
    });
  });
  describe("/api/users", () => {
    it("200: should return an array of all user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body).toHaveLength(4);
          body.forEach((users) => {
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
  describe("/api/articles", () => {
    it("200: should return an array of all article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body).toHaveLength(12);
          body.forEach((articles) => {
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(Number),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    it("200: should return an array of all article objects sorted by default values", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeSortedBy("created_at", { descending: true });
        });
    });
    it("200: should return an array of all article objects sorted by title", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeSortedBy("title", { descending: true });
        });
    });
    it("200: should return an array of all article objects sorted by created_at in ascending order", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeSortedBy("created_at", { descending: false });
        });
    });
    it("200: should return an array of all article objects when passed 2 queries", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeSortedBy("author", { descending: false });
        });
    });
    it("200: should return an array of all article objects when passed topic query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          body.forEach((article) => {
            expect(article.topic).toBe("mitch")
          })
        });
    });
    
    it("400: should return Invalid Query Request when passed invalid sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=apples")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Query Request");
        });
    });
    it("400: should return Invalid Request when passed invalid order query", () => {
      return request(app)
        .get("/api/articles?order=apple")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Query Request");
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    it("200: should return article object matching article id with its properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            comment_count: 11,
          });
        });
    });
    it("400: should return not found if passed an id that doesn't exist", () => {
      return request(app)
        .get("/api/articles/100")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("ID Not Found");
        });
    });
    it("400: should return Invalid Request", () => {
      return request(app)
        .get("/api/articles/BANANA")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid request");
        });
    });
  });
  describe("/api/articles/:article_id (comment count)", () => {
    it("200: should return article object matching article id with all its properties and added comment_count property", () => {
      return request(app)
        .get("/api/articles/6")
        .expect(200)
        .then(({ body }) => {
          expect(body.comment_count).toBe(1);
          expect(body).toEqual({
            article_id: 6,
            title: "A",
            topic: "mitch",
            author: "icellusedkars",
            body: "Delicious tin of cat food",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: 0,
            comment_count: 1,
          });
        });
    });
    it("404: should return not found if passed an id that doesn't exist", () => {
      return request(app)
        .get("/api/articles/420")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("ID Not Found");
        });
    });
    it("400: should return Invalid Request", () => {
      return request(app)
        .get("/api/articles/APPLE")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid request");
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    it("200: should return array of comment objects matching article id with all its properties", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body).toHaveLength(11);
          body.forEach((comment) => {
            expect.objectContaining({
              comment_id: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            });
          });
        });
    });
    it("200: should return array of comment objects from starting with most recently created", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body).toHaveLength(11);
          expect(body[0].created_at).toBe("2020-11-03T21:00:00.000Z");
          expect(body[1].created_at).toBe("2020-10-31T03:03:00.000Z");
          expect(body[10].created_at).toBe("2020-01-01T03:08:00.000Z");
        });
    });
    it("404: should return Not Found for id that doesnt exist", () => {
      return request(app)
        .get("/api/articles/420/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    it("400: should return Invalid Request", () => {
      return request(app)
        .get("/api/articles/APPLE/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid request");
        });
    });
  });
});

describe("PATCH", () => {
  describe("/api/articles/:article_id", () => {
    it("200: should return article with updated value (Increment)", () => {
      const newVote = {
        inc_votes: 1,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(newVote)
        .expect(200)
        .then(({ body }) => {
          // expect(body.votes).toBe(101);
          expect(body).toEqual({
            article: {
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 101,
            },
          });
        });
    });
    it("200: should return article with updated value (Decrement)", () => {
      const newVote = {
        inc_votes: -100,
      };
      return request(app)
        .patch("/api/articles/2")
        .send(newVote)
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            article: {
              article_id: 2,
              title: "Sony Vaio; or, The Laptop",
              topic: "mitch",
              author: "icellusedkars",
              body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
              created_at: "2020-10-16T05:03:00.000Z",
              votes: -100,
            },
          });
        });
    });
    it("400: should return error if request is invalid", () => {
      const newVote = {
        voting: 1,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Invalid Request");
        });
    });
    it("400: should return error if request is invalid", () => {
      const newVote = {
        inc_vote: "banana",
      };
      return request(app)
        .patch("/api/articles/1")
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Invalid Request");
        });
    });
    it("404: should return error if id is invalid ", () => {
      const newVote = {
        inc_votes: 1,
      };
      return request(app)
        .patch("/api/articles/100")
        .send(newVote)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("ID Not Found");
        });
    });
  });
});

describe("POST", () => {
  describe("/api/articles/:article_id/comments", () => {
    it("201: Add a new comments with all its values", () => {
      const newComment = {
        username: "butter_bridge",
        body: "Very good, very nice",
      };
      return request(app)
        .post("/api/articles/9/comments")
        .send(newComment)
        .expect(201)
        .then(({ body: [comment] }) => {
          expect(comment.comment_id).toBe(19);
          expect(comment.body).toBe("Very good, very nice");
          expect(comment.votes).toBe(0);
          expect(comment.author).toBe("butter_bridge");
          expect(comment.article_id).toBe(9);
          expect(typeof comment.created_at).toBe("string");
        });
    });
    it("400: should return error when passed an invalid keys as request", () => {
      const newComment = {
        user: "P",
        body: "T",
      };
      return request(app)
        .post("/api/articles/9/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Request");
        });
    });
    it("400: should return error when passed an invalid key values as request", () => {
      const newComment = {
        username: 420,
        body: 2000,
      };
      return request(app)
        .post("/api/articles/9/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Request");
        });
    });
    it("400: should return error when passed an invalid id", () => {
      const newComment = {
        username: "gary",
        body: "Borgir",
      };
      return request(app)
        .post("/api/articles/ORANGE/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid request");
        });
    });
    it("404: should return error when passed an non-existing id", () => {
      const newComment = {
        username: "gary",
        body: "Borgir",
      };
      return request(app)
        .post("/api/articles/9999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("ID not Found");
        });
    });
  });
});

describe("DELETE", () => {
  describe("/api/comments/:comment_id", () => {
    it("204: Deletes a comment given a valid id", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    it("404: returns error when passed a non-existing id", () => {
      return request(app).delete("/api/comments/99").expect(404);
    });
    it("400: returns error when passed an invalid id", () => {
      return request(app).delete("/api/comments/apple").expect(400);
    });
  });
});
