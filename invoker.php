<?php
require_once('yp.php');
$yp = new yp("localhost", "root", "1234", "redbean", 1);

$action = $_POST['action'];
$table_name = $_POST['table'];
switch($action){
	
	case 'create_tbl':
		
		$fields = $_POST['fields'];
		
		echo $yp->createTable($table_name, $fields);
	break;

	case 'drop_tbl':
		echo $yp->dropTable($table_name);
	break;

	case 'modify_tbl':
		
		echo $yp->modifyFields($table_name, $fields, $options);
	break;
}
?>