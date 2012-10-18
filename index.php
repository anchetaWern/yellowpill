<?php
require_once('yp.php');
$yp = new yp("localhost", "root", "1234", "redbean", 1);
$tables = $yp->getTables();
$fields = $yp->getFields();
?>
<link rel="stylesheet" href="style.css"/>
<link rel="stylesheet" href="http://code.jquery.com/ui/1.9.0/themes/base/jquery-ui.css" />
<link rel="stylesheet" href="libs/foundation/stylesheets/foundation.css"/>
<div id="container">
<?php
if(!empty($tables)){
	foreach($tables as $table){
?>
		<div class="table drag_tbl">
			<div class="tbl_header">
				<input type="text" class="tbl_name" value="<?php echo $table; ?>" placeholder="table name">
				<input type="checkbox" class="connnector"/>
			</div>
			<div class="tbl_fields">
			<?php 
			foreach($fields[$table] as $field){
			?>
			<div class="fields drag_field" id="<?php echo $table . "-" .$field['field_name']; ?>">
				<input type="text" class="field_name" value="<?php echo $field['field_name']; ?>"  placeholder="field name">
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
			<input type="checkbox" class="connnector"/>
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

<script>
	var current_table;

	$(".drag_tbl").draggable(); 
	
	$(".drag_field").draggable();

	$(".table").droppable({
		drop: function(event, ui){
			
			var field_id = ui.draggable[0].id;
			var current_container = $(this);
			var tbl_fields = current_container.children('.tbl_fields');
			var field = $('#' + field_id).detach().css({top: 0, left: 0}).appendTo(tbl_fields);
			
			
		}
	});

	$(".table").live('click', function(){
		var tbl_id = $(this).find('.tbl_name').val();
		current_table = tbl_id;

		$(".table").removeClass('active');

		if($(this).is('.active')){

			$(this).removeClass('active');
		}else{
			$(this).addClass('active');
		}
	});

	var createField = function(){
		var field_container = $("<div>").addClass("fields drag_field");
		var field = $("<input>").attr({"type" : "text", "placeholder" : "field name"}).addClass("field_name");
		field_container.append(field);
		var table = $('#' + current_table + " .tbl_fields");
		table.append(field_container);
		field_container.draggable();
		field.focus();
	};

	var createTable = function(){

		var table = $("<div>").addClass("table drag_tbl");
		var tbl_header = $("<div>").addClass("tbl_header");
		var tbl_name = $("<input>").attr("placeholder", "table name").addClass("tbl_name");
		var tbl_field = $("<div>").addClass("tbl_fields");
		var field_container = $("<div>").addClass("fields drag_field");
		var field = $("<input>").attr({"type" : "text", "placeholder" : "field name"}).addClass("field_name");
		console.log(tbl_name);
		tbl_header.append(tbl_name);
		table.append(tbl_header);
		field_container.append(field);
		tbl_field.append(field_container);
		table.append(tbl_field);
		$('#container').append(table);

	};

	var datatypes = {
			'TI' : 'TINYINT', 'SI' : 'SMALLINT',
			'MI' : 'MEDIUMINT',
			'I' : 'INT', 'BI' : 'BINGINT', 
			'B' : 'BIT', 'F' : 'FLOAT' , 'DBL' : 'DOUBLE',
			'DC' : 'DECIMAL', 'C' : 'CHAR', 'VC' : 'VARCHAR',
			'TT' : 'TINYTEXT',
			'TXT' : 'TEXT', 'MT' : 'MEDIUMTEXT',
			'LT' : 'LONGTEXT',
			'BIN' : 'BINARY', 'VBIN' : 'VARBINARY',
			'TB' : 'TINYBLOB',
			'BL' : 'BLOB', 'MB' : 'MEDIUMBLOB',
			'LB' : 'LONGBLOB',
			'D' : 'DATE', 'T' : 'TIME', 'Y' : 'YEAR',
			'DT' : 'DATETIME',
			'TS' : 'TIMESTAMP', 'PT' : 'POINT',
			'LS' : 'LINESTRING',
			'POLY' : 'POLYGON', 'GEO' : 'GEOMETRY', 'MP' : 'MULTIPOINT',
			'MLS' : 'MULTILINESTRING', 'MPOLY' : 'MULTIPOLYGON',
			'GEOCOL' : 'GEOMETRYCOLLECTION', 'E' : 'ENUM', 'S' : 'SET'
		};

		var keys = {
			'PK' : 'PRIMARY KEY',
			'FK' : 'FOREIGN KEY'
		};

		var options = {
			'AI' : 'AUTO_INCREMENT',
			'NN' : 'NOT NULL',
			'D' : 'DEFAULT',
			'CT' : 'CURRENT_TIMESTAMP'
		};


	var getLong = function(short){
	  var long;
	  if(datatypes[short]){
	    long = datatypes[short];
	  }else if(options[short]){
	    long = options[short];
	  }else if(keys[short]){
	    long = keys[short];
	  }
	  return long;
	};

	var shortRegex = /\b(TI|SI|MI|I|BI|B|F|DBL|DC|C|VC|TT|T|MT|LT|BIN|VBIN|TB|BL|MB|LB|D|Y|DT|TS|PT|LS|POLY|GEO|MP|MLS|MPOLY|GEOCOL|E|S|PK|FK|AI|NN|D|CT)\b/g;

	String.prototype.replaceArray = function(find, replace) {
	  var replaceString = this;
	  for (var i = 0; i < find.length; i++) {
	    replaceString = replaceString.replace(find[i], replace[i]);
	  }
	  return replaceString;
	}

	var expandString = function(regex, field){
		var shorts = [];
		var longs = [];
		var match;
		while ((match = regex.exec(field)) != null){
		    shorts.push(match[0]);
		    longs.push(getLong(match[0]));
		}
		shorts.push(":");
		longs.push(" ");

		return field.replaceArray(shorts, longs);
	};

	var createTbl = function(){
		var fields = [];
		var expanded_field = [];
		$('#' + current_table + " .tbl_fields .fields").each(function(){
			var field = $(this).attr("id");
			
			 expanded_field.push(expandString(shortRegex,field));
			 fields.push(expanded_field);
		});

		$.post(
			"invoker.php", 
			{"action" : "create_tbl", "table" : current_table, "fields" : expanded_field},
			function(response){
				console.log("Created Table");
			}
		);
	};

	var dropTbl = function(){
		$.post(
			"invoker.php", 
			{"action" : "drop_tbl", "table" : current_table},
			function(response){
				console.log(response);
			}
		);
	};

	var modifyTbl = function(){
		$.post(
			"invoker.php", 
			{
			"action" : "modify_tbl", "table" : current_table, 
			"fields" : fields, "options" : options
			},
			function(response){
				console.log(response);
			}
		);
	};

	key('e', function(){ 
		modifyTbl();
	
	});

	key('f', function(){ 
		createField();
	
	});

	key('t', function(){ 
		createTable();
	});

	key('s', function(){ 
		createTbl();
	});

	key('d', function(){ 
		dropTbl();
	});



	$("input").live('keyup', function(e){
		var isTable = $(this).is('.tbl_name');
    var isField = $(this).is('.field_name');

    if(e.keyCode == 13){
    	if(isField){
    		createField();	
    	}
    }


    var id = $(this).val();
    $(this).attr("id", "field_" +id);

   	if(isField){
   		$(this).parents('.fields').attr("id", id);
    }else if(isTable){
    	current_table = id;
    	$($(this).parents('div')[1]).attr("id", id);
    }
	});
</script>