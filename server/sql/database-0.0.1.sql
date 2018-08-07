
CREATE TABLE `app_registry` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'auto-generated primary key',
  `gid` varchar(64) NOT NULL COMMENT '前端产生的全局id',
  `desc` varchar(128) NOT NULL COMMENT '应用描述',
  `create_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_app-gid` (`gid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1104 DEFAULT CHARSET=utf8;

CREATE TABLE `asset_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'auto-generated primary key',
  `gid` varchar(64) NOT NULL COMMENT '前端产生的全局id',
  `address` varchar(45) NOT NULL COMMENT 'asset type的合约地址',
  `icon` varchar(200) NOT NULL COMMENT 'asset type的logo',
  `name` varchar(45) NOT NULL COMMENT 'asset type的name',
  `symbol` varchar(45) NOT NULL COMMENT 'asset type的symbol',
  `create_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_app-gid_address` (`gid`,`address`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1104 DEFAULT CHARSET=utf8;

