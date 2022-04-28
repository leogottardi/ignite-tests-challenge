import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

describe("Get Statement", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });
  it("should be able to return a statement", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "John Doe",
      email: "test@gmail.com",
      password: "123456",
    });

    const statement = await statementsRepositoryInMemory.create({
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Salary",
      user_id: user.id,
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id,
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation.id).toBe(statement.id);
  });

  it("should not be able to get a not found user", async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: "not_found_user_id",
        statement_id: "not_found_statement_id",
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get statement with not found statement", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "John Doe",
      email: "test@test.com",
      password: "12345",
    });
    await expect(
      getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "not_found_statement_id",
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
