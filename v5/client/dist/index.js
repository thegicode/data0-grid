"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const apiURL = "http://localhost:5000/api/hello";
function fetchMessage() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(apiURL);
            const data = yield response.json();
            const messageElement = document.getElementById("message");
            if (messageElement) {
                messageElement.textContent = data.message;
            }
        }
        catch (error) {
            console.error("Error fetching message:", error);
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    fetchMessage();
});
