import { Pool } from "pg";

const { DB_URI } = process.env;

// export const dbConnection = new Pool({
//   host: PGHOST,
//   database: PGDATABASE,
//   user: PGUSER,
//   password: PGPASSWORD,
//   port: PGPORT,
//   ssl: {
//     require: true,
//   },
// });

export const dbConnection = new Pool({
  connectionString: DB_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});
