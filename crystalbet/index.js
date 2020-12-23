const puppeteer = require("puppeteer");
const { types } = require("./types");

class Crystal {
	constructor(sport) {
		this.type = types[sport];
		this.sport=sport;
		this.page = null;
		this.browser = null;
	}


	async getCategoryGames(type) {
		try {
			let sport = this.sport
			this.browser = await puppeteer.launch({
				headless: true,
			});
			this.page = await this.browser.newPage();
			await this.page.setViewport({ width: 1280, height: 720 });
			await this.page.setDefaultNavigationTimeout(0);
			await this.page.goto("https://www.crystalbet.com/Pages/Sports.aspx", {
				waitUntil: "load",
				timeout: 0,
			});
            if(type !=2){
				let selector =`.tp-sport-type:nth-child(${type})`
				await this.page.waitForSelector(selector);
				await this.page.click(selector);
			}

			await this.page.waitForSelector(".head1_1_new");

			await this.page.click(".head1_1_new");

			await this.page.waitForSelector(".head1_1_new_sub > .en");

			await this.page.click(".head1_1_new_sub > .en");

			await this.page.waitForNavigation();

			await this.page.waitForSelector(".games-holder");
			const sexyOdds = await this.page.$$eval(
				".games-holder  .GContainerList",
				(a,sport) => {
					const data = [];
					for (div of a) {
						let obj = {
							teams: [],
							results: [],
							yesno: [],
						};
						if (div.querySelector(".x_game_title_hint")) {
							let teams = div
								.querySelector(".x_game_title_hint")
								.innerText.split("-");
							teams[0] && obj.teams.push(teams[0].trim());
							teams[1] && obj.teams.push(teams[1].trim());
						}
						if (
							div.querySelector(".col0") &&
							div.querySelector(".col1") &&
							div.querySelector(".col2") &&
							sport === 'football'
						) {
							div.querySelector(".col0").innerText &&
								obj.results.push(div.querySelector(".col0").innerText.trim());
							div.querySelector(".col2").innerText &&
								obj.results.push(div.querySelector(".col2").innerText.trim());
							div.querySelector(".col1").innerText &&
								obj.results.push(div.querySelector(".col1").innerText.trim());
							if (div.querySelector(".col11") && div.querySelector(".col12")) {
								div.querySelector(".col11").innerText &&
									obj.yesno.push(div.querySelector(".col11").innerText.trim());
								div.querySelector(".col12").innerText &&
									obj.yesno.push(div.querySelector(".col12").innerText.trim());
							}
						}else if(
						div.querySelector(".col0") &&
						div.querySelector(".col1") 
						){
							div.querySelector(".col0").innerText &&
							obj.results.push(div.querySelector(".col0").innerText.trim());
							div.querySelector(".col1").innerText &&
							obj.results.push(div.querySelector(".col1").innerText.trim());
						}
						if (
							div.querySelector(".time") &&
							div.querySelector(".time").innerText
						) {
							obj.time = div.querySelector(".time").innerText;
						}
						obj.sport = sport
						data.push(obj);
					}
					return data;
				},
				sport
			);
			await this.browser.close();
			return sexyOdds;
		} catch (error) {
			console.log(error);
			console.error("tyyy errrorrr boloshi to");
			await this.browser.close();
		}
	}

	async getSexyOdds() {
		let output = await this.getCategoryGames(this.type);
		return output;
	}
}

module.exports = Crystal;
