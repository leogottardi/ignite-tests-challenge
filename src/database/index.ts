import { createConnection, getConnectionOptions } from "typeorm";

export default async () => {
  const defaultOptions = await getConnectionOptions();

  if (process.env.NODE_ENV === "test") {
    Object.assign(defaultOptions, {
      host: "localhost",
      database: "fin_api",
    });
  }

  return createConnection(defaultOptions);
};
