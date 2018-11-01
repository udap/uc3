
ALTER TABLE `tx_sent`
ADD UNIQUE INDEX `uk-tx_sent-tx_hash` (`tx_hash` ASC);


CREATE TABLE `domain_name` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'auto-generated primary key',
  `gid` varchar(256) NOT NULL COMMENT 'global id',
  `name` varchar(45) DEFAULT NULL COMMENT 'domain name',
  `tx_hash` varchar(128) NOT NULL COMMENT 'transaction hash',
  `status` tinyint(1) NOT NULL COMMENT 'transaction hash  status(0 fail、1 success、2 pending)',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk-domain_name-tx_hash` (`tx_hash`)
) ENGINE=InnoDB AUTO_INCREMENT=1104 DEFAULT CHARSET=utf8;


