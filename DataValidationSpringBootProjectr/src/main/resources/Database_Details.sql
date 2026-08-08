	drop database if exists user_db;
	create database user_db;
	use  user_db;
	create table address(
	   address_id int auto_increment,
	   street varchar(50),
	   city varchar(20),
	   constraint ps_address_id_pk primary key (address_id)
	);
	create table customer(
	   customer_id int auto_increment,
	   email_id varchar(50),
	   name varchar(20),
	   date_of_birth date,
	   address_id int,
	   constraint ps_customer_id_pk primary key (customer_id),
	   constraint ps_address_id_fk foreign key (address_id) references address(address_id)
	);
	insert into address values (1, '15 Yemen Road', 'Yemen');
	insert into address values (2, 'Wallstreet', 'New York');
	insert into address values (3, 'Houston Street', 'New York');
	insert into customer values (1, 'martin@infy.com', 'Martin', sysdate()- interval 9000 day, 1);
	insert into customer values (2, 'tim@infy.com', 'Tim', sysdate()- interval 5000 day, 2);
	insert into customer values (3, 'jack@infy.com', 'Jack', sysdate()- interval 6000 day, 3);
	commit;
	select * from customer;
	select * from address;