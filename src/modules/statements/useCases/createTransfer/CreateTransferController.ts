import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

export class CreateTransferController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { to_user_id } = request.params;
    const { description, amount } = request.body;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    await createTransferUseCase.execute({
      from_user_id: user_id,
      to_user_id: String(to_user_id),
      description,
      amount,
    });

    return response.send();
  }
}
