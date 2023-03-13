require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const { WebcastPushConnection } = require("tiktok-live-connector");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/dbConnection");
db();
const userRoutes = require("./routes/userRoutes");

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to Home Route");
});
const username = "malloryhecox1";
//Serever
const server = app.listen(port, () => {
  console.log(`Server is running  on port ${port}`);
});

//Socket Serever
io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// // Create a new connection.
const tiktokConnection = new WebcastPushConnection(username);
// Connect to the chat with our new object.
tiktokConnection
  .connect()
  .then((state) => {
    console.info(`Connected to ${state.roomId}'s live`);
  })
  .catch((err) => {
    console.error("Failed to connect", err);
  });

// Listen for messages/Chat from the TikTok live stream.
// tiktokConnection.on("chat", (data) => {
//   console.log(`User nickname: ${data.nickname}, Commented: ${data.comment}`);
//   /*
//       Example of the log:
//       User nickname: GreatPerson101, Commented: I love this stream!
//     */
// });

// Listen for likes from the TikTok live stream.
// tiktokConnection.on('like', data => {
//     console.log(`${data.uniqueId} sent ${data.likeCount} likes, total likes: ${data.totalLikeCount}`);
// })

// Listen for Gifts from the TikTok live stream.
// tiktokConnection.on("gift", (data) => {
//   if (data.giftType === 1 && !data.repeatEnd) {
//     // Streak in progress => show only temporary
//     console.log(
//       `${data.uniqueId} is sending gift ${data.giftName} x${data.repeatCount}`
//     );
//   } else {
//     // Streak ended or non-streakable gift => process the gift with final repeat_count
//     console.log(
//       `${data.uniqueId} has sent gift ${data.giftName} x${data.repeatCount}`
//     );
//   }
// });

// Listen for Gifts from the TikTok live stream.
// tiktokConnection.on("share", (data) => {
//   console.log(data.uniqueId, "shared the stream!");
// });

io.on("connection", (socket) => {
  console.log("Socket is connected!!!", socket.id);
  // Listen for messages/Chat from the TikTok live stream.
  tiktokConnection.on("chat", (data) => {
    console.log(`User nickname: ${data.nickname}, Commented: ${data.comment}`);
    socket.emit("nickname", `${data.nickname}`);
    socket.emit("comment", `${data.comment}`);
  });

  // Listen for likes from the TikTok live stream.
  tiktokConnection.on("like", (data) => {
    console.log(
      `${data.uniqueId} sent ${data.likeCount} likes, total likes: ${data.totalLikeCount}`
    );
    socket.emit("user", `${data.uniqueId}`);
    socket.emit("likes", `${data.likeCount}`);
    socket.emit("totallikes", `${data.totalLikeCount}`);
  });

  // Listen for Gifts from the TikTok live stream.
  tiktokConnection.on("gift", (data) => {
    if (data.giftType === 1 && !data.repeatEnd) {
      // Streak in progress => show only temporary
      console.log(
        `${data.uniqueId} is sending gift ${data.giftName} x${data.repeatCount}`
      );
      socket.emit("user", `${data.uniqueId}`);
      socket.emit("name", `${data.giftName}`);
    } else {
      // Streak ended or non-streakable gift => process the gift with final repeat_count
      console.log(
        `${data.uniqueId} has sent gift ${data.giftName} x${data.repeatCount}`
      );
      socket.emit("user", `${data.uniqueId}`);
      socket.emit("name", `${data.giftName}`);
    }
  });

  // Listen for Gifts from the TikTok live stream.
  // tiktokConnection.on("share", (data) => {
  //   console.log(data.uniqueId, "shared the stream!");
  // });
  // socket.emit("user", `${data.uniqueId}`);
});
