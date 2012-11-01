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
<link rel="stylesheet" href="css/font-awesome.css"/>

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
		</div><!--/.databases-->

			<div class="join_types">
				<label>Join type</label>
				<label for="where_join">
					<input type="radio" name="join" id="where_join" checked/>
					Where Join
				</label>

				<label for="inner_join">
					<input type="radio" name="join" id="inner_join"/>
					Inner Join
				</label>

				<label for="left_join">
					<input type="radio" name="join" id="left_join"/>
					Left Join
				</label>

				<label for="right_join">
					<input type="radio" name="join" id="right_join"/>
					Outer Join
				</label>

				<label>Main Table</label>
				<select id="parent_table" class="parent_table"></select>
			</div><!--/.join_types-->

	
		<div class="queries">
			<label for="query_string">Query String</label>
			<textarea id="query_string">
			</textarea>

	
		</div><!--/.queries-->

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
	</div><!--/#form_container-->
	
	<div class="existing_tables"  style="display:none;">
	
	</div><!--/.existing_tables-->

	<div id="where_modal" class="reveal-modal large">
	  <h4>Where Clause</h4>
	  <a class="close-reveal-modal">&#215;</a>

	  <div class="selected_fields">
	  	
	  </div><!--/.selected_fields-->
	  
	  <div class="field_values">
	  	
	  </div><!--/.field_values-->

	  <div class="custom_values">
	  	
	  </div><!--/.custom_values-->

	  <input type="button" class="medium button" id="add_where" value="Add to Query">
	</div><!--/#where_modal-->

	<div id="link_modal" class="reveal-modal medium">
		<h4>Link Tables</h4>
		<a class="close-reveal-modal">&#215;</a>
		<div class="join_fields">
			<div class="table3" id="table3">
				
			</div>

			<div class="table1">
				
			</div>

			<div class="table2">
				
			</div>

		</div>
		<input type="button" class="medium button" id="add_link" value="Link tables">
	</div><!--/#link_modal-->

	<div id="join_modal" class="reveal-modal medium">
		<h4>Join Tables</h4>
		<a class="close-reveal-modal">&#215;</a>
		<div class="join_fields">
			<div class="left_table">
				
			</div>

			<div class="right_table">
				
			</div>
		</div><!--/.join_fields-->
		<input type="button" class="medium button" id="add_join" value="Join tables">
	</div><!--/#join_modal-->

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
					
		});

	});
</script>