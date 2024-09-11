import { app } from "./app";

document.getElementById("app")!.innerHTML = app();

// const apiURL = "http://localhost:5000/api/hello";

// async function fetchMessage() {
//     try {
//         const response = await fetch(apiURL);
//         const data = await response.json();
//         const messageElement = document.getElementById("message");
//         if (messageElement) {
//             messageElement.textContent = data.message;
//         }
//     } catch (error) {
//         console.error("Error fetching message:", error);
//     }
// }

// document.addEventListener("DOMContentLoaded", () => {
//     fetchMessage();
// });
