<?php
require_once('yp.php');
$yp = new yp("localhost", "root", "1234", "redbean", 1);
$tables = $yp->getTables();
$fields = $yp->getFields();
$links = $yp->getTableLinks();
?>
<link rel="stylesheet" href="style.css"/>
<link rel="stylesheet" href="http://code.jquery.com/ui/1.9.0/themes/base/jquery-ui.css" />
<link rel="stylesheet" href="libs/foundation/stylesheets/foundation.css"/>
<link rel="stylesheet" href="libs/noty/css/jquery.noty.css">
<link rel="stylesheet" href="libs/noty/css/noty_theme_default.css"/>

<div id="container" style="display:none;">
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

	<div class="table drag_tbl">
		<div class="tbl_header">
			<input type="text" class="tbl_name" placeholder="table name">
			<input type="checkbox" class="connector"/>
		</div>
		<div class="tbl_fields">
			<div class="fields drag_field">
					<input type="text" class="field_name" placeholder="field name">
			</div>
		</div>
	</div>

</div>

<script src="http://code.jquery.com/jquery-1.8.2.js"></script>
<script src="http://code.jquery.com/ui/1.9.0/jquery-ui.js"></script>
<script src="keymaster.js"></script>
<script src="libs/noty/js/jquery.noty.js"></script>
<script src="js/main.js"></script>