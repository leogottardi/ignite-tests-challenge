import { hash } from "bcryptjs";
import { randomUUID } from "crypto";
import supertest from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database";

import { app } from "../../../../../src/app";

let connection: Connection;
describe("Authenticate User", () => {
  beforeEach(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const id = randomUUID();
    const password_hash = await hash("123456", 8);

    await connection.query(
      `INSERT INTO users (id, name, email, password, created_at) VALUES ('${id}', 'Jhon Doe', 'test@test.com', '${password_hash}', 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate user", async () => {
    const response = await supertest(app).post("/api/v1/sessions").send({
      email: "test@test.com",
      password: "123456",
    });

    expect(response.body).toHaveProperty("token");
  });
});
