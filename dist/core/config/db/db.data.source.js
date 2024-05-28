"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = void 0;
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
const enviroment_1 = require("../server/enviroment");
dotenv.config({ path: enviroment_1.enivroment });
exports.dataSourceOptions = {
    type: process.env.DB_TYPE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    ssl: process.env.DB_SSL_PROFILE === "require" ? { rejectUnauthorized: false } : undefined,
    entities: ['dist/core/data/database/**/*.entity{.ts,.js}'],
    migrations: ['dist/core/config/db/migrations/*{.ts,.js}'],
};
exports.default = new typeorm_1.DataSource(exports.dataSourceOptions);
//# sourceMappingURL=db.data.source.js.map