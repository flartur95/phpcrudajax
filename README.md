# PHP PDO CRUD with ajax jQuery and Bootstrap

- create database name "testedbdois"
- create table using given below sql statement


-- Table structure for table `products`

```sh
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `product_value` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=68 ;
```


-- Dumping data for table `products`

```sh
INSERT INTO `products` (`id`, `product_name`, `product_value`) VALUES
(18, 'Bike', '$100'),
(19, 'Motorcycle', '$400'),
(20, 'Halls', '$0.5'),
(21, 'Freegels', '$0.1'),
(22, 'Chocolate', '$1');
```
