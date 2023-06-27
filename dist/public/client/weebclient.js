//@ts-ignore
import { io } from "https://cdn.socket.io/4.3.0/socket.io.esm.min.js";
const socket = io();
export default class WeebClient {
    constructor() {
        this.tayInputField = document.getElementById('tay-input');
        this.senInputField = document.getElementById('sen-input');
        this.tayInputField.addEventListener('keyup', this.handleTayEntry.bind(this));
    }
    handleTayEntry(evt) {
        const text = this.tayInputField.value;
        if (text && /^\d{1,3}$/.test(text) && evt.key == 'Enter') {
            console.log(this.tayInputField.value);
            const timestamp = Date.now();
            socket.emit('tay_entry', text, timestamp);
            this.tayInputField.value = '';
        }
        else {
        }
    }
}
const wc = new WeebClient();
// function handleKeyup (this: any, event: KeyboardEvent) {
//     if (this.value != "" && event.key == 'Enter') {
//         let confirmation = prompt("");
//           if (confirmation == "sentay") {
//             console.log ("Value added: " + this.value);
//           }
//     }
//   }
// // Add the keyup event listener to the input elements
// tayInputField.addEventListener("keyup", handleKeyup);
// senInputField.addEventListener("keyup", this.handleKeyup.bind(this));
