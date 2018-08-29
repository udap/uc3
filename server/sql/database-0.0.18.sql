ALTER TABLE `asset_type`
CHANGE COLUMN `icon` `metadata` LONGTEXT NULL DEFAULT NULL COMMENT 'asset type的metadata' ;