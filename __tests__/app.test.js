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
  describe("/api/articles", () => {
    it("200: should return an array of all article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body).toHaveLength(12);
          body.forEach((articles) => {
            console.log(articles)
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
  })
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
          });
        });
    });
    it("400: should return not found if passed an id that doesn't exist", () => {
      return request(app)
        .get("/api/articles/100")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
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
