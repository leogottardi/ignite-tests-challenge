import createConnection from "../../../../database";
import { app } from "../../../../../src/app";
import { Connection } from "typeorm";
import { randomUUID } from "crypto";
import supertest from "supertest";
import { hash } from "bcryptjs";

let connection: Connection;

describe("Show User Profile", () => {
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

  it("should be able to show user profile", async () => {
    const requestToken = await supertest(app).post("/api/v1/sessions").send({
      email: "test@test.com",
      password: "123456",
    });
    const { token } = requestToken.body;

    const request = await supertest(app)
      .get("/api/v1/profile")
      .set("Authorization", `Bearer ${token}`);

    const user = request.body;

    expect(user).toHaveProperty("id");
  });
});
