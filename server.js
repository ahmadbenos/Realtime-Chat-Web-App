const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(http);

app.use(express.static(path.join(__dirname, "scripts")));
var users = [];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
  io.once("connection", (socket) => {
    // after user enters name(form submission)
    socket.on("user-name", (name) => {
      users.push({ id: socket.id, name: name });
      const sentUser = users.find((currentUser) => {
        return currentUser.id === socket.id;
      });
      socket.broadcast.emit("user-connected", {
        users: users,
        name: sentUser.name,
      });
    });

    //on disconnect
    socket.on("disconnect", () => {
      const userToRemove = users.findIndex((x) => x.id === socket.id);
      const sentUser = users.find((currentUser) => {
        return currentUser.id === socket.id;
      });
      users.splice(userToRemove, 1);

      // checking user length to prevent server crashing
      if (users.length > 0) {
        socket.broadcast.emit("user-disconnected", {
          users: users,
          name: sentUser.name,
        });
      }
      console.log(users);
    });

    //show current number of online users when entering chat
    socket.emit("connected", users);

    // when user sends a message
    socket.on("message-sent", (message) => {
      const sentUser = users.find((currentUser) => {
        return currentUser.id === socket.id;
      });
      socket.broadcast.emit("message-received", {
        message: message,
        name: sentUser.name,
      });
    });
  });
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
