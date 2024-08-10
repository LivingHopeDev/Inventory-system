import express, { Express, Response, Request } from "express";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { routeNotFound, errorHandler } from "./middlewares";
import config from "./config";
import { serve, setup } from 'swagger-ui-express';
import swaggerSpec from "./swagger"
const app: Express = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hello from entry file");
});
app.use("/api/v1", rootRouter);
app.use('/api-docs', serve, setup(swaggerSpec));

export const prismaClient = new PrismaClient({
    log: ["query"],

});
app.use(routeNotFound);
app.use(errorHandler);

app.listen(config.port, () => {

    console.log(`Server running on port ${config.port}`);

});

export default app;
