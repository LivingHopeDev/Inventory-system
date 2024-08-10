import swaggerJsdoc, { SwaggerDefinition, Options, } from 'swagger-jsdoc';
const port = process.env.PORT
const swaggerDefinition: SwaggerDefinition = {
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

const options: Options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts'],
};
const swaggerDoc = swaggerJsdoc(options)
export default swaggerDoc;
