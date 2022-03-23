import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepositoryInMemory: IUsersRepository;
let statementsRepositoryInMemory: IStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create Statement", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });

  it("should be able to create a new deposit statment", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "John Doe",
      email: "test@test.com",
      password: "123456",
    });

    const statement = await createStatementUseCase.execute({
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Salary",
      user_id: user.id,
    });

    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("type");
    expect(statement).toHaveProperty("amount");
    expect(statement).toHaveProperty("description");
  });

  it("should be able to create a new withdraw statment", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "John Doe",
      email: "test@test.com",
      password: "123456",
    });

    await createStatementUseCase.execute({
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Salary",
      user_id: user.id,
    });

    const statement = await createStatementUseCase.execute({
      type: OperationType.WITHDRAW,
      amount: 50,
      description: "Salary",
      user_id: user.id,
    });

    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("type");
    expect(statement).toHaveProperty("amount");
    expect(statement).toHaveProperty("description");
  });

  it("should not be able to create a statement if user not found", async () => {
    await expect(
      createStatementUseCase.execute({
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Salary",
        user_id: "not-found",
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a withdraw if insuficient founds", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "John Doe",
      email: "test@test.com",
      password: "123456",
    });

    await createStatementUseCase.execute({
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Salary",
      user_id: user.id,
    });

    await expect(
      createStatementUseCase.execute({
        type: OperationType.WITHDRAW,
        amount: 150,
        description: "Salary",
        user_id: user.id,
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
