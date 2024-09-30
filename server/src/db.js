import { createPool } from "mysql2/promise";

export const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'halcones11.24',
    port: 3307,
    database: 'aae'
})