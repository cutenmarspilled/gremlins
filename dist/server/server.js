import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import http from "http";
import * as socketIO from "socket.io";
import ChatServer from "./chatserver.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.dirname(__dirname);
class Server {
    constructor(port) {
        this.port = port;
        const expressApp = express();
        expressApp.use(express.static(path.join(distPath, "public")));
        this.httpServer = http.createServer(expressApp);
        this.io = new socketIO.Server(this.httpServer);
        this.chatServer = new ChatServer(this.io);
    }
    run() {
        this.httpServer.listen(this.port, () => {
            console.log(`uwu listening on port ${this.port}`);
        });
    }
}
const server = new Server(29070);
server.run();
