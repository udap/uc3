ALTER TABLE `udap_test`.`asset_type`
CHANGE COLUMN `icon` `metadata` LONGTEXT NULL DEFAULT NULL COMMENT 'asset type的metadata' ;