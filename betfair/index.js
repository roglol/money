const { football, basketball, darts } = require("./formData");
const axios = require("axios");

class Betfair {
	constructor(type) {
		this.sport = type;
		switch (type) {
			case "football":
				this.formData = football;
				break;
			case "basketball":
				this.formData = basketball;
				break;
			case "darts":
				this.formData = darts;
				break;
		}
	}
	runnerOdd(odd, num) {
		return odd.runners[num] && odd.runners[num].exchange.availableToLay
			? odd.runners[num].exchange.availableToLay[0].price
			: null;
	}
	addZeroBefore(n) {
		return (n < 10 ? "0" : "") + n;
	}
	async getBetfairMarkets() {
		try {
			let betfairMarkets = await axios.post(
				"https://www.betfair.com/www/sports/navigation/facet/v1/search?_ak=nzIFcwyWhrlwYMrh&alt=json",
				this.formData,
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
	}
	async getBetfairOdds(markets) {
		let sexyOdds = [];
		for (let i = 0; i < markets.length; i += 25) {
			let id = markets.slice(i, i + 25).join(",");
			let url = `https://ero.betfair.com/www/sports/exchange/readonly/v1/bymarket?_ak=nzIFcwyWhrlwYMrh&alt=json&currencyCode=GEL&regionCode=GEO&locale=en&marketIds=${id}&rollupLimit=25&rollupModel=STAKE&types=MARKET_STATE,MARKET_RATES,MARKET_DESCRIPTION,EVENT,RUNNER_DESCRIPTION,RUNNER_STATE,RUNNER_EXCHANGE_PRICES_BEST,RUNNER_METADATA,MARKET_LICENCE,MARKET_LINE_RANGE_INFO`;
			let res = await axios.get(url);
			res.data.eventTypes[0].eventNodes.forEach((item) => {
				let odds = item.marketNodes;
				let eventName = item.event.eventName.split(" v ");
				let time = new Date(item.event.openDate);

				const game = {
					teams: [],
					results: [],
					time: "",
				};
				game["teams"].push(eventName[0].trim());
				game["teams"].push(eventName[1].trim());
				game.time +=
					this.addZeroBefore(time.getHours()) +
					":" +
					this.addZeroBefore(time.getMinutes());

				for (let i = 0; i < odds.length; i++) {
					let odd = odds[i];
					let marketType = odd.description.marketType;

					if (marketType === "MATCH_ODDS" && this.sport === "football") {
						game["results"].push(this.runnerOdd(odd, 0));
						game["results"].push(this.runnerOdd(odd, 1));
						game["results"].push(this.runnerOdd(odd, 2));
					}
					if (marketType === "MATCH_ODDS" && this.sport === "darts") {
						game["results"].push(this.runnerOdd(odd, 0));
						game["results"].push(this.runnerOdd(odd, 1));
					}
				}
				sexyOdds.push(game);
			});
		}
		return sexyOdds;
	}
	async getSexyOdds() {
		let markets = await this.getBetfairMarkets();
		let temp = await this.getBetfairOdds(markets);
		return temp;
	}
}

module.exports = Betfair;
