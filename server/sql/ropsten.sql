INSERT INTO `asset_type` (`id`, `gid`, `address`, `metadata`, `name`, `symbol`, `tx_hash`, `status`, `type`, `create_time`, `update_time`)
VALUES ('1', '0', '0x68f2CBdA42eDb8f2A4Da853b34E772A5f8e98Ce0', '{\"icon\":\"https://www.udap.io/logo400x400.png\"}', 'UDAP Token', 'UPX', NULL, '1', 'ERC20', '2018-09-07 14:45:47', '2018-09-07 15:38:58');

INSERT INTO `asset_type` (`id`, `gid`, `address`, `metadata`, `name`, `symbol`, `tx_hash`, `status`, `type`, `create_time`, `update_time`)
VALUES ('45', '0', '0xd02fe1bf356a58bda839d4b1469830e16a51312d', '{\"name\":\"Membership\",\"symbol\":\"MEMBER\",\"desc\":\"this is for membership\",\"icon\":\"https://ipfs.io/ipfs/QmZ62ecaduRNnmgBhg7zEPpAbXUfPjf19MzsHJQecxWTXA\",\"schema\":\"{\\n  \\\"id\\\": \\\"https://wallet.chainmind.io/schema/membership.json\\\",\\n  \\\"$schema\\\": \\\"http://json-schema.org/draft-07/schema#\\\",\\n  \\\"description\\\": \\\"Membership Certificate\\\",\\n  \\\"required\\\": [ \\\"id\\\",\\\"issuer\\\",\\\"issueTo\\\",\\\"issueDate\\\",\\\"signers\\\"],\\n  \\\"type\\\": \\\"object\\\",\\n  \\\"properties\\\": {\\n    \\\"id\\\": {\\n      \\\"type\\\": \\\"string\\\",\\n      \\\"title\\\":\\\"Id\\\"\\n    },\\n    \\\"logoUri\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"uri\\\",\\n      \\\"title\\\":\\\"Logo\\\"\\n    },\\n    \\\"issuer\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Organization\\\"\\n    },\\n    \\\"issueTo\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Member\\\"\\n    },\\n    \\\"issueDate\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"date\\\",\\n      \\\"title\\\":\\\"Issue Date\\\"\\n    },\\n    \\\"signers\\\":{\\n      \\\"type\\\":\\\"array\\\",\\n      \\\"title\\\":\\\"Signed By\\\",\\n      \\\"minItems\\\":1,\\n      \\\"items\\\":{\\n        \\\"type\\\":\\\"object\\\",\\n        \\\"properties\\\":{\\n          \\\"name\\\":{\\n            \\\"type\\\":\\\"string\\\",\\n            \\\"title\\\":\\\"Name\\\"\\n          },\\n          \\\"title\\\":{\\n            \\\"type\\\":\\\"string\\\",\\n            \\\"title\\\":\\\"Title\\\"\\n          },\\n          \\\"signature\\\":{\\n            \\\"type\\\":\\\"string\\\"\\n          }\\n        }\\n      }\\n    }\\n  }\\n}\\n\",\"views\":[]}', 'Membership', 'MEMBER', '0xa09755f2b284fa286c18427d640d47eff8e80fdfbc4a375325cf5a71f8c9e300', '1', 'UPA', '2018-09-14 18:39:39', '2018-09-14 18:52:16');


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
VALUES ('50', '123', '0x0d8d556360e598c366053c94ea86d8a388ae413e', '{\"name\":\"Invoice\",\"symbol\":\"INV\",\"desc\":\"this is for invoice\",\"icon\":\"https://ipfs.io/ipfs/Qmdru8PDUyfzDjhMBU4gVZJ8JTJ2jS1bCvNGcYxQ74vmGY\",\"schema\":\"{\\n  \\\"id\\\": \\\"https://wallet.chainmind.io/schema/invoice.json\\\",\\n  \\\"$schema\\\": \\\"http://json-schema.org/draft-07/schema#\\\",\\n  \\\"required\\\": [ \\\"id\\\",\\\"currency\\\",\\\"items\\\" ],\\n  \\\"type\\\": \\\"object\\\",\\n  \\\"properties\\\": {\\n    \\\"id\\\": {\\n      \\\"type\\\": \\\"string\\\",\\n      \\\"title\\\":\\\"Invoice Number\\\"\\n    },\\n    \\\"currency\\\":{\\n      \\\"type\\\": \\\"string\\\",\\n      \\\"enum\\\":[\\\"ETH\\\"],\\n      \\\"title\\\":\\\"Currency\\\"\\n    },\\n    \\\"dueDate\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"date\\\",\\n      \\\"title\\\":\\\"Due Date\\\"\\n    },\\n    \\\"items\\\":{\\n      \\\"type\\\":\\\"array\\\",\\n      \\\"title\\\":\\\"Item List\\\",\\n      \\\"items\\\":{\\n        \\\"type\\\":\\\"object\\\",\\n        \\\"properties\\\":{\\n          \\\"description\\\":{\\n            \\\"type\\\":\\\"string\\\",\\n            \\\"title\\\":\\\"Item\\\"\\n          },\\n          \\\"price\\\":{\\n            \\\"type\\\":\\\"number\\\",\\n            \\\"title\\\":\\\"Price\\\"\\n          },\\n          \\\"quantity\\\":{\\n            \\\"type\\\":\\\"number\\\",\\n            \\\"title\\\":\\\"Quantity\\\"\\n          }\\n        },\\n        \\\"required\\\":[\\\"description\\\",\\\"price\\\",\\\"quantity\\\"]\\n      }\\n    },\\n    \\\"buyer\\\":{\\n      \\\"type\\\":\\\"object\\\",\\n      \\\"title\\\":\\\"Buyer Information\\\",\\n      \\\"properties\\\":{\\n        \\\"name\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Name\\\"\\n        },\\n        \\\"address1\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Address Line 1\\\"\\n        },\\n        \\\"address2\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Address Line 2\\\"\\n        },\\n        \\\"city\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"City\\\"\\n        },\\n        \\\"region\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Province\\\"\\n        },\\n        \\\"country\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Country\\\"\\n        },\\n        \\\"postalCode\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Postal Code\\\"\\n        },\\n        \\\"email\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Email\\\"\\n        },\\n        \\\"notify\\\":{\\n          \\\"type\\\":\\\"boolean\\\",\\n          \\\"title\\\":\\\"Notify\\\",\\n          \\\"description\\\":\\\"whether receipt email should be sent to buyer for this invoice\\\"\\n        }\\n      }\\n    },\\n    \\\"remark\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Remark\\\"\\n    }\\n  }\\n}\\n\",\"views\":[]}', 'Invoice', 'INV', '0x638bd41e7605f0aa02c45a1428f8bd667677685a9e71bae06a432012129fd046', '1', 'UPA', '2018-09-14 18:54:46', '2018-09-14 18:55:27');

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
VALUES ('48', '0', '0x04e77434ced83d8461a93bbec05b3f39c0d6b54a', '{\"name\":\"Memo\",\"symbol\":\"MEMO\",\"desc\":\"this is for memo\",\"icon\":\"https://ipfs.io/ipfs/QmPAxgcm2uQB4QAm4SFDNRxQsJX6mF9bn6JjkXKPXiTj8M\",\"schema\":\"{\\n  \\\"id\\\": \\\"https://wallet.chainmind.io/schema/memo.json\\\",\\n  \\\"$schema\\\": \\\"http://json-schema.org/draft-07/schema#\\\",\\n  \\\"required\\\": [ \\\"recipient\\\",\\\"subject\\\",\\\"date\\\",\\\"content\\\" ],\\n  \\\"type\\\": \\\"object\\\",\\n  \\\"properties\\\": {\\n    \\\"recipient\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"To\\\"\\n    },\\n    \\\"subject\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Subject\\\"\\n    },\\n    \\\"date\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"date\\\",\\n      \\\"title\\\":\\\"Date\\\"\\n    },\\n    \\\"logoUri\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"uri\\\",\\n      \\\"title\\\":\\\"Logo\\\"\\n    },\\n    \\\"content\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Content\\\"\\n    }\\n  }\\n}\\n\",\"views\":[]}', 'Memo', 'MEMO', '0x11a1bc6136a80665db9a29e2a460123c4614b81cccdd87a89b0385d1cbda201b', '1', 'UPA', '2018-09-14 18:57:02', '2018-09-14 18:58:50');

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












