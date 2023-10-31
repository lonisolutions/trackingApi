const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("shipments").del();
  console.log("shipments table deleted");

  const data = await fs.promises.readFile(
    path.join(__dirname, "..", "data.csv")
  );

  const rows = [];
  await new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "..", "data.csv"))
      .pipe(csv())
      .on("data", (row) => {
        rows.push(row);
      })
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });

  await knex("shipments").insert(rows);
  console.log("shipments table seeded");
};
