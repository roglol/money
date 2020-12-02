const socket = io("http://localhost:4000");
let sexyOdds = [];

let arbs = document.querySelector(".bets");
socket.on("odds", (payload) => {
	console.log(payload);
	arbs.innerHTML = "";
	sexyOdds = sexyOdds.filter(
		(item) => item.sport.toLowerCase() !== payload.sport.toLowerCase(),
	);
	sexyOdds = sexyOdds.concat(payload.data);
	sexyOdds.forEach((item) => {
		if (worthyOdds(item.betfair, item.crystal)) {
			arbs.insertAdjacentHTML(
				"beforeend",
				`
			<div class="item">
			<div class="item-header">
			   ${item.sport}
			</div> 
			<div class="item-content">
				<div>
					<div class="name">${item.event}</div>
					<div class="coeff">
						<span>${item.oddType}</span>
						<span>${item.betfair}</span>
					</div>
				</div>
				<div>
					<div class="name">${item.event}</div>
					<div class="coeff">
						<span>${item.oddType}</span>
						<span>${item.crystal}</span>
					</div>
				</div>
			</div>
			</div>`,
			);
		}
	});
});
let calculatorReverse = () => {
	stats.innerHTML = "";
	if (crystalStake.value && crystalCoeff.value && betfairCoeff.value) {
		let a = betfairCoeff.value;
		let b = crystalCoeff.value;
		let z = crystalStake.value;
		let c = z * b - z;
		let d = (z / 0.965 + c) / a;

		let adjara = d * 0.965 - z - d * a * 0.01;
		let betlive = z * b - z - (d * a - d) - z * b * 0.01;
		stats.insertAdjacentHTML(
			"beforeend",
			`
		<div><span>Adjara Stake</span><span>${d.toFixed(0)}</span></div>
		<div><span>Adjara Win</span><span>${adjara.toFixed(0)}</span></div>
		<div><span>Crystal Win</span><span>${betlive.toFixed(0)}</span></div>
		`,
		);
	}
};

let worthyOdds = (a, b) => {
	let z = 3000;
	let c = z * b - z;
	let d = (z / 0.965 + c) / a;
	let adjara = d * 0.965 - z - d * a * 0.01;
	let betlive = z * b - z - (d * a - d) - z * b * 0.01;
	return Math.max(adjara, betlive) > 40;
};

let crystalStake = document.querySelector(".crystal-stake");
let crystalCoeff = document.querySelector(".crystal-coeff");
let betfairCoeff = document.querySelector(".betfair-coeff");
let stats = document.querySelector(".bet-stats");
crystalStake.addEventListener("input", calculatorReverse);
crystalCoeff.addEventListener("input", calculatorReverse);
betfairCoeff.addEventListener("input", calculatorReverse);
