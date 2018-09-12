INSERT INTO `asset_type` (`id`, `gid`, `address`, `metadata`, `name`, `symbol`, `tx_hash`, `status`, `type`, `create_time`, `update_time`)
VALUES ('1', '0', '0x68f2CBdA42eDb8f2A4Da853b34E772A5f8e98Ce0', '{\"icon\":\"https://www.udap.io/logo400x400.png\"}', 'UDAP Token', 'UPX', NULL, '1', 'ERC20', '2018-09-07 14:45:47', '2018-09-07 15:38:58');


INSERT INTO `asset_type` (`id`, `gid`, `address`, `metadata`, `name`, `symbol`, `tx_hash`, `status`, `type`, `create_time`, `update_time`)
VALUES ('45', '0', '0x520d9453a5ad5c46fdbedabfc23413123206b916', '{\"name\":\"membership\",\"symbol\":\"MEMBER\",\"desc\":\"this is for membership\",\"icon\":\"https://ipfs.io/ipfs/QmZ62ecaduRNnmgBhg7zEPpAbXUfPjf19MzsHJQecxWTXA\",\"schema\":\"{\\n  \\\"id\\\": \\\"https://wallet.chainmind.io/schema/membership.json\\\",\\n  \\\"$schema\\\": \\\"http://json-schema.org/draft-07/schema#\\\",\\n  \\\"description\\\": \\\"Membership Certificate\\\",\\n  \\\"required\\\": [ \\\"id\\\",\\\"issuer\\\",\\\"issueTo\\\",\\\"issueDate\\\",\\\"signers\\\"],\\n  \\\"type\\\": \\\"object\\\",\\n  \\\"properties\\\": {\\n    \\\"id\\\": {\\n      \\\"type\\\": \\\"string\\\",\\n      \\\"title\\\":\\\"Id\\\"\\n    },\\n    \\\"logoUri\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"uri\\\",\\n      \\\"title\\\":\\\"Logo\\\"\\n    },\\n    \\\"isser\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Organization\\\"\\n    },\\n    \\\"issueTo\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Member\\\"\\n    },\\n    \\\"issueDate\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"date\\\",\\n      \\\"title\\\":\\\"Issue Date\\\"\\n    },\\n    \\\"signers\\\":{\\n      \\\"type\\\":\\\"array\\\",\\n      \\\"title\\\":\\\"Signed By\\\",\\n      \\\"minItems\\\":1,\\n      \\\"items\\\":{\\n        \\\"type\\\":\\\"object\\\",\\n        \\\"properties\\\":{\\n          \\\"name\\\":{\\n            \\\"type\\\":\\\"string\\\",\\n            \\\"title\\\":\\\"Name\\\"\\n          },\\n          \\\"title\\\":{\\n            \\\"type\\\":\\\"string\\\",\\n            \\\"title\\\":\\\"Title\\\"\\n          },\\n          \\\"signature\\\":{\\n            \\\"type\\\":\\\"string\\\"\\n          }\\n        }\\n      }\\n    }\\n  }\\n}\\n\",\"views\":[]}', 'membership', 'MEMBER', '0xe44135958ebafaed37757e3377d96a4cae5f5769e24018b6193351d674ecf863', '1', 'UPA', '2018-09-12 13:03:49', '2018-09-12 13:05:09');



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
VALUES ('46', '0', '0x900fb51fdb4938d1a8084c4b3bc17131aaff29a7', '{\"name\":\"invoice\",\"symbol\":\"INV\",\"desc\":\"this is for invoice\",\"icon\":\"https://ipfs.io/ipfs/QmZ62ecaduRNnmgBhg7zEPpAbXUfPjf19MzsHJQecxWTXA\",\"schema\":\"{\\n  \\\"id\\\": \\\"https://wallet.chainmind.io/schema/invoice.json\\\",\\n  \\\"$schema\\\": \\\"http://json-schema.org/draft-07/schema#\\\",\\n  \\\"required\\\": [ \\\"id\\\",\\\"currency\\\",\\\"items\\\" ],\\n  \\\"type\\\": \\\"object\\\",\\n  \\\"properties\\\": {\\n    \\\"id\\\": {\\n      \\\"type\\\": \\\"string\\\",\\n      \\\"title\\\":\\\"Invoice Number\\\"\\n    },\\n    \\\"currency\\\":{\\n      \\\"type\\\": \\\"string\\\",\\n      \\\"enum\\\":[\\\"ETH\\\"],\\n      \\\"title\\\":\\\"Currency\\\"\\n    },\\n    \\\"dueDate\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"date\\\",\\n      \\\"title\\\":\\\"Due Date\\\"\\n    },\\n    \\\"items\\\":{\\n      \\\"type\\\":\\\"array\\\",\\n      \\\"title\\\":\\\"Item List\\\",\\n      \\\"items\\\":{\\n        \\\"type\\\":\\\"object\\\",\\n        \\\"properties\\\":{\\n          \\\"description\\\":{\\n            \\\"type\\\":\\\"string\\\",\\n            \\\"title\\\":\\\"Item\\\"\\n          },\\n          \\\"price\\\":{\\n            \\\"type\\\":\\\"number\\\",\\n            \\\"title\\\":\\\"Price\\\"\\n          },\\n          \\\"quantity\\\":{\\n            \\\"type\\\":\\\"number\\\",\\n            \\\"title\\\":\\\"Quantity\\\"\\n          }\\n        },\\n        \\\"required\\\":[\\\"description\\\",\\\"price\\\",\\\"quantity\\\"]\\n      }\\n    },\\n    \\\"buyer\\\":{\\n      \\\"type\\\":\\\"object\\\",\\n      \\\"title\\\":\\\"Buyer Information\\\",\\n      \\\"properties\\\":{\\n        \\\"name\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Name\\\"\\n        },\\n        \\\"address1\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Address Line 1\\\"\\n        },\\n        \\\"address2\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Address Line 2\\\"\\n        },\\n        \\\"city\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"City\\\"\\n        },\\n        \\\"region\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Province\\\"\\n        },\\n        \\\"country\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Country\\\"\\n        },\\n        \\\"postalCode\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Postal Code\\\"\\n        },\\n        \\\"email\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Email\\\"\\n        },\\n        \\\"notify\\\":{\\n          \\\"type\\\":\\\"boolean\\\",\\n          \\\"title\\\":\\\"Notify\\\",\\n          \\\"description\\\":\\\"whether receipt email should be sent to buyer for this invoice\\\"\\n        }\\n      }\\n    },\\n    \\\"remark\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Remark\\\"\\n    }\\n  }\\n}\\n\",\"views\":[]}', 'invoice', 'INV', '0x7326a842fdde4af69244cdce8cb377898f1fd4207171bb7a2e82d00ddccba076', '1', 'UPA', '2018-09-12 13:08:47', '2018-09-12 13:09:12');
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
		'46',
		'view',
		'https://wallet.chainmind.io/template/invoice',
		'/view.html',
		'/invoice-thumbnail.png',
		'2018-09-08 20:35:31',
		'2018-09-10 11:56:24'
	);

INSERT INTO `ropsten`.`asset_type` (`id`, `gid`, `address`, `metadata`, `name`, `symbol`, `tx_hash`, `status`, `type`, `create_time`, `update_time`)
VALUES ('47', '0', '0x9434b85c348f76cef26d9ef76b908f50c18c9dbd', '{\"name\":\"memo\",\"symbol\":\"MEMO\",\"desc\":\"this is for memo\",\"icon\":\"https://ipfs.io/ipfs/QmZ62ecaduRNnmgBhg7zEPpAbXUfPjf19MzsHJQecxWTXA\",\"schema\":\"{\\n  \\\"id\\\": \\\"https://wallet.chainmind.io/schema/memo.json\\\",\\n  \\\"$schema\\\": \\\"http://json-schema.org/draft-07/schema#\\\",\\n  \\\"required\\\": [ \\\"recipient\\\",\\\"subject\\\",\\\"date\\\",\\\"content\\\" ],\\n  \\\"type\\\": \\\"object\\\",\\n  \\\"properties\\\": {\\n    \\\"recipient\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"To\\\"\\n    },\\n    \\\"subject\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Subject\\\"\\n    },\\n    \\\"date\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"date\\\",\\n      \\\"title\\\":\\\"Date\\\"\\n    },\\n    \\\"logoUri\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"uri\\\",\\n      \\\"title\\\":\\\"Logo\\\"\\n    },\\n    \\\"content\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Content\\\"\\n    }\\n  }\\n}\\n\",\"views\":[]}', 'memo', 'MEMO', '0xeda696d6c29db6bcd85e41010139a1047faa97053476ef0b59e4566d0d24a6cb', '1', 'UPA', '2018-09-12 13:13:56', '2018-09-12 13:15:12');

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
		'47',
		'view',
		'https://wallet.chainmind.io/template/memo',
		'/view.html',
		'/memo-thumbnail.png',
		'2018-09-08 20:35:31',
		'2018-09-10 11:56:24'
	);












