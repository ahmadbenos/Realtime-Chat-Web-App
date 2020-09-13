const socket = io();
const enterForm = document.getElementById("chat-enter");
const chatPage = document.getElementById("chat-page");
const userName = document.getElementById("name");
const onlineNumber = document.getElementById("online-number");
const userMessage = document.getElementById("user-message");
const enterbtn = document.getElementById("enter-btn");
const sendBtn = document.getElementById("send-btn");
const list = document.getElementById("list");
const message = document.getElementById("sent-message");

socket.on("connected", (data) => {
  onlineNumber.innerHTML = data.length;
});

socket.on("user-connected", (data) => {
  onlineNumber.innerHTML = data.users.length;
  showNewConnection(data.name);
});

enterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = userName.value;
  socket.emit("user-name", name);
  enterForm.style.display = "none";
  chatPage.style.display = "block";
  showNewConnection("you");
});

socket.on("message-received", (data) => {
  addMessage(data.name, data.message);
});

socket.on("user-disconnected", (data) => {
  onlineNumber.innerHTML = data.users.length;
  showDisconnection(data.name);
});

sendBtn.addEventListener("click", () => {
  addMessage("you", message.value);
  socket.emit("message-sent", message.value);
  message.value = "";
});

// show sent message
const addMessage = (name, message) => {
  const msgDiv = document.createElement("li");
  msgDiv.className = "list-group-item myListItem";
  const msgInfo = document.createElement("p");
  msgInfo.setAttribute("id", "user-message");
  msgInfo.innerHTML =
    "<span class='msg-name text-primary'>" +
    name +
    ":" +
    "</span>" +
    " " +
    message;
  msgDiv.appendChild(msgInfo);
  list.appendChild(msgDiv);
};

// show user connected alert function
const showNewConnection = (name) => {
  const msgDiv = document.createElement("li");
  msgDiv.className = "list-group-item list-group-item-dark";
  msgDiv.innerText = name + " joined!";
  list.appendChild(msgDiv);
};

// show user disconnected alert function
const showDisconnection = (name) => {
  const msgDiv = document.createElement("li");
  msgDiv.className = "list-group-item list-group-item-warning";
  msgDiv.innerText = name + " left!";
  list.appendChild(msgDiv);
};

//trigger the send button when user presses the "Enter" key
message.addEventListener("keyup", (key) => {
  if (key.keyCode === 13) {
    sendBtn.click();
  }
});
