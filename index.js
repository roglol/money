const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const SexyOdds = require("./helpers/similarity");
var stringSimilarity = require("string-similarity");

io.on("connection", async function (socket) {
	await generate(socket);
});

async function generate(socket) {
	let sports = ["football"];
	for (let i = 0; i < sports.length; i++) {
		const sexyOdds = new SexyOdds(sports[i]);
		let odds = await sexyOdds.generateSexyOdds();
		socket.emit("odds", { sport: sports[i], data: odds });
	}
	await generate(socket);
}

function similarity(a, b) {
	var similar = stringSimilarity.compareTwoStrings(a, b);
	return similar;
}

app.use("/js", express.static(path.join(__dirname, "/js")));
app.use("/", express.static(path.join(__dirname, "/public")));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

server.listen(4000, () => console.log("http://localhost:4000"));
