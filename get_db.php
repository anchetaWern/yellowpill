<?php
session_start();
require_once('config.php');
require_once('db.php');
require_once('yp.php');

$db = new db(HOST, USER, PASSWORD);

$_SESSION['db'] = $_POST['db'];

if($db->hasDatabase($_POST['db']) === 1){
	$yp = new yp(HOST, USER, PASSWORD, $_POST['db'], 1);
	
	$tables = $yp->getTables();
	$fields = $yp->getFields();
	$links = $yp->getTableLinks();
?>
<?php
if(!empty($tables)){
	foreach($tables as $table){
?>
		<div class="table drag_tbl" id="<?php echo $table; ?>">
			<div class="tbl_header">
				<input type="text" class="tbl_name" value="<?php echo $table; ?>" placeholder="table name">
				
			</div>
			<div class="tbl_fields">
			<?php 
			foreach($fields[$table] as $field){
			?>
			<div class="fields drag_field" id="<?php echo $field['field_name']; ?>">
				<input type="text" 
				class="field_name" 
				value="<?php echo $field['field_name'] . ": " . $field['column_type'] . " " . $field['default_data'] . " " . $field['column_key'] . " " . $field['nullable'] . " " . $field['extra']; ?>" id="field_<?php echo $field['field_name']; ?>" placeholder="field name" data-fieldname="<?php echo $field['field_name']; ?>">
				<?php 
				if($field['column_key'] == "PRI"){
				?> 
				<strong class="has-tip PK" title="PRIMARY KEY">PK</strong>
				<?php
				}else if($field['column_key'] == "MUL"){
					$field_link = $yp->getFieldLink($table, $field['field_name']);
					
					$main_table = $field_link['main_table'];
					$main_field	= $field_link['main_field'];

					$link_tooltip = "Main table: $main_table\nMain Field: $main_field";
					?>

					<strong class="has-tip FK" title="<?php echo $link_tooltip; ?>">FK</strong>
				<?php	
				}else if($field['column_key'] == "UNI"){
				?>
					<strong class="has-tip UNI" title="UNIQUE">UNI</strong>
				<?php	
				}
				?>

				<?php
				$indexes = $yp->getFieldIndex($table, $field['field_name']);
				$index_tooltip = "Indexes:\n";
				if(!empty($indexes)){
				foreach($indexes as $index){
					$index_tooltip .= $index. "\n";
				} 
				?>
					<strong class="has-tip IN" title="<?php echo $index_tooltip; ?>">IN</strong>
				<?php	
				}
				?>
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

