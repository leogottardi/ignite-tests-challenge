import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { hash } from "bcryptjs";
import { CreateUserError } from "./CreateUserError";

let usersRepositoryInMemory: IUsersRepository;
describe("Create user", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
  });

  it("should be able to create user", async () => {
    const password = "123456";
    const passwordHash = await hash(password, 8);

    const user = await usersRepositoryInMemory.create({
      name: "John Doe",
      email: "test@test.com",
      password: passwordHash,
    });

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("name");
  });

  it("should be not able to create user", async () => {
    expect(async () => {
      const password = "123456";
      const passwordHash = await hash(password, 8);

      await usersRepositoryInMemory.create({
        name: "John Doe",
        email: "test@test.com",
        password: passwordHash,
      });

      await usersRepositoryInMemory.create({
        name: "John Doe",
        email: "test@test.com",
        password: passwordHash,
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
