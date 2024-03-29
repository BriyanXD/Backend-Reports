import "dotenv/config";

const PORT_APP = process.env.PORT || "3002";
const USER_DB = process.env.USER_DB || "postgres";
const PASS_DB = process.env.PASS_DB || "123456789";
const HOST_DB = process.env.HOST_DB || "localhost";
const PORT_DB = process.env.PORT_DB || "5432";
const NAME_DB = process.env.NAME_DB || "reports";
const ROUTE = process.env.ROUTE || "*";


export {PORT_APP, USER_DB, PASS_DB, HOST_DB, PORT_DB, NAME_DB, ROUTE};