"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const client_1 = require("@prisma/client");
const middlewares_1 = require("./middlewares");
const config_1 = __importDefault(require("./config"));
const swagger_ui_express_1 = require("swagger-ui-express");
const swagger_1 = __importDefault(require("./swagger"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/v1", routes_1.default);
app.use("/api/docs", swagger_ui_express_1.serve, (0, swagger_ui_express_1.setup)(swagger_1.default));
exports.prismaClient = new client_1.PrismaClient({
    log: ["query"],
});
app.use(middlewares_1.routeNotFound);
app.use(middlewares_1.errorHandler);
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    logger_1.default.info(`Client connected: ${socket.id}`);
    socket.on("disconnect", () => {
        logger_1.default.info(`Client disconnected: ${socket.id}`);
    });
    socket.on("customEvent", (data) => {
        logger_1.default.info(`Received custom event with data: ${data}`);
        socket.emit("responseEvent", { message: "Response from server!" });
    });
});
server.listen(config_1.default.port, () => {
    logger_1.default.info(`Server running on port ${config_1.default.port}`);
});
exports.default = io;
