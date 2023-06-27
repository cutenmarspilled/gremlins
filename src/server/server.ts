import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import http from "http";
import * as socketIO from "socket.io";

import ChatServer from "./chatserver.js";
import WeebServer from "./weebserver.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.dirname(__dirname);

class Server {
  private httpServer: http.Server;
  private port: string | number;
  private io: socketIO.Server;
  private chatServer: ChatServer;
  private weebServer: WeebServer;

  constructor(port: number) {
    this.port = process.env.PORT || port;
    const expressApp = express();
    expressApp.use(express.static(path.join(distPath, "public")));
    this.httpServer = http.createServer(expressApp);
    this.io = new socketIO.Server(this.httpServer);
    this.chatServer = new ChatServer(this.io);
    this.weebServer = new WeebServer(this.io);
  }

  public run(): void {
    this.httpServer.listen(this.port, () => {
      console.log(`uwu listening on port ${this.port}`);
    });
  }
}

const server = new Server(29070);
server.run();
