import { PoolClient, QueryObjectResult } from "../../deps.ts";

import { pool } from "./config.ts";
import { IQueryFilter, QueryBuilder } from "./queryBuilder.ts";

export class DbOperations {
  private readonly _table: string;
  private _client!: PoolClient;

  constructor(table: string) {
    this._table = table;
    // this.initClient();
  }

  private initClient = async () => {
    try {
      this._client = await pool.connect();
    } catch (err) {
      console.error("Error initializing the pool client", err);
    }
  };

  get = async (options?: Partial<IQueryFilter>) => {
    let result: QueryObjectResult;
    const client = await pool.connect();
    try {
      const sql = QueryBuilder.build.filter({
        table: this._table,
        columns: options?.columns,
        where: options?.where,
      });
      result = await client.queryObject(sql);
    } finally {
      client.release();
    }
    return result;
  };

  insert = async (data: StringMap) => {
    let result: QueryObjectResult;
    const client = await pool.connect();
    try {
      const sql = QueryBuilder.build.save(this._table, data);
      result = await client.queryObject(sql);
    } finally {
      client.release();
    }
    return result;
  };
}
