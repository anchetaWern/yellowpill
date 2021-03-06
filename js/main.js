	var current_table;
	var current_field;
	var old_field;
	var old_table;

	var current = {
		'table' : '',
		'field' : ''
	};

	var old = {
		'field' : '',
		'table' : ''
	};

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
				"table" : current.table,
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
					
				}

				var field_to_move = expandString(shortRegex, $('#' + field_container + ' input').val());

				orderField(field_to_move, position, base_field);

			}
		});
		$(".tbl_fields").disableSelection();
		
	}

	var linkedTables = [];
	var linkedFields = [];
	var selectedTables = {};
	var selectedFields = {};

	makeSortable();

	$(".table").hover(function(){
		if(!$(this).is(".active_table")){
			$(this).addClass('hover_table');
			
		}
	}, function(){
		$(this).removeClass('hover_table');
	});

	var getSelectedTables = function(){
		var selectedTables = {};
	  $('.active_table').each(function(index, html){
	  	var table = $(html).attr('id');
	    selectedTables[table] = table;
	  });
	  return selectedTables;
	};

	$(".table").live('click', function(e){
		e.stopPropagation()
		var tbl_id = $(this).find('.tbl_name').val();
		current.table = tbl_id;


		$(this).removeClass('hover_table');
		var table_name = $(this).attr('id');

		if(e.ctrlKey === false){
			
			$(".table").removeClass('active_table');
			$(".fields").removeClass('active_field');

			linkedTables = [];
			linkedTables.push(table_name);
			selectedTables = {};
			selectedFields = {};
		}else{


			if($(this).is('.active_table')){
				$(this).removeClass('active_table');

			}else{
				$(this).addClass('active_table');
				if($('.active_table').length < 2){
					
					if(!linkedTables[table_name]){
						linkedTables.push(table_name);
						
					}
				}
			}
		}
		selectedTables = getSelectedTables();
	});

	var createField = function(){
		var field_container = $("<div>").addClass("fields drag_field");
		var field = $("<input>").attr({"type" : "text", "placeholder" : "field name"}).addClass("field_name");
		field_container.append(field);
		var table = $('#' + current.table + " .tbl_fields");
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
		$('#' + current.table + " .tbl_fields .fields").each(function(){
			var field = $(this).attr("id");
			
			 expanded_field.push(expandString(shortRegex, field));
			 
		});

		return expanded_field;
	};

	var createTable = function(){
		var expanded_field = expandFields();

		$.post(
			"invoker.php", 
			{"action" : "create_tbl", "table" : current.table, "fields" : expanded_field},
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
			{"action" : "drop_tbl", "table" : current.table},
			function(response){
				console.log(response);
				$('#' + current.table).remove();
				noty_success.text = "Successfully dropped table!";
				noty(noty_success);
			}
		);
	};

	var modifyTable = function(){

		if(isExisting('has_tbl') === 1){
			var field = expandString(shortRegex, current.field);
			
			if(isExisting('has_field')){
				updateTable('modify_field', current.table, old.field, field);
			}else{
				updateTable('add_field', current.table, old.field, field);
			}

		}
	};

	var updateTable = function(action, table, old_field, current_field){

		$.post(
			"invoker.php", 
			{
			"action" : action, "table" : table, 
			"old_field" : old_field, "new_field" : current_field
			},
			function(response){
				console.log(response);
				noty_success.text = "Successfully modified table!";
				noty(noty_success);
			}
		);
	};

	var createJoinFlag = function(table, linked_tables){
		var flagtext;
		if(linked_tables.length == 1){
			flagtext = "main";
		}else{
			flagtext = "child";
		}
		var flag = $("<div>").addClass("flag").text(flagtext);
		flag.insertAfter($('#' + table + ' .tbl_fields'));
		
	};

	var joinTables = function(){
		var linked_tables = getLinkedTables();
		var child_table = linked_tables[1];
		var main_table = linked_tables[0];
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
		
		old.field = $.trim(old.field);
		current.table = $.trim(current.table);
		console.log(old_field);

		var field_count = 0;
		$.ajax({
			type: "POST",
			url : "invoker.php",
			data : {"action" : action, "table" : current.table, "field" : old.field},
			async : false
		}).done(function(response){
			field_count = response;
		});

		return Number(field_count);
	};

	var getLinkedTables = function(){//gets the tables that are selected for linking by the current user
		var linkedTables = [];
		$('.connector:checked').parents('div.table').each(function(index, html){
			var table = $(html).attr('id');
			linkedTables.push(table);
		});
		return linkedTables;
	};

	$(".connector").live('click', function(){
		var table_name = $($(this).parents('div')[1]).attr("id");
		var connectedtable_count = $('.connector:checked').length;
		var linkedTables = getLinkedTables();

		if(connectedtable_count <= 2){
			createJoinFlag(table_name, linkedTables);
		}else{
			noty_err.text = "Only two tables can be linked at a time!";
			noty(noty_err);
		}
		
	});

	var updateQueryString = function(querystring){
		$("#query_string").val(querystring);
	};

	var getObjectLength = function(obj){
		var count = 0;
		for (i in obj) {
		    if (obj.hasOwnProperty(i)){
		        count++;
		    }
		}
		return count;
	};

	var getCurrentTable = function(){
		return current.table;
	};

	var selectQuery = function(){
		var query = "SELECT ";
		var number_of_tables = getObjectLength(selectedTables);
		var number_of_fields = getObjectLength(selectedFields);

		var table_index = 1;
		var field_index = 1;

		if(number_of_tables === 1){
			var tablefield_count = $('#' + current.table + ' .fields').children().length;
			var tableselectedfield_count = $('#' + current.table + ' .active_field').length;

			if(tablefield_count === tableselectedfield_count){
				query += "* FROM " + current.table;

			}else{
				for(var field in selectedFields){
					var tbl = field.split(".")[0];
					var fld = field.split(".")[1];

					query += fld;

					if(number_of_fields !== field_index){
						query += ", ";
					}
					field_index++;
				}
				
			}

			query += " FROM " + current.table;

		}else{
			for(var field in selectedFields){
				var tbl = field.split(".")[0];
				var fld = field.split(".")[1];

				if(getSimilarFieldsCount(tbl, fld) === 0){
					query += fld;
					
				}else{
					
					query += field + " AS " + tbl + "_" + fld;
				}	
				
				if(number_of_fields !== field_index){
					query += ", ";
				}
				field_index++;
			}

			query += " FROM ";
			for(var table in selectedTables){

				query += selectedTables[table];
					
				if(number_of_tables !==  table_index){
					query += ", ";
				}
				table_index++;
			}
		}


		updateWhereModal();
		updateQueryString(query);
		return query;
	};


	var changeQuery = function(query_type){
		var number_of_fields = getObjectLength(selectedFields);
		var field_index = 1;
		var query;

		if(query_type === "UPDATE"){
		  query = "UPDATE " + current.table + " SET ";
		}else if(query_type === "INSERT"){
		  query = "INSERT INTO " + current.table + " SET ";
		}
		
		for(var field in selectedFields){
			query +=  field.split(".")[1] + " = " + "'$" + field.split(".")[1] + "'";

			if(number_of_fields !== field_index){
				query += ", ";
			}

			field_index++;
		}

		updateWhereModal();
		updateQueryString(query);
		return query;
	};

	var deleteQuery = function(){
		var query = "DELETE FROM " . current.table;

		updateWhereModal();
		updateQueryString(query);
		return query;
	};

	var updateWhereModal = function(){
		$(".selected_fields, .field_values, .custom_values").empty();

		var fields_container = $(".selected_fields");
		var field_values = $(".field_values");
		var custom_values = $(".custom_values");

		var selectfield_header = $("<h6>").text("Selected Fields");
		var fieldvalue_header = $("<h6>").text("Field Values");
		var customvalue_header = $("<h6>").text("Custom Values");

		var select_field1 = $("<select>").addClass("select_field1");
		var select_field2 = $("<select>").addClass("select_field2");

		selectfield_header.appendTo(fields_container);
		fieldvalue_header.appendTo(field_values);
		customvalue_header.appendTo(custom_values);

		for(field in selectedFields){	
			var field_option1 = $("<option>").attr("value", field).text(field);
			var field_option2 = $("<option>").attr("value", field).text(field);
		
			select_field1.append(field_option1);
			select_field2.append(field_option2);
			
		}

		var custom_value = $("<input>").attr({"type" : "text", "class" : "custom_value"});
		custom_values.append(custom_value);

		fields_container.append(select_field1);
		field_values.append(select_field2);
	};

	var getSimilarFieldsCount = function(tablename, fieldname){
		var similar_fields = [];
		for(table in selectedTables){
			$('#' + table + ' .fields').each(function(index, html){
				var field = $(html).attr('id');
				if(fieldname === field && tablename !== table){
					similar_fields.push(field);
				}
			});
		}
		return similar_fields.length;
	};	

	var selectAllFields = function(){
		$("#" + current.table + " .fields").addClass("active_field");
		selectedFields = getSelectedFields();
	};



	key('a', function(){
		selectAllFields();
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

	var dropField = function(table, fields){
		$.post("invoker.php", 
			{"action" : "drop_field", "table" : table, "fields" : fields},
			function(response){
				console.log(response);
				$('#' + fields).remove();
			}
		);
	};

	key('del', function(){ 
		dropField(current.table, old_field);
	});

	$(".fields").hover(function(){
		if(!$(this).is(".active_field")){
			$(this).addClass('hover_field');
			
		}
	}, function(){
		
			$(this).removeClass('hover_field');

	});

	var getSelectedFields = function(){
		var selectedFields = {};
    $('.active_field').each(function(index, html){

			var table = $($(html).parents('div')[1]).attr('id');
			var field = $(html).attr('id');

	    if(!selectedFields[table + "." + field]){
				selectedFields[table + "." + field] = table + "." + field;
			}

    });

    return selectedFields;
	};

	var isLinkedTable = function(field){
		return $($('#' + field).parents('div')[0]).siblings().children('input[type=checkbox]').is(':checked');
	};

	$(".fields").live('click', function(e){
		e.stopPropagation();
		
		$(this).removeClass('hover_field');
		var field_name = $(this).attr('id');
		var table_name = $(this).parents('div')[1].id;
		current.field = field_name;

		var field = $(this).find("input").val();
		var field_data = field.split(":");
		old_field = field_data[0];

		if(e.ctrlKey === false){
			$(this).addClass('active_field');
			$(".fields").removeClass('active_field');

			if(isLinkedTable(field_name)){
				linkedFields = [];
				linkedFields.push(field_name);
			} 



			selectedFields = {};
		}else{

			if($(this).is('.active_field')){

				$(this).removeClass('active_field');
	
			}else{
				current.table = table_name;
				$('#' + table_name).addClass('active_table');

				$(this).addClass('active_field');
				if($('.active_field').length < 2){
					
					if(!linkedFields[field_name]){
						linkedFields.push(field_name);
						
					}
				}
			}
		}

		selectedFields = getSelectedFields();
	});

		var hasLinkedField = function(){
			return $('#' + field_name).siblings('.active_field').length;
		};

		var addLinkedField = function(field_name){
			if(hasLinkedField(field_name) === 0){
				linkedFields.push(field_name);
			}
		};

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
   		$(this).parents('.fields').attr("id", id.split(":")[0]);

    }else if(isTable){
    	current.table = id;
    	$($(this).parents('div')[1]).attr("id", id);
    	
    }
	});

	$(".field_name").live('click', function(){
		var field = $(this).val();
		var field_data = field.split(":");
		old.field = field_data[0];
	});

	$(".field_name").live('blur', function(){
		if($(this).val() !== ""){

			current.field = $(this).val();
			modifyTable();
		}
	});

	$(".tbl_name").live('click', function(){
		old.table = $.trim($(this).val());
	});

	$(".tbl_name").live('blur', function(){
		var new_table = $.trim($(this).val());
		$.post("invoker.php", 
			{"action" : "rename_tbl", "current.table" : old.table, "new_table" : new_table}, 
			function(response){
				console.log(response);
			}
		);
	});

	$("#add_where").live('click', function(){
		var query = $.trim($("#query_string").val());
		var where = $.trim($('.select_field1').val());
		var value;
	
		var where_regex = /where/ig

		if(!where_regex.test(query)){
			query += " WHERE ";
		}else{
			query += " AND ";
		}

		var table_count = getObjectLength(selectedTables);
		if(table_count === 1){
			where = where.split(".")[1];

			if($.trim($('.custom_value').val()) === ""){
				value = $.trim($('.select_field2').val()).split(".")[1];
			}else{
				value = "'"+ $.trim($('.custom_value').val()) +"'";
			}
		}else{
			if($.trim($('.custom_value').val()) === ""){
				value = $.trim($('.select_field2').val());
			}else{
				value = "'"+ $.trim($('.custom_value').val()) +"'";	
			}
		}

		query += where + " = " + value;
		$("#query_string").val(query);
		$(".custom_value").val("");
	});



	$(".query_options div").hover(function(){
		$(this).addClass('hover_option');
	}, function(){
		$(this).removeClass('hover_option');
	});

	var changeQueryType = function(query_type){
		$('.query_options div').removeClass('active_option');
		$('div[data-qoption='+query_type+']').addClass('active_option');
	};

	key('alt+s', function(){
		changeQueryType("select");
		selectQuery();
	});

	key('alt+u', function(){
		if(getObjectLength(selectedTables) === 1){
			changeQueryType("update");
			changeQuery("UPDATE");
		}else{
			noty_err.text = "You can only create an update query one table at a time";
			noty(noty_err);
		}

	});

	key('alt+d', function(){
		if(getObjectLength(selectedTables) === 1){
			changeQueryType("delete");
			deleteQuery();
		}else{
			noty_err.text = "You can only create a delete query one table at a time";
			noty(noty_err);
		}
	});	

	key('alt+i', function(){
		if(getObjectLength(selectedTables) === 1){
			changeQueryType("insert");
			changeQuery("INSERT");
		}else{
			noty_err.text = "You can only create a insert query one table at a time";
			noty(noty_err);
		}
	});	

	key('alt+w', function(){
		$('#where_modal').reveal();
	});

	var detached_field; //change later dude
	key('ctrl+x', function(){
		detached_field = $('#' + current.field).detach();

	});

	key('ctrl+v', function(){
		var table = $('#' + current.table);
		detached_field.appendTo(table);
		var detached_field_value = detached_field.find('input').val();
		old_field = detached_field.attr("id");

		current.field = expandString(shortRegex, detached_field_value);
		//updateTable('add_field');
		dropField();
	});
