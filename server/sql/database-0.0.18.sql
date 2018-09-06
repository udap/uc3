ALTER TABLE `asset_type`
CHANGE COLUMN `icon` `metadata` LONGTEXT NULL DEFAULT NULL COMMENT 'asset type的metadata' ;

DROP TABLE IF EXISTS `mint_record`;
CREATE TABLE `tx_sent` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'auto-generated primary key',
  `gid` varchar(64) NOT NULL COMMENT 'user appid',
  `owner` varchar(45) NOT NULL COMMENT '调用者地址',
  `tx_hash` varchar(128) NOT NULL COMMENT 'transaction hash',
  `status` tinyint(1) NOT NULL COMMENT 'transaction hash 的 status(0 fail、1 success、2 pending)',
  `from` varchar(45) NOT NULL COMMENT 'from address',
  `to` varchar(45) NOT NULL COMMENT 'to address',
  `value` varchar(45) NOT NULL COMMENT 'eth value',
  `gas_price` varchar(64) NOT NULL,
  `gas_limit` varchar(64) NOT NULL,
  `gas_used` varchar(64) DEFAULT NULL,
  `tx_cost` varchar(64) DEFAULT NULL COMMENT 'gas_used * gas_price + value',
  `tx_fee` varchar(64) DEFAULT NULL COMMENT 'tx_cost to $',
  `nonce` varchar(64) NOT NULL,
  `data` LONGTEXT  DEFAULT NULL COMMENT 'transaction input data',
  `biz_type` varchar(64) NOT NULL COMMENT '业务类型。比如：创建asset（CREATE_ASSET）',
  `biz_id` varchar(64) NOT NULL COMMENT '业务id。失败重试的时候，业务编号不变',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1104 DEFAULT CHARSET=utf8;



CREATE TABLE `fees` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'auto-generated primary key',
  `destination` varchar(45) NOT NULL COMMENT 'contract address',
  `methodId` varchar(128) NOT NULL COMMENT 'e.g., bytes4(keccak256(mint(address,string)))',
  `fees` varchar(128) NOT NULL,
  `memo` varchar(128) DEFAULT NULL COMMENT 'e.g., mint(address,string)',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1104 DEFAULT CHARSET=utf8;


