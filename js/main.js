	var current_table;
	var current_field;
	var old_field;
	var old_table;

	var noty_success = {
		"text":"Operation was successfully completed!",
		"layout":"top",
		"type":"success",
		"textAlign":"center",
		"easing":"swing",
		"animateOpen":{"height":"toggle"},
		"animateClose":{"height":"toggle"},
		"speed":500,
		"timeout":5000,
		"closable":true,
		"closeOnSelfClick":true
	};
	
	var noty_err = {
		"text":"An error occured, please try again",
		"layout":"top",
		"type":"error",
		"textAlign":"center",
		"easing":"swing",
		"animateOpen":{"height":"toggle"},
		"animateClose":{"height":"toggle"},
		"speed":500,
		"timeout":5000,
		"closable":true,
		"closeOnSelfClick":true
	};

	var makeDraggable = function(){
		$(".drag_field, .drag_tbl").draggable(); 
		

		$(".table").droppable({
			drop: function(event, ui){
				
				var field_id = ui.draggable[0].id;
				var current_container = $(this);
				var tbl_fields = current_container.children('.tbl_fields');
				var field = $('#' + field_id).detach().css({top: 0, left: 0}).appendTo(tbl_fields);
				
				
			}
		});
	};

	var orderField = function(field_to_move, position, base_field){
		$.post("invoker.php", 
			{
				"action" : "order_field", 
				"table" : current_table,
				"field" : field_to_move, 
				"position" : position, 
				"base_field" : base_field
			},
			function(response){
				console.log(response);
			}
		);
	};

	var makeSortable = function(){
		$(".tbl_fields").sortable({
			update: function(event, ui){
				var field_container = ui.item[0].id;
				var base_field;
				var position;

				

				if($("#" + field_container).prev().length){
					position = "AFTER";
					base_field = $("#" + field_container).prev().attr("id");
				}else{
					position = "FIRST";
					base_field = $('#' + current_table + " .tbl_fields" + ":nth-last-child(2)").attr("id");
				}

				var field_to_move = expandString(shortRegex, $('#' + field_container + ' input').val());

				orderField(field_to_move, position, base_field);



			}
		});
		$(".tbl_fields").disableSelection();
		
	}

	var linkedTables = [];
	var linkedFields = [];

	
	makeSortable();



	$(".table").live('click', function(){
		var tbl_id = $(this).find('.tbl_name').val();
		current_table = tbl_id;

		$(".table").removeClass('active_table');

		if($(this).is('.active_table')){

			$(this).removeClass('active_table');
		}else{
			$(this).addClass('active_table');
		}
	});

	var createField = function(){
		var field_container = $("<div>").addClass("fields drag_field");
		var field = $("<input>").attr({"type" : "text", "placeholder" : "field name"}).addClass("field_name");
		field_container.append(field);
		var table = $('#' + current_table + " .tbl_fields");
		table.append(field_container);
		field.focus();
		field.click();
		makeDraggable();
	};

	var generateTable = function(){
		var table = $("<div>").addClass("table drag_tbl");
		var tbl_header = $("<div>").addClass("tbl_header");
		var tbl_name = $("<input>").attr({"type" : "text", "placeholder" : "table name"}).addClass("tbl_name");
		var tbl_connector = $("<input>").attr({"type" : "checkbox", "class" : "connector"});
		var tbl_field = $("<div>").addClass("tbl_fields");
		var field_container = $("<div>").addClass("fields drag_field");
		var field = $("<input>").attr({"type" : "text", "placeholder" : "field name"}).addClass("field_name");

		tbl_header.append(tbl_name);
		tbl_header.append(tbl_connector);
		table.append(tbl_header);
		field_container.append(field);
		tbl_field.append(field_container);
		table.append(tbl_field);
		$('.existing_tables').append(table);

		makeDraggable();
	};

	var datatypes = {
			'TXT' : 'TEXT',
			'TI' : 'TINYINT', 
			'SI' : 'SMALLINT',
			'MI' : 'MEDIUMINT',
			'I' : 'INT', 
			'BI' : 'BINGINT', 
			'B' : 'BIT', 
			'F' : 'FLOAT', 
			'DBL' : 'DOUBLE',
			'DC' : 'DECIMAL', 
			'C' : 'CHAR', 
			'VC' : 'VARCHAR',
			'TT' : 'TINYTEXT',
			'MT' : 'MEDIUMTEXT',
			'LT' : 'LONGTEXT',
			'BIN' : 'BINARY', 
			'VBIN' : 'VARBINARY',
			'TB' : 'TINYBLOB',
			'BL' : 'BLOB', 
			'MB' : 'MEDIUMBLOB',
			'LB' : 'LONGBLOB',
			'D' : 'DATE', 
			'T' : 'TIME', 
			'Y' : 'YEAR',
			'DT' : 'DATETIME',
			'TS' : 'TIMESTAMP', 
			'PT' : 'POINT',
			'LS' : 'LINESTRING',
			'POLY' : 'POLYGON', 
			'GEO' : 'GEOMETRY', 
			'MP' : 'MULTIPOINT',
			'MLS' : 'MULTILINESTRING', 
			'MPOLY' : 'MULTIPOLYGON',
			'GEOCOL' : 'GEOMETRYCOLLECTION', 
			'E' : 'ENUM', 
			'S' : 'SET'
		};

		var keys = {
			'PK' : 'PRIMARY KEY',
			'FK' : 'FOREIGN KEY'
		};

		var options = {
			'AI' : 'AUTO_INCREMENT',
			'NN' : 'NOT NULL',
			'DEF' : 'DEFAULT',
			'CT' : 'CURRENT_TIMESTAMP',
			'XX' : 'NULL'
		};


	var invert = function (obj) {
	  var new_obj = {};

	  for (var prop in obj) {
	    if(obj.hasOwnProperty(prop)) {
	      new_obj[obj[prop]] = prop;
	    }
	  }

	  return new_obj;
	};

	var inverted_datatypes = invert(datatypes);
	var inverted_keys = {
		'PRI' : 'PK'
	};

	var inverted_options = {
		'auto_increment' : 'AI',
		'YES' : 'XX',
		'NO' : 'NN',
		'CURRENT_TIMESTAMP' : 'CT',
		"id=" : " "
	};

	var getShort = function(long){
	  var short;
	  if(inverted_datatypes[long]){
	    short = inverted_datatypes[long];
	  }else if(inverted_options[long]){
	    short = inverted_options[long];
	  }else if(inverted_keys[long]){
	    short = inverted_keys[long];
	  }
	  return short;
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

	var shortRegex = /\b(TI|SI|MI|I|BI|B|F|DBL|DC|C|VC|TT|T|MT|LT|BIN|VBIN|TB|BL|MB|LB|D|Y|DT|TS|PT|LS|POLY|GEO|MP|MLS|MPOLY|GEOCOL|E|S|PK|FK|AI|NN|DEF|CT|TXT|XX)\b/g;

	var longRegex = /\b(auto_increment)|(id=)|(TINYINT|SMALLINT|MEDIUMINT|INT|BINGINT|BIT|FLOAT|DOUBLE|DECIMAL|CHAR|VARCHAR|TINYTEXT|TEXT|MEDIUMTEXT|LONGTEXT|BINARY|VARBINARY|TINYBLOB|BLOB|MEDIUMBLOB|LONGBLOB|DATE|TIME|YEAR|DATETIME|TIMESTAMP|POINT|LINESTRING|POLYGON|GEOMETRY|MULTIPOINT|MULTILINESTRING|MULTIPOLYGON|GEOMETRYCOLLECTION|ENUM|SET|NOT NULL|DEFAULT|CURRENT_TIMESTAMP|FOREIGN KEY|YES|NO|PRI|CURRENT_TIMESTAMP)\b/g;

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

		return field.replaceArray(shorts, longs);
	};

	var shortenString = function(regex, field){
		var shorts = [];
		var longs = [];
		var match;
		while ((match = regex.exec(field)) != null){
		    longs.push(match[0]);
		    shorts.push(getShort(match[0]));
		}

		return field.replaceArray(longs, shorts);
	};



	var shortenFields = function(){
		var shortened_field = [];
		$('.tbl_fields input[type!=""]').each(function(){
			var field = $(this).val();
			
			shortened_field.push(shortenString(longRegex, field));
			$(this).val(shortenString(longRegex, field));
		});

		$(".existing_tables").show();
	};

	shortenFields();


	var expandFields = function(){
		var expanded_field = [];
		$('#' + current_table + " .tbl_fields .fields").each(function(){
			var field = $(this).attr("id");
			
			 expanded_field.push(expandString(shortRegex, field));
			 
		});

		return expanded_field;
	};

	var createTable = function(){
		var expanded_field = expandFields();

		$.post(
			"invoker.php", 
			{"action" : "create_tbl", "table" : current_table, "fields" : expanded_field},
			function(response){
				console.log(response);
				console.log("Created Table");
				noty_success.text = "Successfully created table!";
				noty(noty_success);
			}
		);
	};

	var dropTable = function(){
		$.post(
			"invoker.php", 
			{"action" : "drop_tbl", "table" : current_table},
			function(response){
				console.log(response);
				$('#' + current_table).remove();
				noty_success.text = "Successfully dropped table!";
				noty(noty_success);
			}
		);
	};

	var modifyTable = function(){

		if(isExisting('has_tbl') === 1){
			current_field = expandString(shortRegex, current_field);
			
			if(isExisting('has_field')){
				updateTable('modify_field');
			}else{
				updateTable('add_field');
			}

		}
	};



	var updateTable = function(action){

		$.post(
			"invoker.php", 
			{
			"action" : action, "table" : current_table, 
			"old_field" : old_field, "new_field" : current_field
			},
			function(response){
				console.log(response);
				noty_success.text = "Successfully modified table!";
				noty(noty_success);
			}
		);
	};

	var createJoinFlag = function(table_name){
		var flagtext;
		if(linkedTables.length == 1){
			flagtext = "main";
		}else{
			flagtext = "child";
		}
		var flag = $("<div>").addClass("flag").text(flagtext);
		flag.insertAfter($('#' + table_name + ' .tbl_fields'));
		
	};

	var joinTables = function(){
		var child_table = linkedTables[1];
		var main_table = linkedTables[0];
		var child_field = linkedFields[1];
		var main_field = linkedFields[0];
		$.post(
			"invoker.php", 
			{
			"action" : "join_tbl",
			"child_table" : child_table, "main_table" : main_table, 
			"child_field" : child_field, "main_field" : main_field
			},
			function(response){
				console.log(response);
				removeConnection();

			}
		);
	};

	var removeConnection = function(){
		$('.flag').remove();
		$('.fields').removeClass('active_field');
	};

	var isExisting = function(action){
		
		old_field = $.trim(old_field);
		current_table = $.trim(current_table);
		console.log(old_field);

		var field_count = 0;
		$.ajax({
			type: "POST",
			url : "invoker.php",
			data : {"action" : action, "table" : current_table, "field" : old_field},
			async : false
		}).done(function(response){
			field_count = response;
		});

		return Number(field_count);
	};



	$(".connector").live('click', function(){
		var table_name = $($(this).parents('div')[1]).attr("id");

		if($(this).is(":checked")){
			if(linkedTables.length != 2){
				if(!linkedTables[table_name]){
					linkedTables.push(table_name);
					createJoinFlag(table_name);
				}
				
			}else{
				noty_err.text = "Only two tables can be linked at a time!";
				noty(noty_err);
			}
		}
		
	});


	key('f', function(){ 
		createField();
	});

	key('t', function(){ //generate table
		generateTable();
	});

	key('s', function(){ //create table
		createTable();
	});

	key('d', function(){ //drop table
		dropTable();
	});

	key('j', function(){ //join tables
		joinTables();
	});

	key('w', function(){
		makeDraggable();
	});

	key('e', function(){
		makeSortable();
	});

	var dropField = function(){
		$.post("invoker.php", 
			{"action" : "drop_field", "table" : current_table, "fields" : old_field},
			function(response){
				console.log(response);
				$('#' + old_field).remove();
			}
		);
	};

	key('del', function(){ 
		dropField();
	});


	$(".fields").live('click', function(){
		
		var field_name = $(this).find('input').attr('id');

		var field = $(this).find("input").val();
		var field_data = field.split(":");
		old_field = field_data[0];

		if($(this).is('.active_field')){

			$(this).removeClass('active_field');
		}else{
			if(linkedFields.length != 2){
				if(!linkedFields[field_name]){
					linkedFields.push(field_name);
					
				}
				
			}else{
				noty_err.text = "Only two fields can be linked at a time!";
				noty(noty_err);
			}

			$(this).addClass('active_field');
		}
	});

	$(".existing_tables input").live('keyup', function(e){
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

	$(".field_name").live('click', function(){
		var field = $(this).val();
		var field_data = field.split(":");
		old_field = field_data[0];
	});

	$(".field_name").live('blur', function(){
		if($(this).val() !== ""){

			current_field = $(this).val();
			modifyTable();
		}
	});

	$(".tbl_name").live('click', function(){
		old_table = $.trim($(this).val());
	});

	$(".tbl_name").live('blur', function(){
		var new_table = $.trim($(this).val());
		$.post("invoker.php", 
			{"action" : "rename_tbl", "current_table" : old_table, "new_table" : new_table}, 
			function(response){
				console.log(response);
			}
		);
	});