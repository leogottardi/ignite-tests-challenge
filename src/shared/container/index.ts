import { container } from "tsyringe";

import { IUsersRepository } from "../../modules/users/repositories/IUsersRepository";
import { UsersRepository } from "../../modules/users/repositories/UsersRepository";

import { IStatementsRepository } from "../../modules/statements/repositories/IStatementsRepository";
import { StatementsRepository } from "../../modules/statements/repositories/StatementsRepository";
import { CreateStatementUseCase } from "../../modules/statements/useCases/createStatement/CreateStatementUseCase";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<IStatementsRepository>(
  "StatementsRepository",
  StatementsRepository
);
