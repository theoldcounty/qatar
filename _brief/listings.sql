/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50617
Source Host           : localhost:3306
Source Database       : qatar

Target Server Type    : MYSQL
Target Server Version : 50617
File Encoding         : 65001

Date: 2017-02-25 21:05:59
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for listings
-- ----------------------------
DROP TABLE IF EXISTS `listings`;
CREATE TABLE `listings` (
  `id` mediumint(9) DEFAULT NULL,
  `roll-over-description-english` varchar(100) DEFAULT NULL,
  `roll-over-description-arabic` varchar(100) DEFAULT NULL,
  `full-description-english` longtext,
  `full-description-arabic` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of listings
-- ----------------------------
INSERT INTO `listings` VALUES (null, 'Curious countryside cottages. \r\n\r\nCotswolds.', '???? ????? ????? ?????. \r\n\r\n????????? (Cotswolds).', '', null);
