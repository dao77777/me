import { getTableName, sql, Table } from "drizzle-orm";
import { db } from ".";
import * as schema from "./schema";
import _ from "lodash";

const resetTable = async (table: Table) => {
  return db.execute(
    sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`)
  )
};

await Promise.all(
  _
    .entries(schema)
    .map(async ([, table]) => {
      await resetTable(table);
    })
);
