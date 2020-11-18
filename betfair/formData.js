const football = {
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

const basketball = {
	filter: {
		marketBettingTypes: ["ODDS"],
		productTypes: ["EXCHANGE"],
		marketTypeCodes: ["MATCH_ODDS"],
		selectBy: "RANK",
		contentGroup: { language: "en", regionCode: "UK" },
		turnInPlayEnabled: true,
		inPlay: false,
		maxResults: 0,
		eventTypeIds: [7522],
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

const darts = {
	filter: {
		marketBettingTypes: ["ODDS"],
		productTypes: ["EXCHANGE"],
		marketTypeCodes: ["MATCH_ODDS"],
		selectBy: "RANK",
		contentGroup: { language: "en", regionCode: "UK" },
		turnInPlayEnabled: true,
		inPlay: false,
		maxResults: 0,
		eventTypeIds: [3503],
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

module.exports = {
	football,
	basketball,
	darts,
};
