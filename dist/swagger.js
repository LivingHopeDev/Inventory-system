"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const port = process.env.PORT;
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Inventory API',
        version: '1.0.0',
        description: 'API Documentation',
    },
    servers: [
        {
            url: `http://localhost:${port}/api/v1`,
        }
    ],
};
const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts'],
};
const swaggerDoc = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerDoc;
