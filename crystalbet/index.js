const puppeteer = require("puppeteer");
const types = require("./types");

class Crystal {
	constructor(type) {
		this.type = types[type];
		this.page = null;
		this.browser = null;
	}

	async init() {
		try {
			this.browser = await puppeteer.launch({
				headless: true,
			});
			this.page = await this.browser.newPage();
			await this.page.setDefaultNavigationTimeout(0);
			await this.page.goto("https://www.crystalbet.com/Pages/Sports.aspx", {
				waitUntil: "load",
				timeout: 0,
			});

			await this.page.waitForSelector(this.type);
			await this.page.click(this.type);
			await this.page.waitForSelector(".show-all .new_sport_country");
			await this.page.click(".show-all .new_sport_country");
			await this.page.waitForSelector(".head1_1_new");
			await this.page.click(".head1_1_new");
			await this.page.waitForSelector(".head1_1_new_sub > .en");
			await this.page.click(".head1_1_new_sub > .en");
			await this.page.waitForNavigation();
		} catch (error) {
			console.error("tyyy errrorrr");
			await this.init();
		}
	}

	async getSexyOdds() {
		try {
			await this.init();
			await this.page.waitForSelector(".x_loop_list");
			const sexyOdds = await this.page.$$eval(
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
							teams[0] && obj.teams.push(teams[0].trim());
							teams[1] && obj.teams.push(teams[1].trim());
						}
						if (
							div.querySelector(".col0") &&
							div.querySelector(".col1") &&
							div.querySelector(".col2")
						) {
							div.querySelector(".col0").innerText &&
								obj.results.push(div.querySelector(".col0").innerText.trim());
							div.querySelector(".col2").innerText &&
								obj.results.push(div.querySelector(".col2").innerText.trim());
							div.querySelector(".col1").innerText &&
								obj.results.push(div.querySelector(".col1").innerText.trim());
							data.push(obj);
						} else if (
							div.querySelector(".col0") &&
							div.querySelector(".col1")
						) {
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
					}
					return data;
				},
			);
			await this.browser.close();
			return sexyOdds;
		} catch (error) {
			console.error("tyyy errrorrr boloshi to");
			await this.init();
		}
	}
}

module.exports = Crystal;
