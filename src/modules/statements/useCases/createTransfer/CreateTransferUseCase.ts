import { OperationType } from "../../../../modules/statements/entities/Statement";
import { IStatementsRepository } from "../../../../modules/statements/repositories/IStatementsRepository";
import { IUsersRepository } from "../../../../modules/users/repositories/IUsersRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { container, inject, injectable } from "tsyringe";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";

interface IRequest {
  from_user_id: string;
  to_user_id: string;
  amount: number;
  description: string;
}

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}
  async execute(data: IRequest): Promise<void> {
    const toUser = await this.usersRepository.findById(data.to_user_id);

    if (!toUser) {
      throw new AppError("Not found user destination");
    }

    if (data.from_user_id === data.to_user_id) {
      throw new AppError("not possible transfer to yourself");
    }

    const getBalanceUseCase = container.resolve(GetBalanceUseCase);

    const userBalance = await getBalanceUseCase.execute({
      user_id: data.from_user_id,
    });

    if (userBalance.balance < data.amount) {
      throw new AppError("User balance is lower than amount");
    }

    await this.statementsRepository.create({
      user_id: data.from_user_id,
      type: OperationType.WITHDRAW,
      amount: data.amount,
      description: `Transfer to ${data.to_user_id}`,
    });

    await this.statementsRepository.create({
      user_id: data.to_user_id,
      sender_id: data.from_user_id,
      amount: data.amount,
      type: OperationType.TRANSFER,
      description: data.description,
    });
  }
}

export { CreateTransferUseCase };
