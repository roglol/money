const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const SexyOdds = require("./helpers/similarity");
const cors = require("cors");

io.on("connection", async function (socket) {
	await generate(socket);
});

async function generate(socket) {
	let sports = ["football","basketball"];
	for (let i = 0; i < sports.length; i++) {
		const sexyOdds = new SexyOdds(sports[i]);
		let odds = await sexyOdds.generateSexyOdds();
		socket.emit("odds", { sport: sports[i], data: odds });
	}
	await generate(socket);
}

app.use("/js", express.static(path.join(__dirname, "/js")));
app.use("/", express.static(path.join(__dirname, "/public")));
app.use(cors());
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

server.listen(4000, () => console.log("http://localhost:4000"));
