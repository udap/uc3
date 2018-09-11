INSERT INTO `asset_type` (`id`, `gid`, `address`, `metadata`, `name`, `symbol`, `tx_hash`, `status`, `type`, `create_time`, `update_time`)
VALUES ('1', '0', '0x68f2CBdA42eDb8f2A4Da853b34E772A5f8e98Ce0', '{\"icon\":\"https://www.udap.io/logo400x400.png\"}', 'UDAP Token', 'UPX', NULL, '1', 'ERC20', '2018-09-07 14:45:47', '2018-09-07 15:38:58');

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
		'34',
		'view',
		'https://wallet.chainmind.io/template/membership',
		'/view.html',
		'/view-thumbnail.png',
		'2018-09-08 20:35:31',
		'2018-09-10 11:56:24'
	);
INSERT INTO `asset_type` (`id`, `gid`, `address`, `metadata`, `name`, `symbol`, `tx_hash`, `status`, `type`, `create_time`, `update_time`)
VALUES ('34', '0', '0x34fbaa3bf9f283fdd91cc0fbd93555ef5c4c0323', '{\"name\":\"membership\",\"symbol\":\"MSHP\",\"desc\":\"this is for membership\",\"icon\":\"https://ipfs.io/ipfs/QmVsXh19LLtpaccJXRMZF9yakUUHtP6KKCxsvTmtcuwmzq\",\"schema\":\"{\\n  \\\"id\\\": \\\"https://wallet.chainmind.io/schema/membership.json\\\",\\n  \\\"$schema\\\": \\\"http://json-schema.org/draft-07/schema#\\\",\\n  \\\"description\\\": \\\"Membership Certificate\\\",\\n  \\\"required\\\": [ \\\"id\\\",\\\"issuer\\\",\\\"issueTo\\\",\\\"issueDate\\\",\\\"signers\\\"],\\n  \\\"type\\\": \\\"object\\\",\\n  \\\"properties\\\": {\\n    \\\"id\\\": {\\n      \\\"type\\\": \\\"string\\\",\\n      \\\"title\\\":\\\"Id\\\"\\n    },\\n    \\\"logoUri\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"uri\\\",\\n      \\\"title\\\":\\\"Logo\\\"\\n    },\\n    \\\"isser\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Organization\\\"\\n    },\\n    \\\"issueTo\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"title\\\":\\\"Member\\\"\\n    },\\n    \\\"issueDate\\\":{\\n      \\\"type\\\":\\\"string\\\",\\n      \\\"format\\\":\\\"date\\\",\\n      \\\"title\\\":\\\"Issue Date\\\"\\n    },\\n    \\\"signers\\\":{\\n      \\\"type\\\":\\\"array\\\",\\n      \\\"title\\\":\\\"Signed By\\\",\\n      \\\"minItems\\\":1,\\n      \\\"items\\\":{\\n        \\\"type\\\":\\\"object\\\",\\n        \\\"properties\\\":{\\n          \\\"name\\\":{\\n            \\\"type\\\":\\\"string\\\",\\n            \\\"title\\\":\\\"Name\\\"\\n          },\\n          \\\"title\\\":{\\n            \\\"type\\\":\\\"string\\\",\\n            \\\"title\\\":\\\"Title\\\"\\n          },\\n          \\\"signature\\\":{\\n            \\\"type\\\":\\\"string\\\"\\n          }\\n        }\\n      }\\n    }\\n  }\\n}\\n\",\"views\":[]}', 'membership', 'MSHP', '0x33a85fe48e1b9e1148cc03c270b5c124012ecd1d237215044fed6933c9e452b3', '1', 'UPA', '2018-09-11 18:47:27', '2018-09-11 18:55:11');
