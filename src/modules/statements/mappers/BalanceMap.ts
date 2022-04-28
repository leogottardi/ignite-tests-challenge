import { OperationType, Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({
    statement,
    balance,
  }: {
    statement: Statement[];
    balance: number;
  }) {
    const parsedStatement = statement.map(
      ({
        id,
        amount,
        description,
        sender_id,
        type,
        created_at,
        updated_at,
      }) => ({
        id,
        amount: Number(amount),
        sender_id: sender_id || undefined,
        description,
        type,
        created_at,
        updated_at,
      })
    );

    return {
      statement: parsedStatement,
      balance: Number(balance),
    };
  }
}
