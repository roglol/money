const formData = {
	filter: {
		marketBettingTypes: ["ODDS"],
		productTypes: ["EXCHANGE"],
		marketTypeCodes: ["MATCH_ODDS", "BOTH_TEAMS_TO_SCORE"],
		selectBy: "RANK",
		contentGroup: { language: "en", regionCode: "UK" },
		turnInPlayEnabled: true,
		inPlay: false,
		maxResults: 0,
		eventTypeIds: [],
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

let sports = {
	football: 1,
	basketball: 7522,
	darts: 3503,
	tennis: 2,
};

module.exports = {
	formData,
	sports,
};
