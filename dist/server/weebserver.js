export default class WeebServer {
    constructor(io) {
        this.io = io;
        this.io.on("connection", (socket) => {
            console.log(`WEEB: ${socket.id} connected`);
            socket.on('tay_entry', (mins, timestamp) => {
                const currentTime = Date.now();
                let date = new Date(timestamp);
                let month = date.getMonth();
                month = month + 1;
                let day = date.getDate();
                let year = date.getFullYear();
                let hours = date.getHours();
                let suffix = "";
                if (hours < 12) {
                    suffix = "am";
                }
                else {
                    suffix = "pm";
                }
                hours = hours % 12;
                if (hours == 0) {
                    hours = 12;
                }
                let minutes = date.getMinutes();
                let seconds = date.getSeconds();
                let output = `${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}/${year.toString()} ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}${suffix} PST`;
                console.log(`tay_entry: ${mins} (${output})`);
            });
            //   socket.on("disconnect", () => {
            //     console.log(`WEEB: ${user.name} dc. new user count: ${UserCache.getUsers().length}`);
            //     this.io.emit("gs-user-left", anonString, socket.id, UserCache.getUsers());
            //   });
        });
    }
}
