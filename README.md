Yellowpill
==========

This application will be used for quick database schema generation and visualization

##Current Features

- Creating tables
- Updating names, data types and options for existing fields
- Adding new fields to existing tables
- Joining tables
- Deleting tables


##Current Issues

- Response messages are not accurate


##Todo

- Creating new database
- Improve response messages. Currently the application does not issue an error if the operation cannot be performed or something went wrong

- Ordering of fields
- Visualization on which tables are connected
- Dropping database 
- Transferring current fields from current table to another


##Configuration

In order to use this application you need to ```mysqli``` extension enabled. 
You can enable it on the ```php.ini``` file.

```php
$yp = new yp(HOST, USER, PASSWORD, DATABASE, OPTION);
```

Options:

0 - debug mode returns the actual query that is to be executed 
1 - executes the query