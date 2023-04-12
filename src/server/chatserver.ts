import * as socketIO from "socket.io";
import User from "../public/core/user.js";
import gtvMessage from "../public/core/messages/gtvmessage.js";
import gtvWelcome from "../public/core/messages/gtvwelcome.js";
import UserCache from "../public/core/utils/usercache.js";

export default class ChatServer {
  private io: socketIO.Server;
  
  //array of sent messages
  private messages: Array<gtvMessage>;


  constructor(io: socketIO.Server) {
    this.io = io;
    this.messages = new Array();

    this.io.on("connection", (socket: socketIO.Socket) => {
      const anonString = this.generateAnonString();
      const user = new User(anonString, socket.id);
      UserCache.addUser(user);

      const welcome = new gtvWelcome(anonString, UserCache.getUsers(), this.messages);
      this.io.to(socket.id).emit("gs-welcome", welcome);
      this.io.emit("gs-user-joined", anonString, UserCache.getUsers());

      socket.on("gc-chat-message", (cm: gtvMessage) => {
        console.log(`${cm.timestamp}: [${user.name}] said ${cm.message}`);
        this.messages.push(cm);
        this.io.emit("gs-message", cm);
      });

      socket.on("disconnect", () => {
        UserCache.removeUser(user);
        console.log(`CHAT: ${user.name} dc. new user count: ${UserCache.getUsers().length}`);
        this.io.emit("gs-user-left", anonString, socket.id, UserCache.getUsers());
      });
    });
  }

  public generateAnonString(): string {
    return Math.random().toString(36).substr(2, 3);
  }
}
