import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Balance of user", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    );
  });

  it("should be able to get balance of user", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "John Doe",
      email: "test@test.com",
      password: "123456",
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id });

    expect(balance).toHaveProperty("balance");
    expect(balance).toHaveProperty("statement");
  });

  it("should be able to get balance of user with deposit", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "John Doe",
      email: "test@test.com",
      password: "123456",
    });

    await statementsRepositoryInMemory.create({
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Salary",
      user_id: user.id,
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id });

    expect(balance).toHaveProperty("balance");
    expect(balance).toHaveProperty("statement");
    expect(balance.balance).toBe(100);
  });
});
