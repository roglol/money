const { converter } = require("./converter");
var stringSimilarity = require("string-similarity");

const Betfair = require("../betfair/index");
const Crystal = require("../crystalbet/index");

class SexyOdds {
	constructor(socket, sports) {
		this.socket = socket;
		this.sports = sports;
	}
	similarity(a, b) {
		var similar = stringSimilarity.compareTwoStrings(a, b);
		return similar;
	}

	compare(betfairOdds, bookieOdds) {
		const egaa = [];
		for (let i = 0; i < bookieOdds.length; i++) {
			let odds = bookieOdds[i];
			const betfair = betfairOdds.find((item, key) => {
				if (odds && odds.teams[0] && odds.teams[1]) {
					let found =
						this.similarity(
							converter(odds.teams[0].trim()).toLowerCase(),
							item.teams[0].toLowerCase(),
						) > 0.4 &&
						this.similarity(
							converter(odds.teams[1].trim()).toLowerCase(),
							item.teams[1].toLowerCase(),
						) > 0.4 &&
						odds.time === item.time;
					if (found) {
						betfairOdds[key].found = true;
						return true;
					}
				}
			});
			let obj = {};
			if (betfair) {
				if (betfair.results[0] && betfair.results[0] < odds.results[0]) {
					obj["type"] = odds["teams"][0] + " defeats " + odds["teams"][1];
					obj.event= odds["teams"][0] + ' - ' + odds["teams"][1];
					obj.oddType = 1;
					obj.betfair = betfair.results[0];
					obj.crystal = odds.results[0];
					egaa.push(obj);
				}
				if (betfair.results[1] && betfair.results[1] < odds.results[1]) {
					obj["type"] = odds["teams"][1] + " defeats " + odds["teams"][0];
					obj.event= odds["teams"][0] + ' - ' + odds["teams"][1];
					obj.oddType = 2;
					obj.betfair = betfair.results[1];
					obj.crystal = odds.results[1];
					egaa.push(obj);
				}
				if (betfair.results[2] && betfair.results[2] < odds.results[2]) {
					obj["type"] = odds["teams"][1] + " draws " + odds["teams"][0];
					obj.event= odds["teams"][0] + ' - ' + odds["teams"][1];
					obj.oddType = 'draw';
					obj.betfair = betfair.results[2];
					obj.crystal = odds.results[2];
					egaa.push(obj);
				}
			}
		}
		return egaa;
	}

	async generateSexyOdds(sport) {
		let crystal = new Crystal(sport);
		let sexyCrystal = await crystal.getSexyOdds();
		let betfair = new Betfair(sport);
		let sexyBetfair = await betfair.getSexyOdds();
		let sexyOdds = this.compare(sexyBetfair, sexyCrystal);
		return sexyOdds;
	}
}

module.exports = SexyOdds;
