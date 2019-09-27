const version = require('./../../lib/index').version;

const JwtEndpoint = require('./../../lib/gateway/jwt/JwtEndpoint');
const WatchlistGateway = require('./../../lib/gateway/WatchlistGateway');

const Gateway = require('@barchart/common-js/api/http/Gateway');
const RequestInterceptor = require('@barchart/common-js/api/http/interceptors/RequestInterceptor');

module.exports = (() => {
	'use strict';

	var S_AND_P_500 = [ 'MMM-N', 'ABT-N', 'ABBV-N', 'ACN-N', 'ATVI-Q', 'AYI-N', 'ADBE-Q', 'AMD-Q', 'AAP-N', 'AES-N', 'AET-N', 'AMG-N', 'AFL-N', 'A-N', 'APD-N', 'AKAM-Q', 'ALK-N', 'ALB-N', 'ARE-N', 'ALXN-Q', 'ALGN-Q', 'ALLE-N', 'AGN-N', 'ADS-N', 'LNT-N', 'ALL-N', 'GOOGL-Q', 'GOOG-Q', 'MO-N', 'AMZN-Q', 'AEE-N', 'AAL-Q', 'AEP-N', 'AXP-N', 'AIG-N', 'AMT-N', 'AWK-N', 'AMP-N', 'ABC-N', 'AME-N', 'AMGN-Q', 'APH-N', 'APC-N', 'ADI-Q', 'ANDV-N', 'ANSS-Q', 'ANTM-N', 'AON-N', 'AOS-N', 'APA-N', 'AIV-N', 'AAPL-Q', 'AMAT-Q', 'APTV-N', 'ADM-N', 'ARNC-N', 'AJG-N', 'AIZ-N', 'T-N', 'ADSK-Q', 'ADP-Q', 'AZO-N', 'AVB-N', 'AVY-N', 'BHGE-N', 'BLL-N', 'BAC-N', 'BK-N', 'BAX-N', 'BBT-N', 'BDX-N', 'BRK-N', 'BBY-N', 'BIIB-Q', 'BLK-N', 'HRB-N', 'BA-N', 'BKNG-Q', 'BWA-N', 'BXP-N', 'BSX-N', 'BHF-Q', 'BMY-N', 'AVGO-Q', 'BF-N', 'CHRW-Q', 'CA-Q', 'COG-N', 'CDNS-Q', 'CPB-N', 'COF-N', 'CAH-N', 'CBOE-Q', 'KMX-N', 'CCL-N', 'CAT-N', 'CBG-N', 'CBS-N', 'CELG-Q', 'CNC-N', 'CNP-N', 'CTL-N', 'CERN-Q', 'CF-N', 'SCHW-N', 'CHTR-Q', 'CHK-N', 'CVX-N', 'CMG-N', 'CB-N', 'CHD-N', 'CI-N', 'XEC-N', 'CINF-Q', 'CTAS-Q', 'CSCO-Q', 'C-N', 'CFG-N', 'CTXS-Q', 'CLX-N', 'CME-Q', 'CMS-N', 'KO-N', 'CTSH-Q', 'CL-N', 'CMCSA-Q', 'CMA-N', 'CAG-N', 'CXO-N', 'COP-N', 'ED-N', 'STZ-N', 'COO-N', 'GLW-N', 'COST-Q', 'COTY-N', 'CCI-N', 'CSRA-N', 'CSX-Q', 'CMI-N', 'CVS-N', 'DHI-N', 'DHR-N', 'DRI-N', 'DVA-N', 'DE-N', 'DAL-N', 'XRAY-Q', 'DVN-N', 'DLR-N', 'DFS-N', 'DISCA-Q', 'DISCK-Q', 'DISH-Q', 'DG-N', 'DLTR-Q', 'D-N', 'DOV-N', 'DWDP-N', 'DPS-N', 'DTE-N', 'DRE-N', 'DUK-N', 'DXC-N', 'ETFC-Q', 'EMN-N', 'ETN-N', 'EBAY-Q', 'ECL-N', 'EIX-N', 'EW-N', 'EA-Q', 'EMR-N', 'ETR-N', 'EVHC-N', 'EOG-N', 'EQT-N', 'EFX-N', 'EQIX-Q', 'EQR-N', 'ESS-N', 'EL-N', 'ES-N', 'RE-N', 'EXC-N', 'EXPE-Q', 'EXPD-Q', 'ESRX-Q', 'EXR-N', 'XOM-N', 'FFIV-Q', 'FB-Q', 'FAST-Q', 'FRT-N', 'FDX-N', 'FIS-N', 'FITB-Q', 'FE-N', 'FISV-Q', 'FLIR-Q', 'FLS-N', 'FLR-N', 'FMC-N', 'FL-N', 'F-N', 'FTV-N', 'FBHS-N', 'BEN-N', 'FCX-N', 'GPS-N', 'GRMN-Q', 'IT-N', 'GD-N', 'GE-N', 'GGP-N', 'GIS-N', 'GM-N', 'GPC-N', 'GILD-Q', 'GPN-N', 'GS-N', 'GT-Q', 'GWW-N', 'HAL-N', 'HBI-N', 'HOG-N', 'HRS-N', 'HIG-N', 'HAS-Q', 'HCA-N', 'HCP-N', 'HP-N', 'HSIC-Q', 'HSY-N', 'HES-N', 'HPE-N', 'HLT-N', 'HOLX-Q', 'HD-N', 'HON-N', 'HRL-N', 'HST-N', 'HPQ-N', 'HUM-N', 'HBAN-Q', 'HII-N', 'IDXX-Q', 'INFO-Q', 'ITW-N', 'ILMN-Q', 'IR-N', 'INTC-Q', 'ICE-N', 'IBM-N', 'INCY-Q', 'IP-N', 'IPG-N', 'IFF-N', 'INTU-Q', 'ISRG-Q', 'IVZ-N', 'IPGP-Q', 'IQV-N', 'IRM-N', 'JEC-N', 'JBHT-Q', 'SJM-N', 'JNJ-N', 'JCI-N', 'JPM-N', 'JNPR-N', 'KSU-N', 'K-N', 'KEY-N', 'KMB-N', 'KIM-N', 'KMI-N', 'KLAC-Q', 'KSS-N', 'KHC-Q', 'KR-N', 'LB-N', 'LLL-N', 'LH-N', 'LRCX-Q', 'LEG-N', 'LEN-N', 'LUK-N', 'LLY-N', 'LNC-N', 'LKQ-Q', 'LMT-N', 'L-N', 'LOW-N', 'LYB-N', 'MTB-N', 'MAC-N', 'M-N', 'MRO-N', 'MPC-N', 'MAR-Q', 'MMC-N', 'MLM-N', 'MAS-N', 'MA-N', 'MAT-Q', 'MKC-N', 'MCD-N', 'MCK-N', 'MDT-N', 'MRK-N', 'MET-N', 'MTD-N', 'MGM-N', 'KORS-N', 'MCHP-Q', 'MU-Q', 'MSFT-Q', 'MAA-N', 'MHK-N', 'TAP-N', 'MDLZ-Q', 'MON-N', 'MNST-Q', 'MCO-N', 'MS-N', 'MOS-N', 'MSI-N', 'MYL-Q', 'NDAQ-Q', 'NOV-N', 'NAVI-Q', 'NTAP-Q', 'NFLX-Q', 'NWL-N', 'NFX-N', 'NEM-N', 'NWSA-Q', 'NWS-Q', 'NEE-N', 'NLSN-N', 'NKE-N', 'NI-N', 'NBL-N', 'JWN-N', 'NSC-N', 'NTRS-Q', 'NOC-N', 'NCLH-N', 'NRG-N', 'NUE-N', 'NVDA-Q', 'ORLY-Q', 'OXY-N', 'OMC-N', 'OKE-N', 'ORCL-N', 'PCAR-Q', 'PKG-N', 'PH-N', 'PDCO-Q', 'PAYX-Q', 'PYPL-Q', 'PNR-N', 'PBCT-Q', 'PEP-Q', 'PKI-N', 'PRGO-N', 'PFE-N', 'PCG-N', 'PM-N', 'PSX-N', 'PNW-N', 'PXD-N', 'PNC-N', 'RL-N', 'PPG-N', 'PPL-N', 'PX-N', 'PFG-Q', 'PG-N', 'PGR-N', 'PLD-N', 'PRU-N', 'PEG-N', 'PSA-N', 'PHM-N', 'PVH-N', 'QRVO-Q', 'PWR-N', 'QCOM-Q', 'DGX-N', 'RRC-N', 'RJF-N', 'RTN-N', 'O-N', 'RHT-N', 'REG-N', 'REGN-Q', 'RF-N', 'RSG-N', 'RMD-N', 'RHI-N', 'ROK-N', 'COL-N', 'ROP-N', 'ROST-Q', 'RCL-N', 'CRM-N', 'SBAC-Q', 'SCG-N', 'SLB-N', 'STX-Q', 'SEE-N', 'SRE-N', 'SHW-N', 'SIG-N', 'SPG-N', 'SWKS-Q', 'SLG-N', 'SNA-N', 'SO-N', 'LUV-N', 'SPGI-N', 'SWK-N', 'SBUX-Q', 'STT-N', 'SRCL-Q', 'SYK-N', 'STI-N', 'SYMC-Q', 'SYF-N', 'SNPS-Q', 'SYY-N', 'TROW-Q', 'TPR-N', 'TGT-N', 'TEL-N', 'FTI-N', 'TXN-Q', 'TXT-N', 'TMO-N', 'TIF-N', 'TWX-N', 'TJX-N', 'TMK-N', 'TSS-N', 'TSCO-Q', 'TDG-N', 'TRV-N', 'TRIP-Q', 'FOXA-Q', 'FOX-Q', 'TSN-N', 'UDR-N', 'ULTA-Q', 'USB-N', 'UAA-N', 'UA-N', 'UNP-N', 'UAL-N', 'UNH-N', 'UPS-N', 'URI-N', 'UTX-N', 'UHS-N', 'UNM-N', 'VFC-N', 'VLO-N', 'VAR-N', 'VTR-N', 'VRSN-Q', 'VRSK-Q', 'VZ-N', 'VRTX-Q', 'VIAB-Q', 'V-N', 'VNO-N', 'VMC-N', 'WMT-N', 'WBA-Q', 'DIS-N', 'WM-N', 'WAT-N', 'WEC-N', 'WFC-N', 'WELL-N', 'WDC-Q', 'WU-N', 'WRK-N', 'WY-N', 'WHR-N', 'WMB-N', 'WLTW-Q', 'WYN-N', 'WYNN-Q', 'XEL-Q', 'XRX-N', 'XLNX-Q', 'XL-N', 'XYL-N', 'YUM-N', 'ZBH-N', 'ZION-Q', 'ZTS-N' ];

	var PageModel = function() {
		var that = this;

		that.gateway = null;

		that.user = ko.observable('64843767');

		that.watchlistUser = ko.observable(null);
		that.watchlists = ko.observable([ ]);
		that.watchlist = ko.observable(null);

		that.watchlistDisplayName = ko.computed(function() {
			return that.watchlist() !== null ? that.watchlist().name : '';
		});

		that.watchlistName = ko.observable('');

		that.connected = ko.observable(false);
		that.connecting = ko.observable(false);

		that.loaded = ko.computed(function() {
			return that.watchlistUser() !== null;
		});

		that.console = ko.observableArray([ ]);

		that.clientVersion = ko.observable();
		that.serverVersion = ko.observable();

		that.mode = ko.observable('View Console');
		that.activeTemplate = ko.observable('disconnected-template');

		that.symbol = ko.observable('');

		that.canConnect = ko.computed(function() {
			return !that.connecting() && !that.connected();
		});
		that.canDisconnect = ko.computed(function() {
			return that.connected();
		});

		var writeConsoleText = function(text, clear) {
			if (clear) {
				that.console.removeAll();
			}

			that.console.push(text);
		};

		var writeConsoleObject = function(data) {
			that.console.push(JSON.stringify(data, null, 2));
		};

		that.connect = function() {
			that.disconnect();

			that.connecting(true);

			const jwtEndpoint = JwtEndpoint.forDevelopment(that.user());
			const jwtPromise = Gateway.invoke(jwtEndpoint);

			const jwtInterceptor = RequestInterceptor.fromDelegate((options, endpoint) => {
				return jwtPromise
				.then((token) => {
					options.headers = options.headers || { };
					options.headers.Authorization = `Bearer ${token}`;

					return options;
				});
			});

			WatchlistGateway.forDevelopment(jwtInterceptor)
				.then((gateway) => {
					that.gateway = gateway;

					var action = 'watchlistGateway.readServiceMetadataEndpoint()';

					that.gateway.readServiceMetadata()
						.then((metadata) => {
							writeConsoleText(action);
							writeConsoleObject(metadata);

							that.connecting(false);
							that.connected(true);

							that.clientVersion(version);
							that.serverVersion(metadata.server.semver);

							that.setConsoleMode();

							return true;
						}).catch((e) => {
							writeConsoleText(action, true);
							writeConsoleObject(e);

							that.setConsoleMode();

							return false;
						}).then((read) => {
							if (read) {
								return that.readUser(false)
									.then((user) => {
										that.setWatchlistMode();
									});
							}
						});
				});
		};
		that.disconnect = function() {
			if (that.gateway === null) {
				return;
			}

			if (that.gateway) {
				that.gateway.dispose();
				that.gateway = null;
			}

			that.console.removeAll();

			that.watchlistUser(null);
			that.watchlists([ ]);
			that.watchlist(null);

			that.connecting(false);
			that.connected(false);

			that.activeTemplate('disconnected-template');
		};

		that.readUser = function(clear) {
			if (clear) {
				that.console.removeAll();
			}

			var action = 'watchlistGateway.readUser()';

			return that.gateway.readUser()
				.then(function(watchlistUser) {
					writeConsoleText(action);
					writeConsoleObject(watchlistUser.toJSObj());

					let watchlists = [ ];
					let watchlist = null;

					for (var key in watchlistUser.watchlists) {
						watchlists.push(watchlistUser.watchlists[key]);
					}

					if (watchlists.length !== 0) {
						watchlist = watchlists[0];
					}

					that.watchlistUser(watchlistUser);
					that.watchlists(Object.values(watchlists));
					that.watchlist(watchlist);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.watchlistUser(null);
					that.watchlists([ ]);
					that.watchlist(null);

					that.setConsoleMode();
				});
		};
		that.writeUser = function() {
			if (!that.connected()) {
				return;
			}

			if (!that.watchlistUser()) {
				return;
			}

			var action = 'watchlistGateway.writeUser()';

			that.watchlistUser().preferences = {
				favoriteNumber: Math.floor(Math.random() * 1000)
			};

			let watchlists = that.watchlistUser().watchlists;
			let counter = 0;

			for (var id in watchlists) {
				watchlists[id].preferences = { favoriteColor: ((counter++) % 2 === 0 ? 'blue' : 'red' )};
			}

			return that.gateway.writeUser(that.watchlistUser())
				.then(function(response) {
					writeConsoleText(action);
					writeConsoleObject(response);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};

		that.setConsoleMode = function() {
			that.mode('View Console');

			that.activeTemplate('watchlist-console-template');
		};

		that.setWatchlistMode = function() {
			if (!that.connected()) {
				return;
			}

			that.mode('View Watchlist');

			that.activeTemplate('watchlist-view-template');
		};
		that.setWatchlist = function(watchlist) {
			if (!that.connected()) {
				return;
			}

			that.watchlist(watchlist);
		};
		that.addWatchlist = function() {
			if (!that.connected()) {
				return;
			}

			var name = that.watchlistName();

			if (!name) {
				return;
			}

			const watchlistUser = that.watchlistUser();

			if (watchlistUser) {
				const watchlist = watchlistUser.createWatchlist(name);
				const watchlists = [ ];

				for (var key in watchlistUser.watchlists) {
					watchlists.push(watchlistUser.watchlists[key]);
				}

				that.watchlists(Object.values(watchlists));
				that.watchlist(watchlist);

				that.watchlistUser.valueHasMutated();
				that.watchlists.valueHasMutated();
				that.watchlist.valueHasMutated();

				that.watchlistName('');

				that.setWatchlistMode();
			}
		};
		that.removeWatchlist = function() {
			if (!that.connected()) {
				return;
			}

			var name = that.watchlistName();

			if (!name) {
				return;
			}

			var watchlistUser = that.watchlistUser();

			if (watchlistUser) {
				var watchlist = null;

				for (var key in watchlistUser.watchlists) {
					var w = watchlistUser.watchlists[key];

					if (w.name === name) {
						watchlist = w;

						break;
					}
				}

				if (watchlist) {
					watchlistUser.removeWatchlist(watchlist.id);

					const watchlists = [];

					for (var k in watchlistUser.watchlists) {
						watchlists.push(watchlistUser.watchlists[k]);
					}

					that.watchlists(Object.values(watchlists));

					that.watchlistUser.valueHasMutated();
					that.watchlists.valueHasMutated();

					if (watchlists.length !== 0) {
						watchlist = watchlists[0];
					} else {
						watchlist = null;
					}

					that.watchlist(watchlist);
					that.watchlist.valueHasMutated();

					that.watchlistName('');
				}
			}
		};

		that.addSymbol = function() {
			if (!that.connected()) {
				return;
			}

			if (!that.watchlist()) {
				return;
			}

			var symbol = that.symbol();

			if (symbol === 'SP500') {
				const symbols = S_AND_P_500;

				for (var i = 0; i < symbols.length; i++) {
					const tgam = symbols[i];
					const barchart = tgam.replace(/-./, '');

					that.watchlist().addEntry({
						symbol: barchart,
						tgam_symbol: tgam
					});
				}
			} else {
				that.watchlist().addEntry({
					symbol: symbol
				});
			}

			that.symbol('');

			that.watchlist.valueHasMutated();
		};
		that.removeEntry = function(entry) {
			if (!that.connected()) {
				return;
			}

			if (!that.watchlist()) {
				return;
			}

			that.watchlist().removeEntry(entry);
			that.watchlist.valueHasMutated();
		};
		that.getDisplayText = function(text) {
			return text ? text : '[not specified]';
		};

		that.handleLoginKeypress = function(d, e) {
			var enterKey = e.keyCode === 13;

			if (enterKey) {
				that.connect();
			}

			return !enterKey;
		};
	};

	$(document).ready(function() {
		var pageModel = new PageModel();

		ko.applyBindings(pageModel, $('body')[0]);
	});
})();