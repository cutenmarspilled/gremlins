import User from "../public/core/user.js";
import gtvWelcome from "../public/core/messages/gtvwelcome.js";
import UserCache from "../public/core/utils/usercache.js";
export default class ChatServer {
    constructor(io) {
        this.io = io;
        this.io.on("connection", (socket) => {
            const anonString = this.generateAnonString();
            const user = new User(anonString, socket.id);
            UserCache.addUser(user);
            const welcome = new gtvWelcome(anonString, UserCache.getUsers());
            this.io.to(socket.id).emit("gs-welcome", welcome);
            this.io.emit("gs-user-joined", anonString);
            socket.on("gc-chat-message", (cm) => {
                console.log(`${cm.timestamp}: [${user.name}] said ${cm.message}`);
                this.io.emit("gs-message", cm);
            });
            socket.on("disconnect", () => {
                UserCache.removeUser(user);
                console.log(`CHAT: ${user.name} dc. new user count: ${UserCache.getUsers().length}`);
                this.io.emit("gs-user-left", anonString, socket.id);
            });
        });
    }
    generateAnonString() {
        return Math.random().toString(36).substr(2, 3);
    }
}
