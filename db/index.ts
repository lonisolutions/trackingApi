import Knex from "knex";
import config from "../knexfile";

const knexInstance = Knex(config);

export function closeKnexConnection() {
  return knexInstance.destroy();
}

export default knexInstance;
