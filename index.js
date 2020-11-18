const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const SexyOdds = require("./helpers/similarity");

io.on("connection", async function (socket) {
	const sexyOdds = new SexyOdds(socket, ["football", "darts"]);
	sexyOdds.generateSexyOdds();
});

app.use("/js", express.static(path.join(__dirname, "/js")));
app.use("/", express.static(path.join(__dirname, "/public")));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

server.listen(4000, () => console.log("http://localhost:4000"));
