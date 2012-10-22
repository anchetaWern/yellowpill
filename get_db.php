<?php
require_once('config.php');
require_once('db.php');
require_once('yp.php');

$db = new db(HOST, USER, PASSWORD);


if($db->hasDatabase($_POST['db']) === 1){
	$yp = new yp(HOST, USER, PASSWORD, $_POST['db'], 1);
	$_SESSION['db'] = $_POST['db'];

	$tables = $yp->getTables();
	$fields = $yp->getFields();
	$links = $yp->getTableLinks();
?>
<h3><?php echo $yp->dbname; ?></h3>	
<?php
if(!empty($tables)){
	foreach($tables as $table){
?>
		<div class="table drag_tbl" id="<?php echo $table; ?>">
			<div class="tbl_header">
				<input type="text" class="tbl_name" value="<?php echo $table; ?>" placeholder="table name">
				<input type="checkbox" class="connector"/>
			</div>
			<div class="tbl_fields">
			<?php 
			foreach($fields[$table] as $field){
			?>
			<div class="fields drag_field" id="<?php echo $field['field_name']; ?>">
				<input type="text" 
				class="field_name" 
				value="<?php echo $field['field_name'] . ": " . $field['column_type'] . " " . $field['default_data'] . " " . $field['column_key'] . " " . $field['nullable'] . " " . $field['extra']; ?>" id="field_<?php echo $field['field_name']; ?>" placeholder="field name" data-fieldname="<?php echo $field['field_name']; ?>">
			</div>
			<?php
			}
			?>
			</div>
		</div>
<?php
	}
}
?>
<?php
}
?>
