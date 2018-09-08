INSERT INTO `asset_type` (`id`, `gid`, `address`, `metadata`, `name`, `symbol`, `tx_hash`, `status`, `type`, `create_time`, `update_time`)
VALUES ('1', '0', '0x68f2CBdA42eDb8f2A4Da853b34E772A5f8e98Ce0', '{\"icon\":\"https://www.udap.io/logo400x400.png\"}', 'UDAP Token', 'UPX', NULL, '1', 'ERC20', '2018-09-07 14:45:47', '2018-09-07 15:38:58');


INSERT INTO `ropsten`.`view_template` (`id`, `type_id`, `key`, `context`, `template_uri`, `create_time`, `update_time`)
VALUES ('1', '8', 'view', 'https://wallet.chainmind.io/template/certificate', '/view.html', '2018-09-08 20:35:31', '2018-09-08 20:37:25');
