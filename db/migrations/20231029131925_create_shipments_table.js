/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("shipments", (table) => {
    table.increments("id").primary();
    table.string("tracking_number").notNullable();
    table.string("carrier").notNullable();
    table.string("sender_address").notNullable();
    table.string("receiver_address").notNullable();
    table.string("article_name").notNullable();
    table.string("article_quantity").notNullable();
    table.string("article_price").notNullable();
    table.string("SKU").notNullable();
    table.string("status").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("shipments");
};
