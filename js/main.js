	var current = {
		'field' : '',
		'table' : ''
	};

	var old = {
		'field' : '',
		'table' : ''
	};

	var selectedTables = {};
	var selectedFields = {};

	var detachedFields = [];
	var detachedFieldTable;

	var db = {tables : []};

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


	var makeSortable = function(){
		$(".tbl_fields").sortable({
			update: function(event, ui){
				var field_container = ui.item[0].id;
				$(ui.item).css("z-index", 2);
				var table = $(ui.item).parents("div")[1].id;
				var base_field;
				var position;

				if($("#" + table + " #" + field_container).prev().length){
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
				if(response == 1){
					successMessage("Fields successfully reordered");
				}else{
					errorMessage("Something went wrong while trying to reorder the fields");
				}
			}
		);
	};

	$(".fields").live({
		mouseenter: 
			function(){
				if(!$(this).is(".active_field")){
					$(this).addClass('hover_field');
					
				}
			},
		mouseleave:
			function(){
				$(this).removeClass('hover_field');
			}	
	});

	$(".table").live({
		mouseenter:
			function(){
				if(!$(this).is(".active_table")){
					$(this).addClass('hover_table');
					
				}
			},
		mouseleave:
			function(){
				$(this).removeClass('hover_table');
			}	
	});

	var getSelectedTables = function(){
		var selectedTables = {};
	  $('.active_table').each(function(){
	  	var table = $(this).attr('id');
	    selectedTables[table] = table;
	  });
	  return selectedTables;
	};

	var getSelectedFields = function(){
		var selectedFields = {};
		$('.active_field').each(function(){
			var table = $($(this).parents('div')[1]).attr('id');
			var field = $(this).attr('id');
			selectedFields[table + "." + field] = table + "." + field;
		});
		return selectedFields;
	};

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
		var table = $("<div>").addClass("table drag_tbl active_table");
		var tbl_header = $("<div>").addClass("tbl_header");
		var tbl_name = $("<input>").attr({"type" : "text", "placeholder" : "table name"}).addClass("tbl_name");
		var tbl_field = $("<div>").addClass("tbl_fields");
		var field_container = $("<div>").addClass("fields drag_field");
		var field = $("<input>").attr({"type" : "text", "placeholder" : "field name"}).addClass("field_name");

		tbl_header.append(tbl_name);
		table.append(tbl_header);
		field_container.append(field);
		tbl_field.append(field_container);
		table.append(tbl_field);
		$('.existing_tables').append(table);
		tbl_name.focus();
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
		'PRI' : 'PK',
		'MUL' : 'FK'
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

	var longRegex = /\b(auto_increment)|(id=)|(TINYINT|SMALLINT|MEDIUMINT|INT|BINGINT|BIT|FLOAT|DOUBLE|DECIMAL|CHAR|VARCHAR|TINYTEXT|TEXT|MEDIUMTEXT|LONGTEXT|BINARY|VARBINARY|TINYBLOB|BLOB|MEDIUMBLOB|LONGBLOB|DATE|TIME|YEAR|DATETIME|TIMESTAMP|POINT|LINESTRING|POLYGON|GEOMETRY|MULTIPOINT|MULTILINESTRING|MULTIPOLYGON|GEOMETRYCOLLECTION|ENUM|SET|NOT NULL|DEFAULT|CURRENT_TIMESTAMP|FOREIGN KEY|YES|NO|PRI|MUL|CURRENT_TIMESTAMP)\b/g;

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

	


	var expandFields = function(){
		var expanded_field = [];
		$('#' + current.table + " .tbl_fields .fields .field_name").each(function(){
			var field = $.trim($(this).val());
			
			 expanded_field.push(expandString(shortRegex, field));
			 
		});

		return expanded_field;
	};

	var createTable = function(currentTable){
		var expanded_field = expandFields();

		$.post(
			"invoker.php", 
			{"action" : "create_tbl", "table" : currentTable, "fields" : expanded_field},
			function(response){
				if(response == 1){
					successMessage("Successfully created table!")
				}else{
					errorMessage("Something went wrong while creating the table");
				}
			}
		);
	};

	var dropTable = function(currentTable){
		$.post(
			"invoker.php", 
			{"action" : "drop_tbl", "table" : currentTable},
			function(response){
				if(response == 1){
					$('#' + currentTable).remove();
					successMessage("Successfully dropped table!");
				}else{
					errorMessage("The table cannot be dropped, please check if it has connection with the others");
				}
			}
		);
	};

	var modifyTable = function(currentTable, oldField, newField){

		if(isExisting('has_tbl', currentTable, oldField) === 1){
			var field = expandString(shortRegex, newField);

			if(isExisting('has_field', currentTable, oldField)){
				updateTable('modify_field', currentTable, oldField, field);
			}else{
				updateTable('add_field', currentTable, oldField, field);
			}

		}
	};

	var updateTable = function(action, table, oldField, currentField){

		$.post(
			"invoker.php", 
			{
			"action" : action, "table" : table, 
			"old_field" : oldField, "new_field" : currentField
			},
			function(response){
				
				if(response == 1){
					if(action == "add_field"){
						successMessage("Successfully added field");
					}else if(action == "modify_field"){
						successMessage("Successfully modified table!");
					}
				}else{
					errorMessage("Something went wrong while trying to update the table");
				}
			}
		);
	};

	var createJoinFlag = function(table, linked_tables){
		var flagtext;
		var fieldCount = $("#" + table + " .active_field").length;
		var activeTable = $("#" + table).is(".active_table");
		console.log("is active: " + activeTable);
		
		if(getObjectLength(selectedTables) <= 2 && fieldCount <= 1 && activeTable === false){
			if(linked_tables.length === 1){
				flagtext = "main";
			}else{
				flagtext = "child";
			}
			var flag = $("<div>").addClass("flag").text(flagtext);
			flag.insertAfter($('#' + table + ' .tbl_fields'));
		}
	};

	var removeJoinFlag = function(table, all){
		if(all){ 
			$(".flag").remove();
		}else{
			$("#" + table + " .flag").remove();
		}
	};

	var joinTables = function(mainTable, childTable, mainField, childField){

		$.post(
			"invoker.php", 
			{
			"action" : "join_tbl",
			"child_table" : childTable, "main_table" : mainTable, 
			"child_field" : childField, "main_field" : mainField
			},
			function(response){
				console.log(response);
				if(response == 1){
					successMessage("Successfully added foreign key to child field");
				}else{
					errorMessage("Cannot add foreign key on child field, data types might be incompatible");
				}
				removeConnection();

			}
		);
	};

	var removeConnection = function(){
		$('.flag').remove();
		$('.fields').removeClass('active_field');
	};

	var isExisting = function(action, currentTable, oldField){

		var field_count = 0;
		$.ajax({
			type: "POST",
			url : "invoker.php",
			data : {"action" : action, "table" : currentTable, "field" : oldField},
			async : false
		}).done(function(response){
			field_count = response;
		});

		return Number(field_count);
	};

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

	var getCurrentTable = function(){ //returns the current table
		return current.table;
	};

	var selectQuery = function(selectedTables, selectedFields, currentTable, joinType, mainTable){ //generates an sql select query
		var query = "SELECT ";
		var number_of_tables = getObjectLength(selectedTables);
		var number_of_fields = getObjectLength(selectedFields);

		var table_index = 1;
		var field_index = 1;

		if(number_of_tables === 1){
			var tablefield_count = $('#' + currentTable + ' .fields').children().length;
			var tableselectedfield_count = $('#' + currentTable + ' .active_field').length;

			if(tablefield_count === tableselectedfield_count){
				query += "* ";

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

			query += " FROM " + currentTable;

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

			switch(joinType){
				case "where_join":
					for(var table in selectedTables){

						query += selectedTables[table];
							
						if(number_of_tables !==  table_index){
							query += ", ";
						}
						table_index++;
					}
				break;

				case "inner_join": case "left_join": case "right_join":
					query += mainTable + "\n";
					query += getJoinQuery();
				break;
			}

		}

		updateQueryString(query);
		return query;
	};

	var getJoinQuery = function(){
		var joinQuery = '';
		var tables = db.tables;
		
		for(var x in tables){
		  var row = tables[x];
		  
		  var join_type = row['join_type'].replace("_", " ").toUpperCase();
		  var main_tbl = row['main_table'];
		  var main_fld = row['main_field'];
		  var child_tbl = row['child_table'];
		  var child_fld = row['child_field'];

		  joinQuery += join_type + " " + child_tbl + " ON " + main_tbl + "." + main_fld + " = " + child_tbl + "." + child_fld + "\n";

		}
		return joinQuery;
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


	var updateQuery = function(query_type, currentTable, selectedFields){ 
		var number_of_fields = getObjectLength(selectedFields);
		var field_index = 1;
		var query;

		if(query_type === "update"){
		  query = "UPDATE " + currentTable + " SET ";
		}else if(query_type === "insert"){
		  query = "INSERT INTO " + currentTable + " SET ";
		}
		
		for(var field in selectedFields){
			query +=  field.split(".")[1] + " = " + "'$" + field.split(".")[1] + "'";

			if(number_of_fields !== field_index){
				query += ", ";
			}

			field_index++;
		}

		updateQueryString(query);
		return query;
	};

	var deleteQuery = function(currentTable, selectedFields){
		var query = "DELETE FROM " + currentTable;

		updateQueryString(query);
		return query;
	};

	var updateWhereModal = function(selectedFields){
		$(".selected_fields, .field_values, .custom_values").empty();

		var fields_container = $(".selected_fields");
		var field_values = $(".field_values");
		var custom_values = $(".custom_values");

		var selectfield_header = $("<label>").text("Selected Fields");
		var fieldvalue_header = $("<label>").text("Field Values");
		var customvalue_header = $("<label>").text("Custom Values");

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

	$("#add_where").live('click', function(){
		var query = $.trim($("#query_string").val());
		var where = $.trim($('.select_field1').val());
		var value;

		var where_regex = /where/ig

		if(!where_regex.test(query)){
			query += "\nWHERE ";
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
		$("#where_modal").trigger('reveal:close');
	});

	var addJoinTable = function(table){
		if(linkedTables.length <= 1 && linkedTables.indexOf(table) === -1){
			linkedTables.push(table);
		}
	};

	var resetList = function(table){
		linkedTables = [];
		selectedTables = {};
		addJoinTable(table);
		removeJoinFlag(table, 1);

		selectedFields = {};
		linkedFields = [];
	};

	//event handler for clicking on table
	/*
	Clicking on the table without pressing ctrl will select the table
	but it will deselect all the previously selected tables and the fields of that table

	if ctrl is pressed while clicking on the table the selected table will be added to the
	selected tables it also adds to the linked tables if 0 or 1 tables is already selected
	 */
	$(".table").live("click", function(e){
		var table = $(this).attr("id");
		$(this).removeClass("hover_table");

		if($(this).is(".active_table")){
				
			$(this).removeClass("active_table");
			var selectedFields = getSelectedFields();
			deselectFields(table, 1);

			selectedTables = {};
			selectedFields = {};

		}else{
			current.table = table;
			current.field = "";
			if(e.ctrlKey){

				$(this).addClass("active_table");

			}else{
				$(".table").removeClass("active_table");
				$(this).addClass("active_table");
				deselectFields(table, 2);
				
				selectedTables = {};
				selectedFields = {};
			}

		}
		selectedTables = getSelectedTables();
		selectedFields = getSelectedFields();
		console.log(selectedFields);
		updateTableList(selectedTables);
	});

	var getTableFields = function(table, type){ //gets the active fields of a specific table
		var fields = [];
		if(type === 1){ //supply the array with active fields only
			$('#' + table + ' .active_field').each(function(){
				 fields.push($(this).attr('id'));
			});
		}else{ //supply the array with all the fields
			$('#' + table + ' .fields').each(function(){
				 fields.push($(this).attr('id'));
			});
		}
		return fields;
	}

	var deselectFields = function(table, type){
		if(type === 1){
			$("#" + table + " .active_field").removeClass("active_field");

		}else{
			$(".active_field").removeClass("active_field"); //deselect all selected fields

		}
	};

	var reselectFields = function(table, activeFields, type){
		if(type === 1){
			$.each(activeFields, function(index, val){
			  var fullField = val.split(".");
			  var table = fullField[0];
			  var field = fullField[1];
			  $("#" + table + " #" + field).addClass("active_field");
			});
		}else{
			$.each(activeFields, function(index, field){ 
				$("#" + table + " #" + field).addClass("active_field"); //reselect the fields of the current table
			});
		}
	};

	//event handler for clicking on fields
	/*
	selecting a field automatically selects the table
	 */
	$(".fields").live("click", function(e){
		e.stopPropagation();
		$(this).removeClass("hover_field");
		$(this).css("z-index", 5);
		var table = $($(this).parents("div")[1]).attr("id");
		var field = $(this).attr("id");
		$("#" + table).removeClass("hover_table");

		if($(this).is(".active_field")){
			$(this).removeClass("active_field");

			var activeFields = getTableFields(table, 1);
			deselectFields(table, 1);
			reselectFields(table, activeFields);

			selectedTables = {};
			selectedFields = {};
		
		}else{
			current.table = table;
			current.field = table + "." + field;
			if(e.ctrlKey){

				$("#" + table).addClass("active_table");
				$(this).addClass("active_field");
			}else{
				$(".table").removeClass("active_table");
				$("#" + table).addClass("active_table");

				var activeFields = getTableFields(table, 1);
				deselectFields(table, 1);
				reselectFields(table, activeFields);

				selectedTables = {};
				selectedFields = {};

				$(".active_field").removeClass("active_field");
				$(this).addClass("active_field");
			}
		}

		selectedTables = getSelectedTables();
		selectedFields = getSelectedFields();
		updateTableList(selectedTables);
	});

	var generateLinkTables = function(leftTable, rightTable, mainTable, leftSelect, rightSelect, mainSelect, selectPrefix, modalID, option){
		var table1 = $("." + leftTable);
		var table2 = $("." + rightTable);
		var table3 = $("." + mainTable);

		var mainHeader = $("<label>").text("Main table");
		var select1 = $("<select>").attr({"name" : leftSelect});
		var select2 = $("<select>").attr({"name" : rightSelect});
		var select3 = $("<select>").attr({"name" : mainSelect, "id" : mainSelect});

		table1.empty();
		table2.empty();
		table3.empty();

		$(".active_table").each(function(index, val){
			var table = $(this).attr("id");
			var fields = getTableFields(table);
			var fieldCount = fields.length;

			var header = $("<label>").text(table);
			var tableOption = $("<option>").attr({"value" : table}).text(table);
			select3.append(tableOption);

			if(index === 0){
				select1.attr("id", selectPrefix + table);
				table1.append(header);
				for(var x = 0; x < fieldCount; x++){
					var fieldName = fields[x];
					var option = $("<option>").attr({"value" : fieldName}).text(fieldName);
					select1.append(option);
				}
				

			}else{
				select2.attr("id", selectPrefix + table);
				table2.append(header);
				for(var x = 0; x < fieldCount; x++){
					var fieldName = fields[x];
					var option = $("<option>").attr({"value" : fieldName}).text(fieldName);
					select2.append(option);
				}
				
			}
		});

		if(option === 1){
			table3.append(mainHeader);
			table3.append(select3);
		}

		table1.append(select1);
		table2.append(select2);

		
		$("#" + modalID).reveal();
	};

	key("j", function(){

		var activetable_count = $(".active_table").length;
	
		if(activetable_count === 2){
			generateLinkTables("table1", "table2", "table3", "select1", "select2", "select3", "join_", "link_modal", 1);

		}else{
			errorMessage("Select only two tables before trying to join");
		}
	});

	var getChildTable = function(mainTable){
		var childTable;
		$("select[name=select3] option").each(function(){
		 var table = $(this).val();
		 if(table !== mainTable){
		   childTable = table;
		 }
		});
		return childTable;
	};

	$("#add_link").live("click", function(){
		var key_count = getKeyCount();
		if(key_count > 0){
			var mainTable = $("#select3").val();
			var childTable = getChildTable(mainTable);
			var mainField = $('#join_' + mainTable).val();
			var childField = $('#join_' + childTable).val();

			joinTables(mainTable, childTable, mainField, childField);
			$("#link_modal").trigger('reveal:close');
		}else{
			errorMessage("There should be at least one key field");
		}
	});

	key("t", function(){
		$(".active_table").removeClass("active_table");
		$(".active_field").removeClass("active_field");
		selectedTables = getSelectedTables();
		selectedFields = getSelectedFields();
		generateTable();
	});

	$(".field_name").live("keyup", function(){
		var fieldID = $.trim($(this).val()).split(":")[0];
		$(this).attr("id", fieldID);
		$($(this).parents("div")[0]).attr("id", fieldID);
	});

	$(".field_name").live("click", function(){
		var field = $(this).val();
		var field_data = field.split(":");
		old.field = field_data[0];
	});

	$(".field_name").live("blur", function(){
		if($(this).val() !== ""){
			
			var currentFieldID = $(this).parents("div")[0].id;
			var newFieldID = $(this).val().split(":")[0];

			current.field = $(this).val();
			modifyTable(current.table, old.field, current.field);
			updateFieldID(currentFieldID, newFieldID); //IM HERE
		}
	});

	var updateFieldID = function(currentFieldID, newfieldID){ 
	//updates the field id of the field and its container whenever there is a change on the field name
		$("#" + currentFieldID).attr("id", newfieldID);
		$("#field_" + currentFieldID).attr("id", "field_" + newfieldID);
	};

	$(".table input").live('keyup', function(e){
		var isTable = $(this).is('.tbl_name');
    var isField = $(this).is('.field_name');

    if(e.keyCode == 13){
    	if(isField){
    		createField();	
    	}
    }
	});

	var isNewTable = function(tableName){
		var table_status = 0;
		var field_value = $("#" + tableName + " .fields input").val();
		if(field_value === ""){
			table_status = 1;
		}
		return table_status;
	};

	var renameTable = function(currentTableName, newTableName){
		if(!isExisting('has_tbl', newTableName, '')){
			$.post(
				"invoker.php", 
				{
					"action" : "rename_tbl", 
					"current_table" : currentTableName, 
					"new_table" : newTableName
				},
				function(response){
					if(response == 1){
						successMessage("Successfully renamed table");
					}else{
						errorMessage("Something went wrong while renaming the table");
					}
				}
			);
		}else{
			errorMessage("A table with the same name already exists in the database");
		}
	};

	var successMessage = function(msg){
		noty_success.text = msg;
		noty(noty_success);
	};

	var errorMessage = function(msg){
		noty_err.text = msg;
		noty(noty_err);
	};

	$(".tbl_name").live("click", function(){
		var tblName = $.trim($(this).val());
		old.table = tblName;
	});

	$(".tbl_name").live("blur", function(){
		current.table = $.trim($(this).val());
		$($(this).parents("div")[1]).attr("id", current.table);

		if(isNewTable(current.table) == 0){
			renameTable(old.table, current.table);
		}
		
	});

	var dropField = function(tableName, fields, remove){
		$.post(
			"invoker.php", 
			{"action" : "drop_field", "table" : tableName, "fields" : fields},
			function(response){
				console.log(response);
				if(response == 1){
					if(remove === 1){
						$("#" + tableName + " #" + fields).remove();
					}
					successMessage("Field successfully dropped");
				}else{
					errorMessage("Cannot drop a parent field");				
				}
			}
		);
	};

	key("del", function(){
		dropTable(current.table);
	});

	key("s", function(){
		createTable(current.table);
	});

	key("d", function(){
		dropField(current.table, current.field.split(".")[1], 1);
	});
	
	key("a", function(){
		$("#" + current.table + " .fields").addClass("active_field");
		selectedFields = getSelectedFields();
	});

	var deselectTablesWithoutSelectedFields = function(){
		for(var tbl in selectedTables){
		 if($('#' + tbl + ' .active_field').length === 0){
		 	$('#' + tbl).removeClass("active_table");
		 }
		}
		selectedTables = getSelectedTables();
	};

	var updateQueryType = function(query_type){
		$(".query_options div").removeClass("active_option");
		$("." + query_type).addClass("active_option");
	};

	key("alt+s", function(){
		var joinType = $('input[name=join]:checked').attr('id');
		var mainTable = $('#parent_table').val();

		selectedTables = getSelectedTables();
		selectedFields = getSelectedFields();

		if(getObjectLength(selectedTables) >= 1 && getObjectLength(selectedFields) >= 1){
			deselectTablesWithoutSelectedFields();
			if(!$("#" + current.table).is(".active_table") && $(".active_table").length === 1){
				current.table = $(".active_table").attr("id");
			}
			
			selectQuery(selectedTables, selectedFields, current.table, joinType, mainTable);
			updateQueryType("select_query");
		}else{
			errorMessage("Please select 1 or more tables and fields for a select query");
		}

	});

	key("alt+u", function(){

		selectedTables = getSelectedTables();
		selectedFields = getSelectedFields();

		if(getObjectLength(selectedTables) === 1 && getObjectLength(selectedFields) >= 1){
			updateQuery("update", current.table, selectedFields);
			updateQueryType("update_query");
		}else{
			errorMessage("You can only select 1 table for an update query");
		}
	});

	key("alt+i", function(){

		selectedTables = getSelectedTables();
		selectedFields = getSelectedFields();

		if(getObjectLength(selectedTables) === 1 && getObjectLength(selectedFields) >= 1){
			updateQuery("insert", current.table, selectedFields);
			updateQueryType("insert_query");
		}else{
			errorMessage("You can only select 1 table and 1 or more fields for an insert query");
		}
	});

	key("alt+x", function(){
		
		selectedTables = getSelectedTables();
		selectedFields = getSelectedFields();

		if(getObjectLength(selectedTables) === 1){
			deleteQuery(current.table, selectedFields);
			updateQueryType("delete_query");
		}else{
			errorMessage("You can only select 1 table for a delete query");
		}
	});

	key('alt+w', function(){

		selectedTables = getSelectedTables();
		selectedFields = getSelectedFields();
		updateWhereModal(selectedFields);
		$('#where_modal').reveal();
	});

	key("ctrl+x", function(){

		selectedTables = getSelectedTables();

		detachedFields = [];
		if(getObjectLength(selectedTables) === 1){
			var tableFields = getTableFields(current.table, 1);
			for(var row in tableFields){
				var field = tableFields[row];
				detachedFields.push($("#" + current.table + " #" + field).detach());
			}
		
			detachedFieldTable = current.table;
		}else{
			errorMessage("You can only select 1 table while transferring fields");
		}
	});

	key("ctrl+v", function(){
		var expanded_fields = [];
		var tableName = current.table;
		var drop_fields = [];

		for(var row in detachedFields){
			var fieldID = $(detachedFields[row]).attr("id");
		  var field = $.trim($(detachedFields[row]).find('input').val());
			field = expandString(shortRegex, field);

			expanded_fields.push(field);
			drop_fields.push(fieldID);

			$(detachedFields[row]).appendTo($("#" + current.table + " .tbl_fields")).removeClass("active_field");
		}

		updateTable("add_field", current.table, "", expanded_fields);
		dropField(detachedFieldTable, drop_fields, 0);
	});

	key("alt+j", function(){
		var activetable_count = $(".active_table").length;
	
		if(activetable_count === 2){
			generateLinkTables("left_table", "right_table", "main_table", "left_select", "right_select", "main_select", "link_", "join_modal");
			var main_table = $('#parent_table').val();	
			switchTables(main_table);
		}else{
			errorMessage("Select only two tables before trying to join");
		}
	});

	var addJoinFields = function(joinData){
		var tbl = {};

		var main_table = $('#parent_table').val();

		if(joinData){
			tbl = joinData;
		}else{
			tbl.main_table = main_table;
			tbl.main_field = $('select[name=right_select]').val();
			tbl.child_table = $('.right_table label').text();
			tbl.child_field =  $('select[name=left_select]').val();
		}
		tbl.join_type = $('input[name=join]:checked').attr('id');
		db.tables.push(tbl);
	};

	key("l", function(){
		var selectedTableCount = getObjectLength(selectedTables);
		
		
		if(selectedTableCount === 2){
			var tbl1_fieldcount = 0;
			var tbl2_fieldcount = 0;
			var index = 0;
			for(var tbl in selectedTables){
			  if(index === 0){
			    tbl1_fieldcount = tbl1_fieldcount + getTableFields(tbl, 1).length;
			  }else{
			    tbl2_fieldcount = tbl2_fieldcount + getTableFields(tbl, 1).length;
			   }
			  index++;
			}

			if(tbl1_fieldcount === 1 && tbl2_fieldcount === 1){
				var main_table = $('#parent_table').val();
				var main_field = getTableFields(main_table, 1)[0];

				var child_table;
				var child_field;

				for(var tbl in selectedTables){
					if(tbl !== main_table){
						child_table = tbl;
						child_field = getTableFields(child_table, 1)[0];
					}
				}

				var join_data = {
					'main_table' : main_table, 'main_field' : main_field, 
					'child_table' : child_table, 'child_field' : child_field
				};

				addJoinFields(join_data);
				successMessage("Fields successfully added to join query");
			}else{
				errorMessage("Select 2 tables and a single field for each table to add fields to join query");
			}
		}else{
			errorMessage("Select 2 tables and a single field for each table to add fields to join query");
		}
	});

	$("#add_join").live("click", function(){
		addJoinFields();
		$("#join_modal").trigger('reveal:close');
	});

	var switchTables = function(main_table){
		if($('.right_table label').text() === main_table){
			
			var left = $('.left_table').children().detach();
			var right = $('.right_table').children().detach();
		 	left.appendTo($('.right_table'));
		 	right.appendTo($('.left_table'));
		} 
	};

	var updateTableList = function(selectedTables){
		var parent_table = $('#parent_table').empty();
		for(var table in selectedTables){
			var table_option = $("<option>").text(table).val(table);
			parent_table.append(table_option);
		}
	};

	var generateSelectedFieldsOption = function(selectID){
		var tmp_container = document.createDocumentFragment();
    $('#' + selectID).empty();

		for(var field in selectedFields){
			var field = $("<option>").text(field).val(field);
			$('#' + selectID).append(field);

		}
	};

	key("alt+o", function(){ //order by		
		generateSelectedFieldsOption("order_field");
		$("#orderby_modal").reveal();
	});

	key("alt+g", function(){ //group by
		generateSelectedFieldsOption("group_field");
		$("#groupby_modal").reveal();
	});

	$("#order_by").live("click", function(){
		var query_string = $.trim($("#query_string").val());
		var order_field = $("#order_field").val();
		var field_order = $("#field_order").val();

		if(/ORDER BY/gi.test(query_string)){

			var replace_order = /ORDER BY.+/gi.exec(query_string)[0];
			query_string = query_string.replace(replace_order, "ORDER BY " + order_field + " " + field_order);
			
		}else{
			query_string += "\nORDER BY " + order_field + " " + field_order;
		}
		
		$("#query_string").val(query_string); 
		$("#orderby_modal").trigger('reveal:close'); 
	});

	$("#group_by").live("click", function(){
		var query_string = $.trim($("#query_string").val());
		var group_field = $("#group_field").val();

		if(/GROUP BY/gi.test(query_string)){

			var replace_group = /GROUP BY.+/gi.exec(query_string)[0];
			query_string = query_string.replace(replace_group, "GROUP BY " + group_field);
		}else{
			query_string += "\nGROUP BY " + group_field;
		}

		$("#query_string").val(query_string);
		$("#groupby_modal").trigger('reveal:close');
	});

	var getKeyCount = function(){
		var key_count = 0;
		$('.active_table .fields input').each(function(){
			var field = $(this).val();
			if(/(PK|FK)/gi.test(field)){
				key_count++;
			}
		});
		return key_count;
	};

	var indexes = {
		"PRIMARY KEY" : "PK",
		"UNIQUE" : "UNI",
		"INDEX" : "IN"
	};

	var hasTip = function(currentField, keyType){ //checks if a field has already a particular tooltip
		return $("#" + currentField).find("." + keyType).length;
	};

	var addKey = function(key_type, currentTable, currentField, indexName){
		$.post(
			"invoker.php",
			{
			"action" : "add_key", "key_type" : key_type, 
			"table" : currentTable, "field" : currentField,
			"index_name" : indexName
			},
			function(response){
				console.log(response);
				if(response == 1){
					successMessage(key_type + " was successfully added to " + currentField);

					if(hasTip(currentField, indexes[key_type]) && indexes[key_type] == "IN"){
						var current_indexes = $("#" + currentField).find("." + indexes[key_type]).attr("title");
						current_indexes += indexName  + "\n";
						
						$("#" + currentField).find("." + indexes[key_type]).attr("title", current_indexes);
					}else{
						
						var new_key = $("<strong>").addClass("has-tip").text(indexes[key_type]).attr("title", key_type);
						$("#" + currentField).append(new_key);
					}
				}else{
					errorMessage("Something went wrong, maybe a key with the same name already exists");
				}
			}
		);
	};

	key("p", function(){
		var currentField = (current.field).split(".")[1];
		addKey("PRIMARY KEY", current.table, currentField);
	});

	key("i", function(){
		$("#addindex_modal").reveal();
	});

	$("#indextype").click(function(){
		var index_type = $(this).val();
		if(index_type === "INDEX"){
			$("#indexname_container").show();
		}else{
			$("#indexname_container").hide();
		}
	});

	$("#add_index").click(function(){
		var index_type = $("#indextype").val();
		var currentField = (current.field).split(".")[1];
		if(index_type === "INDEX"){ //for indexes
			var index_name = $.trim($("#indexname").val());
			addKey(index_type, current.table, currentField, index_name);
		}else{ //for primary keys and unique keys
			
			addKey(index_type, current.table, currentField);
		}

		$("#addindex_modal").trigger('reveal:close');
		$("#indexname").val("");
	});
