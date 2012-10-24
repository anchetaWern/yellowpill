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

##Keyboard Shortcuts

```php
f //create new field(a table must already be selected before creating a new field, you can also press enter from inside an existing field to create a new field for the selected table)
t //generate table
s //save new table(to save a table there must be atleast one field in it)
d //drop table(existing table can be selected by clicking the table or anywhere inside the table)
j //join tables(tables to be joined can be selected using the checkbox just below the tables name)
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

##Todo

- Improve response messages. Currently the application does not issue an error if the operation cannot be performed or something went wrong
- Ordering of fields
- Visualization on which tables are connected and which fields connects the tables
- Dropping database 
- Transferring current fields from current table to another
- Populating the database with values
- When selecting from multiple tables put an alias for fields with the same name (tablename + fieldname)
- Adding functions like COUNT and MD5 in queries