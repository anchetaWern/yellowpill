<?php
require_once('yp.php');
$yp = new yp("localhost", "root", "1234", "redbean", 0);

$action = $_POST['action'];

switch($action){
	
	case 'create_tbl':
		$table = $_POST['table'];
		$fields = $_POST['fields'];
		
		echo $yp->createTable($table, $fields);
	break;

	case 'drop_tbl':
		$table = $_POST['table'];
		echo $yp->dropTable($table);
	break;

	case 'modify_field':
		$table = $_POST['table'];
		$old_field = $_POST['old_field'];
		$new_field = $_POST['new_field'];
		echo $yp->modifyFields($table, $old_field, $new_field);
	break;

	case 'add_field':
		$table = $_POST['table'];
		$fields = $_POST['fields'];
		echo $yp->addFields($table, $fields);
	break;

	case 'drop_field':
		$table = $_POST['table'];
		$fields = $_POST['fields'];
		echo $yp->dropFields($table, $fields);
	break;

	case 'join_tbl':
		$childTable = $_POST['child_table'];
		$mainTable = $_POST['main_table'];
		$childField = str_replace("field_", "", $_POST['child_field']);
		$mainField = str_replace("field_", "", $_POST['main_field']);
		echo $yp->createLink($childTable, $mainTable, $childField, $mainField);
	break;

	case 'has_tbl':
		$table = $_POST['table'];
		echo $yp->hasTable($table);
	break;

	case 'has_field':
		$table = $_POST['table'];
		$field = $_POST['field'];
		echo $yp->hasField($table, $field);
	break;
}
?>