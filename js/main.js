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
				console.log(response);
				noty_success.text = "Successfully modified table!";
				noty(noty_success);
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

	var selectQuery = function(){ //generates an sql select query
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
			deselectFields(table, 1);
			reselectFields(table);

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
				reselectFields(table);

				selectedTables = {};
				selectedFields = {};
			}

		}
		selectedTables = getSelectedTables();
		selectedFields = getSelectedFields();
	});

	var getFields = function(table, type){ //gets the active fields of a specific table
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

	var reselectFields = function(table){
		var activeFields = getFields(table, 1);
		$.each(activeFields, function(index, id){ 
			$("#" + id).addClass("active_field"); //reselect the fields of the current table
		});
	};

	//event handler for clicking on fields
	/*
	selecting a field automatically selects the table
	 */
	$(".fields").live("click", function(e){
		e.stopPropagation();
		var table = $($(this).parents("div")[1]).attr("id");
		var field = $(this).attr("id");

		if($(this).is(".active_field")){
			$(this).removeClass("active_field");
			deselectFields(table, 1);
			reselectFields(table);

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
				deselectFields(table, 2);
				reselectFields(table);

				selectedTables = {};
				selectedFields = {};

				$(".active_field").removeClass("active_field");
				$(this).addClass("active_field");
			}
		}

		selectedTables = getSelectedTables();
		selectedFields = getSelectedFields();
	});

	key("j", function(){

		var activetable_count = $(".active_table").length;
	
		if(activetable_count === 2){
			var table1 = $(".table1");
			var table2 = $(".table2");
			var table3 = $(".table3");

			var mainHeader = $("<label>").text("Main table");
			var select1 = $("<select>").attr({"name" : "select1"});
			var select2 = $("<select>").attr({"name" : "select2"});
			var select3 = $("<select>").attr({"name" : "select3", "id" : "select3"});

			table1.empty();
			table2.empty();
			table3.empty();

			$(".active_table").each(function(index, val){
				var table = $(this).attr("id");
				var fields = getFields(table);
				var fieldCount = fields.length;

				var header = $("<label>").text(table);
				var tableOption = $("<option>").attr({"value" : table}).text(table);
				select3.append(tableOption);

				if(index === 0){
					select1.attr("id", "join_" + table);
					table1.append(header);
					for(var x = 0; x <= fieldCount; x++){
						var fieldName = fields[x];
						var option = $("<option>").attr({"value" : fieldName}).text(fieldName);
						select1.append(option);
					}
					

				}else{
					select2.attr("id", "join_" + table);
					table2.append(header);
					for(var x = 0; x <= fieldCount; x++){
						var fieldName = fields[x];
						var option = $("<option>").attr({"value" : fieldName}).text(fieldName);
						select2.append(option);
					}
					
				}
			});

			table3.append(mainHeader);
			table3.append(select3);

			table1.append(select1);
			table2.append(select2);

			
			$("#link_modal").reveal();

		}else{
			noty_err.text = "Select only two tables before trying to join";
			noty(noty_err);

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
		var mainTable = $("#select3").val();
		var childTable = getChildTable(mainTable);
		var mainField = $('#join_' + mainTable).val();
		var childField = $('#join_' + childTable).val();

		joinTables(mainTable, childTable, mainField, childField);
	});

	key("t", function(){
		generateTable();
	});


	$(".field_name").live('click', function(){
		var field = $(this).val();
		var field_data = field.split(":");
		old.field = field_data[0];
	});

	$(".field_name").live('blur', function(){
		if($(this).val() !== ""){

			current.field = $(this).val();
			modifyTable(current.table, old.field, current.field);
		}
	});

