import express, { Express } from "express";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { routeNotFound, errorHandler } from "./middlewares";
import config from "./config";
import { serve, setup } from 'swagger-ui-express';
import swaggerSpec from "./swagger";
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import log from "./utils/logger";

const app: Express = express();

app.use(express.json());

app.use("/api/v1", rootRouter);
app.use('/api-docs', serve, setup(swaggerSpec));

export const prismaClient = new PrismaClient({
    log: ["query"],
});

app.use(routeNotFound);
app.use(errorHandler);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {
    log.info(`Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
        log.info(`Client disconnected: ${socket.id}`);
    });

    socket.on("customEvent", (data) => {
        log.info(`Received custom event with data: ${data}`);
        socket.emit("responseEvent", { message: "Response from server!" });
    });
});

server.listen(config.port, () => {
    log.info(`Server running on port ${config.port}`);
});

export default io;
