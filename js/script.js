const socket = io("http://localhost:4000");

socket.on("odds", (data) => {
	console.log(data);
});