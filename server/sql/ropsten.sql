INSERT INTO `asset_type` (`id`, `gid`, `address`, `metadata`, `name`, `symbol`, `tx_hash`, `status`, `type`, `create_time`, `update_time`)
VALUES ('1', '0', '0x68f2CBdA42eDb8f2A4Da853b34E772A5f8e98Ce0', '{\"icon\":\"https://www.udap.io/logo400x400.png\"}', 'UDAP Token', 'UPX', NULL, '1', 'ERC20', '2018-09-07 14:45:47', '2018-09-07 15:38:58');


INSERT INTO `asset_type` (`id`, `gid`, `address`, `metadata`, `name`, `symbol`, `tx_hash`, `status`, `type`, `create_time`, `update_time`)
VALUES ('45', '0', '0xc196970c3486fe535e9df9eb89860be0e124e3d9', '{\"name\":\"Membership\",\"symbol\":\"MEMBER\",\"desc\":\"this is for membership\",\"icon\":\"http://ipfs.chainmind.io/ipfs/QmZ62ecaduRNnmgBhg7zEPpAbXUfPjf19MzsHJQecxWTXA\",\"schema\":\"{\\r\\n  \\\"id\\\": \\\"https://wallet.chainmind.io/schema/membership.json\\\",\\r\\n  \\\"$schema\\\": \\\"http://json-schema.org/draft-07/schema#\\\",\\r\\n  \\\"description\\\": \\\"Membership Certificate\\\",\\r\\n  \\\"required\\\": [ \\\"id\\\",\\\"issuer\\\",\\\"issueTo\\\",\\\"issueDate\\\",\\\"signers\\\"],\\r\\n  \\\"type\\\": \\\"object\\\",\\r\\n  \\\"properties\\\": {\\r\\n    \\\"id\\\": {\\r\\n      \\\"type\\\": \\\"string\\\",\\r\\n      \\\"title\\\":\\\"Id\\\"\\r\\n    },\\r\\n    \\\"logoUri\\\":{\\r\\n      \\\"type\\\":\\\"string\\\",\\r\\n      \\\"format\\\":\\\"uri\\\",\\r\\n      \\\"title\\\":\\\"Logo\\\"\\r\\n    },\\r\\n    \\\"issuer\\\":{\\r\\n      \\\"type\\\":\\\"string\\\",\\r\\n      \\\"title\\\":\\\"Organization\\\"\\r\\n    },\\r\\n    \\\"issueTo\\\":{\\r\\n      \\\"type\\\":\\\"string\\\",\\r\\n      \\\"title\\\":\\\"Member\\\"\\r\\n    },\\r\\n    \\\"issueDate\\\":{\\r\\n      \\\"type\\\":\\\"string\\\",\\r\\n      \\\"format\\\":\\\"date\\\",\\r\\n      \\\"title\\\":\\\"Issue Date\\\"\\r\\n    },\\r\\n    \\\"signers\\\":{\\r\\n      \\\"type\\\":\\\"array\\\",\\r\\n      \\\"title\\\":\\\"Signed By\\\",\\r\\n      \\\"minItems\\\":1,\\r\\n      \\\"items\\\":{\\r\\n        \\\"type\\\":\\\"object\\\",\\r\\n        \\\"required\\\": [\\\"name\\\"],\\r\\n        \\\"properties\\\":{\\r\\n          \\\"name\\\":{\\r\\n            \\\"type\\\":\\\"string\\\",\\r\\n            \\\"title\\\":\\\"Name\\\"\\r\\n          },\\r\\n          \\\"title\\\":{\\r\\n            \\\"type\\\":\\\"string\\\",\\r\\n            \\\"title\\\":\\\"Title\\\"\\r\\n          },\\r\\n          \\\"signature\\\":{\\r\\n            \\\"type\\\":\\\"string\\\",\\r\\n            \\\"title\\\":\\\"Signature\\\"\\r\\n          }\\r\\n        }\\r\\n      }\\r\\n    }\\r\\n  }\\r\\n}\",\"views\":[]}', 'Membership', 'MEMBER', '0x799449c02c629e54999d92da3d6fbf64c133556cf2d58d38049f03da8041dee5', '1', 'UPA', '2018-09-30 07:58:13', '2018-09-30 07:58:57');


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
VALUES ('50', '0', '0x9e43e3361b5b12660c9551eb622547ccecf56d08', '{\"name\":\"Invoice\",\"symbol\":\"INV\",\"desc\":\"this is for invoice\",\"icon\":\"http://ipfs.chainmind.io/ipfs/Qmdru8PDUyfzDjhMBU4gVZJ8JTJ2jS1bCvNGcYxQ74vmGY\",\"schema\":\"{\\n  \\\"id\\\": \\\"https://wallet.chainmind.io/schema/invoice.json\\\",\\n  \\\"$schema\\\": \\\"http://json-schema.org/draft-07/schema#\\\",\\n  \\\"required\\\": [ \\\"id\\\",\\\"currency\\\",\\\"items\\\" ],\\n  \\\"type\\\": \\\"object\\\",\\n  \\\"properties\\\": {\\n    \\\"id\\\": {\\n      \\\"type\\\": \\\"string\\\",\\n      \\\"title\\\":\\\"Invoice Number\\\"\\n    },\\n    \\\"currency\\\":{\\n      \\\"type\\\": \\\"string\\\",\\n      \\\"enum\\\":[\\\"ETH\\\"],\\n      \\\"title\\\":\\\"Currency\\\"\\n    },\\n    \\\"dueDate\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"date\\\",\\n      \\\"title\\\":\\\"Due Date\\\"\\n    },\\n    \\\"items\\\":{\\n      \\\"type\\\":\\\"array\\\",\\n      \\\"title\\\":\\\"Item List\\\",\\n      \\\"items\\\":{\\n        \\\"type\\\":\\\"object\\\",\\n        \\\"properties\\\":{\\n          \\\"description\\\":{\\n            \\\"type\\\":\\\"string\\\",\\n            \\\"title\\\":\\\"Item\\\"\\n          },\\n          \\\"price\\\":{\\n            \\\"type\\\":\\\"number\\\",\\n            \\\"title\\\":\\\"Price\\\"\\n          },\\n          \\\"quantity\\\":{\\n            \\\"type\\\":\\\"number\\\",\\n            \\\"title\\\":\\\"Quantity\\\"\\n          }\\n        },\\n        \\\"required\\\":[\\\"description\\\",\\\"price\\\",\\\"quantity\\\"]\\n      }\\n    },\\n    \\\"buyer\\\":{\\n      \\\"type\\\":\\\"object\\\",\\n      \\\"title\\\":\\\"Buyer Information\\\",\\n      \\\"properties\\\":{\\n        \\\"name\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Name\\\"\\n        },\\n        \\\"address1\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Address Line 1\\\"\\n        },\\n        \\\"address2\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Address Line 2\\\"\\n        },\\n        \\\"city\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"City\\\"\\n        },\\n        \\\"region\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Province\\\"\\n        },\\n        \\\"country\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Country\\\"\\n        },\\n        \\\"postalCode\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Postal Code\\\"\\n        },\\n        \\\"email\\\":{\\n          \\\"type\\\":\\\"string\\\",\\n          \\\"title\\\":\\\"Email\\\"\\n        },\\n        \\\"notify\\\":{\\n          \\\"type\\\":\\\"boolean\\\",\\n          \\\"title\\\":\\\"Notify\\\",\\n          \\\"description\\\":\\\"whether receipt email should be sent to buyer for this invoice\\\"\\n        }\\n      }\\n    },\\n    \\\"remark\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Remark\\\"\\n    }\\n  }\\n}\\n\",\"views\":[]}', 'Invoice', 'INV', '0x1c367a8887cbfa25afe8a8da0c027e0abce2d5e27fd31d0ebc02866c32aa08fb', '1', 'UPA', '2018-09-30 08:00:29', '2018-09-30 08:01:09');


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
VALUES ('48', '0', '0x2f25e38759646b0a911d7f883725e2c233372c0a', '{\"name\":\"Memo\",\"symbol\":\"MEMO\",\"desc\":\"this is for memo\",\"icon\":\"http://ipfs.chainmind.io/ipfs/QmPAxgcm2uQB4QAm4SFDNRxQsJX6mF9bn6JjkXKPXiTj8M\",\"schema\":\"{\\n  \\\"id\\\": \\\"https://wallet.chainmind.io/schema/memo.json\\\",\\n  \\\"$schema\\\": \\\"http://json-schema.org/draft-07/schema#\\\",\\n  \\\"required\\\": [ \\\"recipient\\\",\\\"sender\\\",\\\"subject\\\",\\\"date\\\",\\\"message\\\" ],\\n  \\\"type\\\": \\\"object\\\",\\n  \\\"properties\\\": {\\n    \\\"recipient\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"To\\\"\\n    },\\n    \\\"sender\\\": {\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"From\\\"\\n    },\\n    \\\"subject\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Subject\\\"\\n    },\\n    \\\"date\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"date\\\",\\n      \\\"title\\\":\\\"Date\\\"\\n    },\\n    \\\"logoUri\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"uri\\\",\\n      \\\"title\\\":\\\"Logo\\\"\\n    },\\n    \\\"message\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Message\\\"\\n    }\\n  }\\n}\",\"views\":[]}', 'Memo', 'MEMO', '0xb47e1d7470ce841bd26e17d414ccd62c1c92426800c3741cd2c8bfaddcc3770a', '1', 'UPA', '2018-09-30 08:02:43', '2018-09-30 08:03:20');

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












