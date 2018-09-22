INSERT INTO `asset_type` (`id`, `gid`, `address`, `metadata`, `name`, `symbol`, `tx_hash`, `status`, `type`, `create_time`, `update_time`)
VALUES ('1', '0', '0x68f2CBdA42eDb8f2A4Da853b34E772A5f8e98Ce0', '{\"icon\":\"https://www.udap.io/logo400x400.png\"}', 'UDAP Token', 'UPX', NULL, '1', 'ERC20', '2018-09-07 14:45:47', '2018-09-07 15:38:58');

INSERT INTO `asset_type` (`id`, `gid`, `address`, `metadata`, `name`, `symbol`, `tx_hash`, `status`, `type`, `create_time`, `update_time`)
VALUES ('45', '0', '0x54ca7368641a2c8d3c2d936e3cfdb68e1d951aa5', '{\"name\":\"Membership\",\"symbol\":\"MEMBER\",\"desc\":\"this is for membership\",\"icon\":\"https://ipfs.io/ipfs/QmZ62ecaduRNnmgBhg7zEPpAbXUfPjf19MzsHJQecxWTXA\",\"schema\":\"{\\n  \\\"id\\\": \\\"https://wallet.chainmind.io/schema/membership.json\\\",\\n  \\\"$schema\\\": \\\"http://json-schema.org/draft-07/schema#\\\",\\n  \\\"description\\\": \\\"Membership Certificate\\\",\\n  \\\"required\\\": [ \\\"id\\\",\\\"issuer\\\",\\\"issueTo\\\",\\\"issueDate\\\",\\\"signers\\\"],\\n  \\\"type\\\": \\\"object\\\",\\n  \\\"properties\\\": {\\n    \\\"id\\\": {\\n      \\\"type\\\": \\\"string\\\",\\n      \\\"title\\\":\\\"Id\\\"\\n    },\\n    \\\"logoUri\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"uri\\\",\\n      \\\"title\\\":\\\"Logo\\\"\\n    },\\n    \\\"issuer\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Organization\\\"\\n    },\\n    \\\"issueTo\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Member\\\"\\n    },\\n    \\\"issueDate\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"date\\\",\\n      \\\"title\\\":\\\"Issue Date\\\"\\n    },\\n    \\\"signers\\\":{\\n      \\\"type\\\":\\\"array\\\",\\n      \\\"title\\\":\\\"Signed By\\\",\\n      \\\"minItems\\\":1,\\n      \\\"items\\\":{\\n        \\\"type\\\":\\\"object\\\",\\n        \\\"properties\\\":{\\n          \\\"name\\\":{\\n            \\\"type\\\":\\\"string\\\",\\n            \\\"title\\\":\\\"Name\\\"\\n          },\\n          \\\"title\\\":{\\n            \\\"type\\\":\\\"string\\\",\\n            \\\"title\\\":\\\"Title\\\"\\n          },\\n          \\\"signature\\\":{\\n            \\\"type\\\":\\\"string\\\"\\n          }\\n        }\\n      }\\n    }\\n  }\\n}\\n\",\"views\":[]}', 'Membership', 'MEMBER', '0x88dad06c4e269bf6cbd2dae0d5516153362a3717e3cad998321a1fa78c8b75ae', '1', 'UPA', '2018-09-22 18:28:09', '2018-09-22 18:28:24');


INSERT INTO `view_template` (
	`type_id`,
	`key`,
	`context`,
	`template_uri`,
	`thumbnail`,
	`create_time`,
	`update_time`
)
VALUES
	(
		'45',
		'view',
		'https://wallet.chainmind.io/template/membership',
		'/view.html',
		'/view-thumbnail.png',
		'2018-09-08 20:35:31',
		'2018-09-10 11:56:24'
	);
INSERT INTO `asset_type` (`id`, `gid`, `address`, `metadata`, `name`, `symbol`, `tx_hash`, `status`, `type`, `create_time`, `update_time`)
VALUES ('50', '0', '0x93f6b8d5057e9974e76fa16fbb5ca78c9dd70738', '{\"name\":\"Invoice\",\"symbol\":\"INV\",\"desc\":\"this is for invoice\",\"icon\":\"https://ipfs.io/ipfs/Qmdru8PDUyfzDjhMBU4gVZJ8JTJ2jS1bCvNGcYxQ74vmGY\",\"schema\":\"{\\n  \\\"id\\\": \\\"https://wallet.chainmind.io/schema/invoice.json\\\",\\n  \\\"$schema\\\": \\\"http://json-schema.org/draft-07/schema#\\\",\\n  \\\"required\\\": [ \\\"id\\\",\\\"currency\\\",\\\"items\\\" ],\\n  \\\"type\\\": \\\"object\\\",\\n  \\\"properties\\\": {\\n    \\\"id\\\": {\\n      \\\"type\\\": \\\"string\\\",\\n      \\\"title\\\":\\\"Invoice Number\\\"\\n    },\\n    \\\"currency\\\":{\\n      \\\"type\\\": \\\"string\\\",\\n      \\\"enum\\\":[\\\"ETH\\\"],\\n      \\\"title\\\":\\\"Currency\\\"\\n    },\\n    \\\"dueDate\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"date\\\",\\n      \\\"title\\\":\\\"Due Date\\\"\\n    },\\n    \\\"items\\\":{\\n      \\\"type\\\":\\\"array\\\",\\n      \\\"title\\\":\\\"Item List\\\",\\n      \\\"items\\\":{\\n        \\\"type\\\":\\\"object\\\",\\n        \\\"properties\\\":{\\n          \\\"description\\\":{\\n            \\\"type\\\":\\\"string\\\",\\n            \\\"title\\\":\\\"Item\\\"\\n          },\\n          \\\"price\\\":{\\n            \\\"type\\\":\\\"number\\\",\\n            \\\"title\\\":\\\"Price\\\"\\n          },\\n          \\\"quantity\\\":{\\n            \\\"type\\\":\\\"number\\\",\\n            \\\"title\\\":\\\"Quantity\\\"\\n          }\\n        },\\n        \\\"required\\\":[\\\"description\\\",\\\"price\\\",\\\"quantity\\\"]\\n      }\\n    },\\n    \\\"buyer\\\":{\\n      \\\"type\\\":\\\"object\\\",\\n      \\\"title\\\":\\\"Buyer Information\\\",\\n      \\\"properties\\\":{\\n        \\\"name\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Name\\\"\\n        },\\n        \\\"address1\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Address Line 1\\\"\\n        },\\n        \\\"address2\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Address Line 2\\\"\\n        },\\n        \\\"city\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"City\\\"\\n        },\\n        \\\"region\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Province\\\"\\n        },\\n        \\\"country\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Country\\\"\\n        },\\n        \\\"postalCode\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Postal Code\\\"\\n        },\\n        \\\"email\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Email\\\"\\n        },\\n        \\\"notify\\\":{\\n          \\\"type\\\":\\\"boolean\\\",\\n          \\\"title\\\":\\\"Notify\\\",\\n          \\\"description\\\":\\\"whether receipt email should be sent to buyer for this invoice\\\"\\n        }\\n      }\\n    },\\n    \\\"remark\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Remark\\\"\\n    }\\n  }\\n}\\n\",\"views\":[]}', 'Invoice', 'INV', '0x85077ba1b2fcdb4172f9d4171c99eb6c308e211d585b8990d509dbc2850a34d4', '1', 'UPA', '2018-09-22 18:32:49', '2018-09-22 18:33:19');

INSERT INTO `view_template` (
	`type_id`,
	`key`,
	`context`,
	`template_uri`,
	`thumbnail`,
	`create_time`,
	`update_time`
)
VALUES
	(
		'50',
		'view',
		'https://wallet.chainmind.io/template/invoice',
		'/view.html',
		'/invoice-thumbnail.png',
		'2018-09-08 20:35:31',
		'2018-09-10 11:56:24'
	);


INSERT INTO `asset_type` (`id`, `gid`, `address`, `metadata`, `name`, `symbol`, `tx_hash`, `status`, `type`, `create_time`, `update_time`)
VALUES ('48', '0', '0x4e6cd075e5c2eeb12766b0cb7c88403f36e1fe55', '{\"name\":\"Memo\",\"symbol\":\"MEMO\",\"desc\":\"this is for memo\",\"icon\":\"https://ipfs.io/ipfs/QmPAxgcm2uQB4QAm4SFDNRxQsJX6mF9bn6JjkXKPXiTj8M\",\"schema\":\"{\\n  \\\"id\\\": \\\"https://wallet.chainmind.io/schema/memo.json\\\",\\n  \\\"$schema\\\": \\\"http://json-schema.org/draft-07/schema#\\\",\\n  \\\"required\\\": [ \\\"recipient\\\",\\\"subject\\\",\\\"date\\\",\\\"content\\\" ],\\n  \\\"type\\\": \\\"object\\\",\\n  \\\"properties\\\": {\\n    \\\"recipient\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"To\\\"\\n    },\\n    \\\"subject\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Subject\\\"\\n    },\\n    \\\"date\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"date\\\",\\n      \\\"title\\\":\\\"Date\\\"\\n    },\\n    \\\"logoUri\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"uri\\\",\\n      \\\"title\\\":\\\"Logo\\\"\\n    },\\n    \\\"content\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Content\\\"\\n    }\\n  }\\n}\\n\",\"views\":[]}', 'Memo', 'MEMO', '0x64f224870d3640fa163ce6505bb77cdbf5bccc4236eaa004c0ed9b48f63cc13a', '1', 'UPA', '2018-09-22 18:30:52', '2018-09-22 18:31:22');

INSERT INTO `view_template` (
	`type_id`,
	`key`,
	`context`,
	`template_uri`,
	`thumbnail`,
	`create_time`,
	`update_time`
)
VALUES
	(
		'48',
		'view',
		'https://wallet.chainmind.io/template/memo',
		'/view.html',
		'/memo-thumbnail.png',
		'2018-09-08 20:35:31',
		'2018-09-10 11:56:24'
	);












