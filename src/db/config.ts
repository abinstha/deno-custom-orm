import { Pool } from "../../deps.ts";

export const pool = new Pool(
  {
    user: "postgres",
    hostname: "localhost",
    password: "postgres",
    database: "test_users",
    port: 5432,
  },
  10
);

// await pool.connect();
