import Knex from "knex";
import config from "../knexfile";

const knexInstance = Knex(config.development);

export default knexInstance;
