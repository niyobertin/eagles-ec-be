const socket = io();
const form = document.getElementById("send-message");
const messageInput = document.getElementById("message-input");
const userNameInput = document.getElementById("user-name");
const chatsRoom = document.getElementById("messages");
const connectedClients = document.getElementById("active-number");
const active = document.getElementById("active-list");
const token = localStorage.getItem("loginToken");
let userId;

const port = window.location.port;

const LOCAL_URL = `http://localhost:${port}/api/v1/users/login`;
if (token) {
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const { id, name } = decodedToken;
    userNameInput.value = name;
    userId = id;
  } catch (error) {
    console.error("Error parsing token:", error.message);
  }
} else {
  console.error("Token not found in local storage");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const sender = userNameInput.value;
  socket.emit("chat message", { sender, userId, message });
  messageInput.value = "";
});

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("dis connected client", (clients) => {
  connectedClients.innerHTML = clients;
});

socket.on("connected client", (clients) => {
  connectedClients.innerHTML = clients;
});

socket.on("chat message", (msg) => {
  addMessageToUi(msg.sender === userNameInput.value, msg);
});
socket.on("past messages", (messages) => {
  const messagesList = document.getElementById("messages");
  messagesList.innerHTML = "";

  messages.forEach((msg) => {
    addMessageToUi(msg.sender === userNameInput.value, msg);
  });
});

const addMessageToUi = (isOwner, data) => {
  const element = `
    <li class ="${isOwner ? "messages-left" : "messages-right"}">
        <p class="">
            ${data.message}</br>
            <i class="sender">${data.sender} . ${data.createdAt}</i>
        </p>
    </li>
    `;
  chatsRoom.innerHTML += element;
};
