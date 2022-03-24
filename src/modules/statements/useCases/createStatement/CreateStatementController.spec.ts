import { hash } from "bcryptjs";
import { randomUUID } from "crypto";
import supertest from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const passwordHash = await hash("123456", 8);

    await connection.query(`
      INSERT INTO users (id, name, email, password)
      VALUES ('${randomUUID()}', 'Jhon Doe', 'test@test.com', '${passwordHash}');
    `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new deposit statement", async () => {
    const requestToken = await supertest(app).post("/api/v1/sessions").send({
      email: "test@test.com",
      password: "123456",
    });

    const { token } = requestToken.body;

    await supertest(app)
      .post("/api/v1/statements/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 100,
        description: "Salary",
      })
      .expect(201);
  });

  it("should be able to create a new withdraw deposit", async () => {
    const requestToken = await supertest(app).post("/api/v1/sessions").send({
      email: "test@test.com",
      password: "123456",
    });

    const { token } = requestToken.body;

    await supertest(app)
      .post("/api/v1/statements/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 100,
        description: "Salary",
      });

    await supertest(app)
      .post("/api/v1/statements/withdraw")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 50,
        description: "Salary",
      })
      .expect(201);
  });
});
