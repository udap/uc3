
CREATE TABLE `app_registry` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'auto-generated primary key',
  `gid` varchar(64) NOT NULL COMMENT '前端产生的全局id',
  `desc` varchar(128) DEFAULT NULL COMMENT '应用描述',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_app-gid` (`gid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1104 DEFAULT CHARSET=utf8;

CREATE TABLE `asset_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'auto-generated primary key',
  `gid` varchar(64) NOT NULL COMMENT '前端产生的全局id',
  `address` varchar(45) DEFAULT NULL COMMENT 'asset type的合约地址',
  `icon` LONGTEXT  DEFAULT NULL COMMENT 'asset type的logo',
  `name` varchar(45) DEFAULT NULL COMMENT 'asset type的name',
  `symbol` varchar(45) DEFAULT NULL COMMENT 'asset type的symbol',
  `tx_hash` varchar(128) DEFAULT NULL COMMENT '创建asset type的transaction hash',
  `status` tinyint(1) DEFAULT NULL COMMENT 'transaction hash 的 status(0 fail、1 success、2 pending)',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_app-gid_address` (`gid`,`address`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1104 DEFAULT CHARSET=utf8;


CREATE TABLE `mint_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'auto-generated primary key',
  `gid` varchar(64) NOT NULL COMMENT '前端产生的全局id',
  `type_addr` varchar(45) NOT NULL COMMENT 'asset type的合约地址',
  `to` varchar(45) NOT NULL COMMENT 'mint to address',
  `name` varchar(45) DEFAULT NULL COMMENT 'metadata name',
  `desc` varchar(255) DEFAULT NULL COMMENT 'metadata description',
  `image` LONGTEXT  DEFAULT NULL COMMENT 'metadata image',
  `owner` varchar(45) DEFAULT NULL COMMENT '调用者地址',
  `tx_hash` varchar(128) DEFAULT NULL COMMENT 'transaction hash',
  `status` tinyint(1) DEFAULT NULL COMMENT 'transaction hash 的 status(0 fail、1 success、2 pending)',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_app-gid_address` (`gid`,`address`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1104 DEFAULT CHARSET=utf8;


