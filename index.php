<?php
session_start();
require_once('conn.php');
$databases = $db->query("
		SELECT DISTINCT SCHEMA_NAME
    FROM INFORMATION_SCHEMA.SCHEMATA
");
?>
<link rel="stylesheet" href="style.css"/>
<link rel="stylesheet" href="http://code.jquery.com/ui/1.9.0/themes/base/jquery-ui.css" />
<link rel="stylesheet" href="libs/foundation/stylesheets/foundation.css"/>
<link rel="stylesheet" href="libs/noty/css/jquery.noty.css">
<link rel="stylesheet" href="libs/noty/css/noty_theme_default.css"/>

<div id="container">
	<div id="form_container">
		<label for="db">Database</label>
		<?php
		if($databases->num_rows > 0){ ?>
		<input type="text" name="db" id="db" autocomplete="off" list="db_list">
		<datalist id="db_list">
			<?php
			while($row = $databases->fetch_object()){
			?>
				<option value="<?php echo $row->SCHEMA_NAME; ?>"><?php echo $row->SCHEMA_NAME; ?></option>
			<?php
			}
			?> 
		</datalist>
		<?php
		}
		?>
		<button type="button" class="small button" id="btn_connect" >Connect</button>
	</div>
	
	<div class="existing_tables"  style="display:none;">
		

	</div>
<!--
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
-->
</div>

<script src="http://code.jquery.com/jquery-1.8.2.js"></script>
<script src="http://code.jquery.com/ui/1.9.0/jquery-ui.js"></script>
<script src="keymaster.js"></script>
<script src="libs/noty/js/jquery.noty.js"></script>
<script>
	$("#btn_connect").click(function(){
		var db = $.trim($("#db").val());
		$(".existing_tables").load("get_db.php", {"db" : db});
	});
</script>