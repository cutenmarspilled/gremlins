import * as socketIO from "socket.io";

export default class WeebServer {
  private io: socketIO.Server;


  constructor(io: socketIO.Server) {
    this.io = io;

    this.io.on("connection", (socket: socketIO.Socket) => {

        console.log(`WEEB: ${socket.id} connected`);

        socket.on('tay_entry', (mins: number, timestamp: number) => {

            const currentTime = Date.now();


            let date = new Date(timestamp);
            let month: number = date.getMonth();
            month = month + 1;
            let day: number = date.getDate();
            let year: number = date.getFullYear();
            let hours: number = date.getHours();
            let suffix: string = "";
            if (hours < 12) {
                suffix = "am";
            } else {
                suffix = "pm";
            }
            hours = hours % 12;
            if (hours == 0) {
                hours = 12;
            }
            let minutes: number = date.getMinutes();
            let seconds: number = date.getSeconds();
            let output: string = `${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}/${year.toString()} ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}${suffix} PST`;
           
            console.log(`tay_entry: ${mins} (${output})`);

        });

    //   socket.on("disconnect", () => {
    //     console.log(`WEEB: ${user.name} dc. new user count: ${UserCache.getUsers().length}`);
    //     this.io.emit("gs-user-left", anonString, socket.id, UserCache.getUsers());
    //   });

    });
  }
}

