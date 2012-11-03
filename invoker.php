<?php
session_start();
require_once('config.php');
require_once('yp.php');
$yp = new yp(HOST, USER, PASSWORD, $_SESSION['db'], 1);

$action = $_POST['action'];

switch($action){

	case 'create_tbl':
		$table = $_POST['table'];
		$fields = $_POST['fields'];
		
		echo $yp->createTable($table, $fields);
	break;

	case 'rename_tbl':
		$current_tablename = $_POST['current_table'];
		$new_tablename = $_POST['new_table'];
		echo $yp->renameTable($current_tablename, $new_tablename); 
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
		$fields = $_POST['new_field'];
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
		$childField = $_POST['child_field'];
		$mainField = $_POST['main_field'];
		echo $yp->createLink($childTable, $mainTable, $childField, $mainField);
	break;

	case 'order_field':
		$table = $_POST['table'];
		$field_to_move = $_POST['field'];
		
		$base_field = "";
		if(!empty($_POST['base_field'])){
			$base_field = $_POST['base_field'];
		}
		
		$position = $_POST['position'];
		echo $yp->orderField($table, $field_to_move, $position, $base_field);
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