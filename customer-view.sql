
use bamazon_DB; 




create table products (
	item_id int not null auto_increment,
    product_name varchar(30) not null,
    department_name varchar(30),
    price decimal(10,2) not null,
    stock_quantity int(4) not null,
    primary key (item_id)
);