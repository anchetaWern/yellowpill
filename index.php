<?php
session_start();
require_once('conn.php');
$databases = $db->query("
		SELECT DISTINCT SCHEMA_NAME
    FROM INFORMATION_SCHEMA.SCHEMATA
");
?>
<link rel="stylesheet" href="css/style.css"/>
<link rel="stylesheet" href="css/jqueryui.css" />
<link rel="stylesheet" href="libs/foundation/stylesheets/foundation.css"/>
<link rel="stylesheet" href="libs/noty/css/jquery.noty.css">
<link rel="stylesheet" href="libs/noty/css/noty_theme_default.css"/>

<div id="container">
	<h1>YellowPill</h1>
	<div id="form_container">
		<div class="databases">
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

		<div class="queries">
			<label for="query_string">Query String</label>
			<textarea id="query_string">
			</textarea>
		</div>
		<label for="">Query Options</label>
		<div class="query_options">

			<div class="select_query active_option" data-qoption="select">
				Select
			</div>
			<div class="update_query" data-qoption="update">
				Update
			</div>
			<div class="delete_query" data-qoption="delete">
				Delete
			</div>
			<div class="insert_query" data-qoption="insert">
				Insert
			</div>
		</div><!--/.query_options-->
	</div><!--/.container-->
	
	<div class="existing_tables"  style="display:none;">
	
	</div><!--/.existing_tables-->

	<div id="where_modal" class="reveal-modal large">
	  <h4>Where</h4>
	  <a class="close-reveal-modal">&#215;</a>

	  <div class="selected_fields">
	  	
	  </div><!--/.selected_fields-->
	  
	  <div class="field_values">
	  	
	  </div><!--/.field_values-->

	  <div class="custom_values">
	  	
	  </div><!--/.custom_values-->

	  <input type="button" class="medium button" id="add_where" value="Add to Query">
	</div><!--/#where_modal-->

</div><!--/.container-->

<script src="js/jquery.js"></script>
<script src="js/jqueryui.js"></script>
<script src="keymaster.js"></script>
<script src="libs/noty/js/jquery.noty.js"></script>
<script src="libs/foundation/javascripts/jquery.foundation.reveal.js"></script>
<script>
	$("#btn_connect").click(function(){
		var db = $.trim($("#db").val());
		$(".existing_tables").load("get_db.php", {"db" : db}, function(){


					if(typeof createField  == "undefined"){
						var script = $("<script>").attr({"id" : "mainscript" , "src" : "js/main.js"});;
						var container = $("#container");
						script.insertAfter(container);
					}
					shortenFields();
		});

	});
</script>