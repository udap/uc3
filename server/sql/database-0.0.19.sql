CREATE TABLE `view_template` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'auto-generated primary key',
  `type_id` int(11) NOT NULL COMMENT 'type address id',
  `key` varchar(256) NOT NULL COMMENT 'view type，e.g. view、create、update',
  `context` varchar(512) NOT NULL COMMENT 'template http url or local file, e.g.,http://xxx or file:/home/xxx/xxx)',
  `template_uri` varchar(512) NOT NULL COMMENT 'file path, e.g., /index.html)',
  `thumbnail` varchar(512) NOT NULL COMMENT 'thumbnail, e.g. /xxx.png)',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1104 DEFAULT CHARSET=utf8;


