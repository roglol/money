const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const axios = require("axios");
var stringSimilarity = require("string-similarity");

io.on("connection", async function (socket) {
	let crystal = await getCrystal();
	// socket.emit("odds", crystal);
	let markets = await getBetfairMarkets();
	// socket.emit("odds", markets);
	let temp = await getBetfairOdds(markets);
	// socket.emit("odds", temp);
	// let count = 0;
	let egaa = [];
	for (let i = 0; i < crystal.length; i++) {
		console.log(i);
		let odds = crystal[i];
		const betfair = temp.find((item, key) => {
			if (odds && odds.teams[0] && odds.teams[1]) {
				let found =
					similarity(odds.teams[0].toLowerCase(), item.teams[0].toLowerCase()) >
						0.4 &&
					similarity(odds.teams[1].toLowerCase(), item.teams[1].toLowerCase()) >
						0.4;
				if (found) {
					temp[key].found = true;
					return true;
				}
			}
		});
		let obj = {};
		if (betfair) {
			if (betfair.results[0] && betfair.results[0] < odds.results[0]) {
				obj["type"] = odds["teams"][0] + " wins " + odds["teams"][1];
				obj.betfair = betfair.results[0];
				obj.crystal = odds.results[0];
				egaa.push(obj);
			}
			if (betfair.results[1] && betfair.results[1] < odds.results[1]) {
				obj["type"] = odds["teams"][1] + " draw " + odds["teams"][0];
				obj.betfair = betfair.results[1];
				obj.crystal = odds.results[1];
				egaa.push(obj);
			}
			if (betfair.results[2] && betfair.results[2] < odds.results[2]) {
				obj["type"] = odds["teams"][1] + " wins " + odds["teams"][0];
				obj.betfair = betfair.results[2];
				obj.crystal = odds.results[2];
				egaa.push(obj);
			}
		}
	}
	socket.emit("odds", egaa);
	socket.emit(
		"odds",
		temp.filter((item) => !item.found),
	);
});

similarity = (a, b) => {
	var similar = stringSimilarity.compareTwoStrings(a, b);
	return similar;
};

let formData = {
	filter: {
		marketBettingTypes: ["ODDS"],
		productTypes: ["EXCHANGE"],
		marketTypeCodes: ["MATCH_ODDS"],
		selectBy: "RANK",
		contentGroup: { language: "en", regionCode: "UK" },
		turnInPlayEnabled: true,
		inPlay: false,
		maxResults: 0,
		eventTypeIds: [1],
	},
	facets: [
		{
			type: "EVENT_TYPE",
			skipValues: 0,
			next: {
				type: "COMPETITION",
				skipValues: 0,
				next: {
					type: "EVENT",
					skipValues: 0,
					next: { type: "MARKET", next: { type: "COMPETITION" } },
				},
			},
		},
	],
	currencyCode: "USD",
	locale: "en",
};

getBetfairMarkets = async function () {
	try {
		let betfairMarkets = await axios.post(
			"https://www.betfair.com/www/sports/navigation/facet/v1/search?_ak=nzIFcwyWhrlwYMrh&alt=json",
			formData,
		);
		let ids = [];
		let betfairEvents = betfairMarkets.data.attachments.markets;
		for (const [key, value] of Object.entries(betfairEvents)) {
			ids.push(key);
		}
		return ids;
	} catch (err) {
		console.log(err);
	}
};
runnerOdd = (odd, num) => {
	return odd.runners[num] && odd.runners[num].exchange.availableToLay
		? odd.runners[num].exchange.availableToLay[0].price
		: null;
};
getBetfairOdds = async function (markets) {
	let sexyOdds = [];
	for (let i = 0; i < markets.length; i += 25) {
		let id = markets.slice(i, i + 25).join(",");
		let url = `https://ero.betfair.com/www/sports/exchange/readonly/v1/bymarket?_ak=nzIFcwyWhrlwYMrh&alt=json&currencyCode=GEL&regionCode=GEO&locale=en&marketIds=${id}&rollupLimit=25&rollupModel=STAKE&types=MARKET_STATE,MARKET_RATES,MARKET_DESCRIPTION,EVENT,RUNNER_DESCRIPTION,RUNNER_STATE,RUNNER_EXCHANGE_PRICES_BEST,RUNNER_METADATA,MARKET_LICENCE,MARKET_LINE_RANGE_INFO`;
		let res = await axios.get(url);
		res.data.eventTypes[0].eventNodes.forEach((item) => {
			let odds = item.marketNodes;
			let eventName = item.event.eventName.split(" v ");
			const game = {
				teams: [],
				results: [],
			};
			game["teams"].push(eventName[0].trim());
			game["teams"].push(eventName[1].trim());

			for (let i = 0; i < odds.length; i++) {
				let odd = odds[i];
				let marketType = odd.description.marketType;

				if (marketType === "MATCH_ODDS") {
					game["results"].push(runnerOdd(odd, 0));
					game["results"].push(runnerOdd(odd, 2));
					game["results"].push(runnerOdd(odd, 1));
				}
			}
			sexyOdds.push(game);
		});
	}
	return sexyOdds;
};

getCrystal = async () => {
	try {
		var t0 = new Date().getTime();
		/** by default puppeteer launch method have headless option true*/
		const browser = await puppeteer.launch({
			headless: true,
		});
		const page = await browser.newPage();
		await page.setDefaultNavigationTimeout(0);
		await page.goto("https://www.crystalbet.com/Pages/Sports.aspx", {
			waitUntil: "load",
			timeout: 0,
		});

		await page.waitForSelector(".spt_button_16");
		await page.click(".spt_button_16");
		async function all() {
			const all = await page.waitForSelector(".show-all .new_sport_country");
			if (all) {
				await page.click(".show-all .new_sport_country");
			} else {
				await all();
			}
		}
		await all();
		async function en() {
			await page.click(".head1_1_new");
			const en = await page.waitForSelector(".head1_1_new_sub > .en");
			if (en) {
				await page.click(".head1_1_new_sub > .en");
			} else {
				await en();
			}
		}
		await en();

		await page.waitForNavigation({
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector(".x_loop_list");

		const divCount = await page.$$eval(
			".games-holder  .GContainerList",
			(a) => {
				const data = [];
				for (div of a) {
					let obj = {
						teams: [],
						results: [],
					};
					if (div.querySelector(".x_game_title_hint")) {
						let teams = div
							.querySelector(".x_game_title_hint")
							.innerText.split("-");
						obj.teams.push(teams[0].trim());
						obj.teams.push(teams[1].trim());
					}
					if (
						div.querySelector(".col0") &&
						div.querySelector(".col1") &&
						div.querySelector(".col2")
					) {
						obj.results.push(div.querySelector(".col0").innerText.trim());
						obj.results.push(div.querySelector(".col1").innerText.trim());
						obj.results.push(div.querySelector(".col2").innerText.trim());
						data.push(obj);
					}
				}
				return data;
			},
		);
		var t1 = new Date().getTime();
		console.log(
			"Call to doSomething took " + (t1 - t0) / 1000 + " milliseconds.",
		);
		await browser.close();
		return divCount;
	} catch (err) {
		console.error(err);
	}
};

app.use("/js", express.static(path.join(__dirname, "/js")));
app.use("/", express.static(path.join(__dirname, "/public")));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

server.listen(4000, () => console.log("http://localhost:4000"));
