import { randomUUID } from "crypto";
import supertest from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database";

import { app } from "../../../../../src/app";

let connection: Connection;
describe("Create User", () => {
  beforeEach(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    await supertest(app)
      .post("/api/v1/users")
      .send({
        name: "Jhon Doe",
        email: "test@gmail.com",
        password: "123456",
      })
      .expect(201);
  });
});
