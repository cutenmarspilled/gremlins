//@ts-ignore
import { io } from "https://cdn.socket.io/4.3.0/socket.io.esm.min.js";
const socket = io();
import gtvMessage from "../core/messages/gtvmessage.js";
import UserCache from "../core/utils/usercache.js";
import User from "../core/user.js";
const selfID = socket.id;
let selfName = "";
const toggle = document.querySelector(".switch input");
const switchText = document.querySelector(".switch-text");
const lightBackground = getComputedStyle(document.documentElement).getPropertyValue("--light-background");
const darkBackground = getComputedStyle(document.documentElement).getPropertyValue("--dark-background");
const lightText = getComputedStyle(document.documentElement).getPropertyValue("--light-text");
const darkText = getComputedStyle(document.documentElement).getPropertyValue("--dark-text");
const danceGif = document.getElementById("party-hard");
const invertGif = document.getElementById("party-hard-invert");
const sendButton = document.getElementById("send-message");
const chatInput = document.getElementById("text-input-element");
const sendMessageButton = document.getElementById("send-message");
// div element for connected users
const connectedUsers = document.getElementById("gtv-connected-users-list");
const gremlinCountText = document.getElementById("gtv-connected-users-text");
switchText.onmousedown = function () {
    return false;
};
function sendMessage() {
    let inputValue = String(chatInput.value);
    if (inputValue) {
        let cm = new gtvMessage(selfName, inputValue, Date.now());
        socket.emit("gc-chat-message", cm);
        chatInput.value = "";
    }
}
toggle.addEventListener("change", function () {
    if (this.checked) {
        // switch to dark mode
        document.documentElement.style.setProperty("--light-background", darkBackground);
        document.documentElement.style.setProperty("--light-text", darkText);
        document.documentElement.style.setProperty("--button-background", "#34537a");
        document.documentElement.style.setProperty("--chatbox-background", "#4b59a0");
        document.documentElement.style.setProperty("--chat-window-background", "#4b59a0");
        document.documentElement.style.setProperty("--message-text", "aliceblue");
        switchText.textContent = "😈";
        switchText.style.color = "var(--light-text)";
        sendButton.style.color = "var(--light-text)";
        // find the input box placeholder set and set it to aliceblue
        // set the placeholder text color to a transparent aliceblue
        danceGif.style.visibility = "hidden";
        invertGif.style.visibility = "visible";
    }
    else {
        // switch to light mode
        // Restore the original value of --light-background
        document.documentElement.style.setProperty("--light-background", lightBackground);
        document.documentElement.style.setProperty("--light-text", lightText);
        document.documentElement.style.setProperty("--button-background", "#d4aaa8");
        document.documentElement.style.setProperty("--chatbox-background", "#fff");
        // set chat-window-background to a nice bright pink:
        document.documentElement.style.setProperty("--chat-window-background", "#FFC9EF");
        document.documentElement.style.setProperty("--message-text", "#141e23");
        switchText.textContent = "😇";
        switchText.style.color = "var(--light-text)";
        sendButton.style.color = "var(--dark-text)";
        danceGif.style.visibility = "visible";
        invertGif.style.visibility = "hidden";
    }
});
chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});
socket.on("gs-welcome", (msg) => {
    selfName = msg.selfName;
    const users = msg.users;
    console.log(`server says welcome: ${selfName}`);
    console.log(`ayy we got some users: ${users.length}`);
    for (let i = 0; i < users.length; i++) {
        UserCache.addUser(users[i]);
    }
    gremlinCountText.textContent = `gremblins: ${UserCache.getUsers().length}`;
    console.log(`UserCache: ${UserCache.getUsers().length} user length`);
    updateUserCache();
});
socket.on("gs-message", (data) => {
    const message = document.createElement("div");
    message.className = "message";
    //let time = unixToLocaleDateTime(data.timestamp);
    let time = new Date(data.timestamp);
    message.textContent = `(${time.toLocaleDateString()}: ${time.toLocaleTimeString()})[${data.name}]:${data.message}`;
    if (data.name == selfName) {
        message.style.color = "red";
    }
    document.getElementById("msg-box")?.appendChild(message);
});
socket.on("gs-user-joined", (name) => {
    const message = document.createElement("div");
    message.className = "message";
    const user = document.createElement("p");
    user.className = "user";
    user.textContent = "anon " + name;
    if (name === selfName) {
        message.textContent = `anon ${name} (You) joined`;
        user.textContent += " (You)";
    }
    else {
        message.textContent = `anon ${name} joined`;
        let newUser = new User(name, socket.id);
        UserCache.addUser(newUser);
    }
    document.getElementById("msg-box")?.appendChild(message);
    connectedUsers.appendChild(user);
    gremlinCountText.textContent = `gremblins: ${UserCache.getUsers().length}`;
    updateUserCache();
});
socket.on("gs-user-left", (name, id) => {
    const message = document.createElement("div");
    message.className = "message";
    message.textContent = `anon ${name} left`;
    document.getElementById("msg-box")?.appendChild(message);
    let user = UserCache.getUserBySocket(id);
    UserCache.removeUser(user);
    gremlinCountText.textContent = `gremblins: ${UserCache.getUsers().length}`;
    updateUserCache();
});
function updateUserCache() {
    connectedUsers.innerHTML = "";
    let users = UserCache.getUsers();
    for (let i = 0; i < users.length; i++) {
        const user = document.createElement("p");
        user.className = "user";
        if (users[i].name === selfName) {
            user.textContent = "anon " + users[i].name + " (You)";
        }
        else {
            user.textContent = "anon " + users[i].name;
        }
        connectedUsers.appendChild(user);
    }
}
function unixToLocaleDateTime(unixTimestamp) {
    // Convert Unix timestamp to milliseconds
    var timestampInMs = unixTimestamp * 1000;
    // Create a new Date object
    var date = new Date(timestampInMs);
    // Extract the local date and time as separate values
    var localDate = date.toLocaleDateString();
    var localTime = date.toLocaleTimeString();
    // Return as an object with properties for date and time
    return { date: localDate, time: localTime };
}
