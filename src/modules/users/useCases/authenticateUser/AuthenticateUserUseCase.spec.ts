import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { hash } from "bcryptjs";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepositoryInMemory: IUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
  });

  it("should be able to authorization user", async () => {
    const password = "123456";
    const passwordHash = await hash(password, 8);

    await usersRepositoryInMemory.create({
      name: "John Doe",
      email: "test@test.com",
      password: passwordHash,
    });

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: "test@test.com",
      password: password,
    });

    expect(authenticatedUser).toHaveProperty("token");
  });
  it("should be not able to authorization user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "invalid@invalid.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
