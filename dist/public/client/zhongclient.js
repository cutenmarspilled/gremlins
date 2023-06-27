"use strict";
const tayInputField = document.getElementById('tay-input');
const senInputField = document.getElementById('sen-input');
function handleKeyup(event) {
    // Check if the input value is not empty
    if (this.value != "") {
        // Check if the enter key was pressed
        if (event.key == "Enter") {
            // Display a confirmation message and prompt the user to type 'sentay'
            let confirmation = prompt("Are you sure you want to add this value? Type 'sentay' to confirm.");
            // Check if the user typed 'sentay'
            if (confirmation == "sentay") {
                // Do something with the input value
                console.log("Value added: " + this.value);
            }
        }
    }
}
// Add the keyup event listener to the input elements
tayInputField.addEventListener("keyup", this.handleKeyup.bind(this));
senInputField.addEventListener("keyup", this.handleKeyup.bind(this));
