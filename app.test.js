const request = require("supertest");
const app = require("./app");
const mockingoose = require("mockingoose");
const model = require("./model/user");
require("dotenv").config();
beforeEach(() => {
  mockingoose.resetAll();
});
describe("GET /users", function () {
  it("responds with json", async function () {
    const _doc = [
      {
        _id: "507f191e810c19729de860ea",
        name: "name",
        email: "name@email.com",
      },
    ];

    mockingoose(model).toReturn(_doc, "find");

    const response = await request(app)
      .get("/users")
      .set("Accept", "application/json");
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ utilisateurs: _doc });
  });

  it("responds empty array with json", async function () {
    mockingoose(model).toReturn([], "find");

    const response = await request(app)
      .get("/users")
      .set("Accept", "application/json");
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ utilisateurs: [] });
  });

  it("responds throw an error", async function () {
    try {
      mockingoose(model).toReturn(new Error("something wrong"));
    } catch (e) {
      const response = await request(app)
        .get("/users")
        .set("Accept", "application/json");
      expect(response).toThrow("something wrong");
    }
  });
});

describe("POST /users", function () {
  it("responds with json", async function () {
    const _doc = {
      name: "name",
      email: "name@email.com",
    };

    mockingoose(model).toReturn(_doc, "save");

    const response = await request(app)
      .post("/users")
      .send(_doc)
      .set("Accept", "application/json");
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(_doc);
  });

  it("responds throw an error", async function () {
    mockingoose(model).toReturn(new Error("something"), "save");
    const response = await request(app)
      .post("/users")
      .set("Accept", "application/json");
    expect(response.status).toEqual(500);
    expect(response.body).toEqual({ error: "something" });
  });
});

describe("API /users avec Supertest + Mockingoose", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it("GET /users retourne un tableau rempli", async () => {
    const fakeUsers = [
      { _id: "1", name: "Alice", email: "alice@test.com" },
      { _id: "2", name: "Bob", email: "bob@test.com" },
    ];
    mockingoose(model).toReturn(fakeUsers, "find");
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(res.body.utilisateurs).toHaveLength(2);
    expect(res.body.utilisateurs[0].name).toBe("Alice");
  });

  it("GET /users retourne un tableau vide", async () => {
    mockingoose(model).toReturn([], "find");
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(res.body.utilisateurs).toEqual([]);
  });

  it("GET /users retourne une erreur serveur", async () => {
    mockingoose(model).toReturn(new Error("Erreur Mongo"), "find");
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /users crée un utilisateur (succès)", async () => {
    const user = {
      name: "Test",
      email: "test@example.com",
      password: "123456",
    };
    mockingoose(model).toReturn(user, "save");
    const res = await request(app).post("/users").send(user);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Test");
  });

  it("POST /users retourne une erreur serveur", async () => {
    const user = {
      name: "Test",
      email: "test@example.com",
      password: "123456",
    };
    mockingoose(model).toReturn(new Error("Erreur Mongo"), "save");
    const res = await request(app).post("/users").send(user);
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /users avec body vide retourne une erreur", async () => {
    mockingoose(model).toReturn(new Error("Erreur Mongo"), "save");
    const res = await request(app).post("/users").send({});
    expect([400, 500]).toContain(res.statusCode); // selon la gestion d'erreur de ton modèle
    expect(res.body).toHaveProperty("error");
  });
});
