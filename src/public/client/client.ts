//@ts-ignore
import { io } from "https://cdn.socket.io/4.3.0/socket.io.esm.min.js";
const socket = io();

import gtvMessage from "../core/messages/gtvmessage.js";

import gtvWelcome from "../core/messages/gtvwelcome.js";


import User from "../core/user.js";

const selfID = socket.id;
let selfName = "";

const toggle = document.querySelector(".switch input") as HTMLInputElement;
const switchText = document.querySelector(".switch-text") as HTMLSpanElement;

const lightBackground = getComputedStyle(
  document.documentElement
).getPropertyValue("--light-background");
const darkBackground = getComputedStyle(
  document.documentElement
).getPropertyValue("--dark-background");

const lightText = getComputedStyle(document.documentElement).getPropertyValue(
  "--light-text"
);
const darkText = getComputedStyle(document.documentElement).getPropertyValue(
  "--dark-text"
);

const danceGif = document.getElementById("party-hard") as HTMLImageElement;
const invertGif = document.getElementById(
  "party-hard-invert"
) as HTMLImageElement;

const sendButton = document.getElementById("send-message") as HTMLButtonElement;

const chatInput = document.getElementById(
  "text-input-element"
) as HTMLInputElement;
const sendMessageButton = document.getElementById(
  "send-message"
) as HTMLButtonElement;

// div element for connected users
const connectedUsers = document.getElementById(
  "gtv-connected-users-list"
) as HTMLDivElement;

const gremlinCountText = document.getElementById(
  "gtv-connected-users-text"
) as HTMLSpanElement;

switchText.onmousedown = function () {
  return false;
};

function sendMessage(): void {
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
    document.documentElement.style.setProperty(
      "--light-background",
      darkBackground
    );
    document.documentElement.style.setProperty("--light-text", darkText);
    document.documentElement.style.setProperty(
      "--button-background",
      "#34537a"
    );
    document.documentElement.style.setProperty(
      "--chatbox-background",
      "#4b59a0"
    );
    document.documentElement.style.setProperty(
      "--chat-window-background",
      "#4b59a0"
    );
    document.documentElement.style.setProperty("--message-text", "aliceblue");

    switchText.textContent = "😈";
    switchText.style.color = "var(--light-text)";
    sendButton.style.color = "var(--light-text)";

    danceGif.style.visibility = "hidden";
    invertGif.style.visibility = "visible";
  } else {
    // switch to light mode
    // Restore the original value of --light-background
    document.documentElement.style.setProperty(
      "--light-background",
      lightBackground
    );
    document.documentElement.style.setProperty("--light-text", lightText);
    document.documentElement.style.setProperty(
      "--button-background",
      "#d4aaa8"
    );
    document.documentElement.style.setProperty("--chatbox-background", "#fff");
    // set chat-window-background to a nice bright pink:
    document.documentElement.style.setProperty(
      "--chat-window-background",
      "#FFC9EF"
    );
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

socket.on("gs-welcome", (msg: gtvWelcome) => {
  selfName = msg.selfName;
  const users = msg.users;
  const messageList = msg.msgs;
  console.log(`server says welcome: ${selfName}`);
  console.log(`ayy we got some users: ${users.length}`);

  for (let i = 0; i < users.length; i++) {

    if (users[i].name != selfName) {
      const userEl = document.createElement('p');
      userEl.className = "user";
      userEl.textContent = "anon " + users[i].name;
      connectedUsers.appendChild(userEl);
    }
  }
  gremlinCountText.textContent = 'gremlins: ' + users.length;

  for (let i = 0; i < messageList.length; i++) {
    
    //tay 4-13-23 much of this is a duplicate of message creation code upon a gs-message. prolly turn it into a neat lil function later
    const message = document.createElement("div");
    message.className = "message";
    let time = new Date(messageList[i].timestamp).toLocaleTimeString();
    const formattedTimeString = time.slice(0, time.length - 6) + time.slice(-3);
    message.textContent = `(${formattedTimeString})[${
      messageList[i].name}]:${messageList[i].message}`;
      document.getElementById("msg-box")?.appendChild(message);
  }
});

socket.on("gs-message", (data: gtvMessage) => {
  const message = document.createElement("div");
  message.className = "message";

  let time = new Date(data.timestamp).toLocaleTimeString();
  const formattedTimeString = time.slice(0, time.length - 6) + time.slice(-3);
  message.textContent = `(${formattedTimeString})[${
    data.name
  }]:${data.message}`;

  document.getElementById("msg-box")?.appendChild(message);
});

socket.on("gs-user-joined", (name: string, userList: Array<User>) => {
  console.log(`SELF NAME: ${selfName}, NEW CONNECT:${name}`);
  const message = document.createElement("div");
  message.className = "message";

  const user = document.createElement("p");
  user.className = "user";
  user.textContent = "anon " + name;

  if (name === selfName) {
    message.textContent = `anon ${name} (You) joined`;
    user.textContent += " (You)";
    console.log(`adding user YOU (${name}/${selfName})`);
  } else {
    message.textContent = `anon ${name} joined`;
    console.log(`adding NON-YOU user ${name}`);
  }

  document.getElementById("msg-box")?.appendChild(message);

  connectedUsers.appendChild(user);

  gremlinCountText.textContent = 'gremlins: ' + userList.length;
});

socket.on("gs-user-left", (name: string, id: string, userList: Array<User> ) => {
  console.log(`user ${name} LEFT`);
  const message = document.createElement("div");
  message.className = "message";
  message.textContent = `anon ${name} left`;
  document.getElementById("msg-box")?.appendChild(message);


  let pChildren = connectedUsers.querySelectorAll('p');
  
  for (let p of pChildren) {
    if (p.textContent!.includes(name)) {
      p.remove();
      break;
    }
  }
  gremlinCountText.textContent = 'gremlins: ' + userList.length;
});

function unixToLocaleDateTime(unixTimestamp: number) {
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
