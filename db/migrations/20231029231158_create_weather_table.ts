import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("weather", (table) => {
    table.string("postal_code").primary();
    table.string("city");
    table.float("temperature");
    table.string("description");
    table.timestamp("last_fetched").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("weather");
}
