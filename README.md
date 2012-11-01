Yellowpill
==========

This application will be used for quick database schema generation and visualization

##Current Features

- Creating tables
- Updating names, data types and options for existing fields
- Adding new fields to existing tables
- Joining tables
- Deleting tables
- Dropping fields
- Generating Select Queries from multiple tables
- Generating Update, Delete and Insert queries on a single table
- Adding of where clause to queries
- Transferring 1 or more fields from one table to another (only fields from a single table can be selected)


##Current Issues

- Response messages are not accurate
- Script for creating new tables and fields executes a dozen of times
- Cannot create new tables for newly created databases
- UI Issues


##Configuration

In order to use this application you need to ```mysqli``` extension enabled. 
You can enable it on the ```php.ini``` file.
You can update the connection details in config.php file

```php
<?php
define('HOST', 'localhost'); //host
define('USER', 'root'); //user
define('PASSWORD', ''); //password
?>
```

##Options

```php
0 //debug mode returns the actual query string to be executed 
1 //executes the query
```

##How to Use

This project is still very early in development so its expected that there are still a lot of bugs but its already useable.
To use this application you have to edit the configuration file and supply your database information (instructions are above).

If the database information that you supplied is correct then access ```http://127.0.0.1:8020/yellowpill/``` on your browser.
You might have a different port number where apache is running so you may have to change ```8020``` with that specific port number.

Next, select the database that you want to work with by typing its first few letters so that it will show up in the auto-suggest field for the database.

You have to hold the ctrl key on your keyboard when selecting tables or fields. 
You can select tables or fields by clicking on any area with the move cursor(arrow with 4 heads). 
Clicking on a selected table or field will deselect what you have selected.


##Keyboard Shortcuts

```php
f -create new field(a table must already be selected before creating a new field, you can also press enter from inside an existing field to create a new field for the selected table)
t -generate a new table
s -save new table(to save a table there must be atleast one field in it)
d -drop table(existing table can be selected by clicking the table or anywhere inside the table)
j -join tables(tables to be joined can be selected using the checkbox just below the tables name)
a -selects all fields from currently selected table
del -drop selected fields


//generating queries
alt+s -generates a select query from tables and fields that were selected
alt+u -generates an update query
alt+i -generates an insert query
alt+d -generates a delete query

alt+w -shows the where modal. It is used for supplying where statements on the current query.
```

##Shorthand Values

The following shortcuts for field definitions are used in the app.

```javascript
			'TXT' : 'TEXT',
			'TI' : 'TINYINT', 
			'SI' : 'SMALLINT',
			'MI' : 'MEDIUMINT',
			'I' : 'INT', 
			'BI' : 'BINGINT', 
			'B' : 'BIT', 
			'F' : 'FLOAT', 
			'DBL' : 'DOUBLE',
			'DC' : 'DECIMAL', 
			'C' : 'CHAR', 
			'VC' : 'VARCHAR',
			'TT' : 'TINYTEXT',
			'MT' : 'MEDIUMTEXT',
			'LT' : 'LONGTEXT',
			'BIN' : 'BINARY', 
			'VBIN' : 'VARBINARY',
			'TB' : 'TINYBLOB',
			'BL' : 'BLOB', 
			'MB' : 'MEDIUMBLOB',
			'LB' : 'LONGBLOB',
			'D' : 'DATE', 
			'T' : 'TIME', 
			'Y' : 'YEAR',
			'DT' : 'DATETIME',
			'TS' : 'TIMESTAMP', 
			'PT' : 'POINT',
			'LS' : 'LINESTRING',
			'POLY' : 'POLYGON', 
			'GEO' : 'GEOMETRY', 
			'MP' : 'MULTIPOINT',
			'MLS' : 'MULTILINESTRING', 
			'MPOLY' : 'MULTIPOLYGON',
			'GEOCOL' : 'GEOMETRYCOLLECTION', 
			'E' : 'ENUM', 
			'S' : 'SET',
			'PK' : 'PRIMARY KEY',
			'FK' : 'FOREIGN KEY',
			'AI' : 'AUTO_INCREMENT',
			'NN' : 'NOT NULL',
			'NX' : 'NULL',
			'DEF' : 'DEFAULT',
			'CT' : 'CURRENT_TIMESTAMP'
```

##Conditions

Here are some conditions to keep in mind before performing an update to the database structure. 
If there is an error with the operation that you're trying to do then one of these conditions may not have been met.

- A table cannot have two fields with the same name
- A base field cannot be transferred from one table to another
- Tables should have unique names
- A table can only have 1 field that acts as the primary key
- A table may or may not have a primary key. You can choose to make a primary key field auto-increment by supplying the ```AI``` option
- Default values for fields must have the same data type with the data type that you have defined for that specific field.
For example if the data type is timestamp you can't have a default value of "A" or 123, instead you can have the default data as
current timestamp ```CT```


##Terms

Here are some of the terms that I've used:

- **Base field** - a field referenced by a field from another table
- **Child field** - a field which references a base field
- **Base table** - a table that is referenced from another table
- **Child table** - a table referencing another table


##Todo

- Improve response messages. Currently the application does not issue an error if the operation cannot be performed or something went wrong
- Visualization on which tables are connected and which fields connects the tables
- Transferring current fields from current table to another
- Populating the database with values
- Adding functions like COUNT and MD5 in queries
- Visual Representation on which is the primary key, foreign key, unique key in the table
- Add function that checks default data
- Add function that checks if primary key already exists for that table
- Add function to check if a field is a base field
- Ability to choose whether to use ```LIKE``` or ```=``` when constructing ```WHERE``` clause
- Using ```LIMIT``` and ```OFFSET```
- Ability to choose whether to use ```AND``` or ```OR``` on ```WHERE``` clause
- ```ORDER BY``` and ```GROUP BY```
- Adding of Indexes to fields