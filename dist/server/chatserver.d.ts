import * as socketIO from "socket.io";
export default class ChatServer {
    private io;
    private messages;
    constructor(io: socketIO.Server);
    generateAnonString(): string;
}
