<?php
require_once('yp.php');
$yp = new yp("localhost", "root", "1234", "redbean", 1);

$action = $_POST['action'];

switch($action){
	
	case 'create_tbl':
		$table_name = $_POST['table'];
		$fields = $_POST['fields'];
		
		echo $yp->createTable($table_name, $fields);
	break;

	case 'drop_tbl':
		$table_name = $_POST['table'];
		echo $yp->dropTable($table_name);
	break;

	case 'modify_tbl':
		$table_name = $_POST['table'];
		echo $yp->modifyFields($table_name, $fields, $options);
	break;

	case 'join_tbl':
		$childTable = $_POST['child_table'];
		$mainTable = $_POST['main_table'];
		$childField = str_replace("field_", "", $_POST['child_field']);
		$mainField = str_replace("field_", "", $_POST['main_field']);
		echo $yp->createLink($childTable, $mainTable, $childField, $mainField);
	break;
}
?>