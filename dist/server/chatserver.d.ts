import * as socketIO from "socket.io";
export default class ChatServer {
    private io;
    constructor(io: socketIO.Server);
    generateAnonString(): string;
}
