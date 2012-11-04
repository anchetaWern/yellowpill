<?php
class yp{
	
	public $dbname;

	private $db;
	private $mode;

	public function __construct($host, $user, $password, $database, $mode){

		$this->db = new MySqli($host, $user, $password, $database);
		$this->dbname = $database;
		$this->mode = $mode;
	}

	public function createTable($table, $fields){
		
		$query = "CREATE TABLE " . $table . " (";
		if(is_array($fields)){
			$field_count = count($fields);

			foreach($fields as $key => $field){
				$query .= $field;
				
				if($field_count - 1 !== $key){
					$query .= ", ";
				}
			}
		}else{
			$query .= $fields;
		}
		
		$query .= " )";

		$query = $this->trimQuery($query);
		return $this->getResult($query);
	}

	public function renameTable($table, $table_name){
		$query = "RENAME TABLE " . $table . " TO " . $table_name;

		if($this->hasTable($table) === 1){
			$query = $this->trimQuery($query);
			return $this->getResult($query);	
		}
	}

	public function addFields($table, $fields){
		if($this->hasTable($table) == 1){
			$query = "ALTER TABLE " . $table . " ";
			if(is_array($fields)){
				$field_count = count($fields);
				foreach($fields as $key => $field){
					$fields_data = explode(":", $field);
					if($this->hasField($table, $fields_data[0]) === 0){
						
						$query .= "ADD " . $field;

						if($field_count - 1 !== $key){
							$query .= ", ";
						}

					}
				}
			}else{
				$fields_data = explode(":", $fields);
				if($this->hasField($table, $fields_data[0]) === 0){
					
					$query .= "ADD " . $fields;
				}
			}

			$query = $this->trimQuery($query);
			return $this->getResult($query);

		}
	}

	public function dropFields($table, $fields){
		$query = "ALTER TABLE " . $table . " ";

		if(is_array($fields)){
			$field_count = count($fields);
			foreach($fields as $key => $field){
				if($this->hasField($table, $field) === 1){

					$query .= "DROP " . $field;
					if($field_count - 1 !== $key){
						$query .= ", ";
					}
				}
			}
		}else{
			if($this->hasField($table, $fields) === 1){
				$query .= "DROP " . $fields;
			}
		}

		$query = $this->trimQuery($query);
		return $this->getResult($query);
	}

	public function modifyFields($table, $old_fields, $new_fields){

		$query = "ALTER TABLE " . $table . " ";
		if(is_array($old_fields)){
			
			$field_count = count($old_fields);

			foreach($new_fields as $key => $field){
				
				$fields_data = explode(":", $field);
				if($this->hasField($table, $old_fields[$key]) === 1){
					
					$query .= "CHANGE " . $old_field . " " . $field;
					if($field_count - 1 !== $key){
						$query .= ", ";
					}
				}

			}
		}else{
				$fields_data = explode(":", $new_fields);
				if($this->hasField($table, $old_fields) === 1){
					
					$query .= "CHANGE " . $old_fields . " " . $new_fields;
				}
		}

		$query = $this->trimQuery($query);
		return $this->getResult($query);

	}

	public function alterField($table, $old_field, $new_field){

		$query = "ALTER TABLE " . $table .  " CHANGE " . $old_field . " " . $new_field;
		$query = $this->trimQuery($query);
		return $this->getResult($query);
	}	

	private function getResult($query){
		$result = 0;
		if($this->mode == 0){
			$result = $query;
		}else{
			$result = $this->db->query($query);
		}
		return $result;
	}

	private function trimQuery($query){
		$query = trim($query);

		if(substr($query, -1, 1) === ","){
			$query = substr($query, 0, strlen($query) - 1);
		}

		$query = str_replace(":", "", $query);
		return $query;		
	}

	public function createLink($childTable, $mainTable, $childField, $mainField){
		$query = "ALTER TABLE " . $childTable . " ADD FOREIGN KEY(" . $childField . ")";
		$query .= " REFERENCES " . $mainTable . "(" . $mainField . ")";
		

		$query = $this->trimQuery($query);
		return $this->getResult($query);
	}

	public function dropTable($table){
		$query = "DROP TABLE " .  $this->dbname . '.'.  $table;
		$query = $this->trimQuery($query);
		return $this->getResult($query);
	}
	public function getTables(){
		$tables = array();
		$query = $this->db->query("
			SELECT TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS 
			WHERE TABLE_SCHEMA = '$this->dbname' GROUP BY TABLE_NAME");
		if($query->num_rows > 0){
			while($row = $query->fetch_object()){
				$tables[] = $row->TABLE_NAME;
			}
		}
		return $tables;
	}

	public function getFields(){
		$fields = array();
		$query = $this->db->query("
			SELECT DISTINCT COLUMN_NAME, TABLE_NAME, DATA_TYPE, 
			COLUMN_DEFAULT, COLUMN_KEY, IS_NULLABLE, COLUMN_TYPE, EXTRA
			FROM INFORMATION_SCHEMA.COLUMNS
			WHERE TABLE_SCHEMA='$this->dbname'
		");
		if($query->num_rows > 0){
			while($row = $query->fetch_object()){
				$default_data = "";
				if(!empty($row->COLUMN_DEFAULT)){
					$default_data = " DEF " . $row->COLUMN_DEFAULT;
				}
				$fields[$row->TABLE_NAME][] = array(
				'field_name' =>$row->COLUMN_NAME,
				'data_type' =>$row->DATA_TYPE, 'default_data' =>$default_data,
				'column_key' =>$row->COLUMN_KEY, 'nullable' =>$row->IS_NULLABLE,
				'column_type' =>strtoupper($row->COLUMN_TYPE),
				'extra' =>$row->EXTRA
				);
			}
		}
		return $fields;
	}

	public function orderField($table, $field_to_move, $position, $base_field = ''){
		$query = "ALTER TABLE ". $table ." MODIFY COLUMN ". $field_to_move . " " . $position . " " . $base_field;
		$query = $this->trimQuery($query);
		return $this->getResult($query);
	}

	public function getTableLinks(){
		$tablelinks = array();
		$query = $this->db->query("
			SELECT REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME, TABLE_NAME, 
			COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
			WHERE TABLE_SCHEMA = '$this->dbname' AND REFERENCED_TABLE_NAME IS NOT NULL
		");
		
		if($query->num_rows > 0){
			while($row = $query->fetch_object()){
				$tablelinks[$row->TABLE_NAME][] = array(
					"main_table" => $row->REFERENCED_TABLE_NAME,
					"main_field" => $row->REFERENCED_COLUMN_NAME,
					"child_table" => $row->TABLE_NAME,
					"child_field" => $row->COLUMN_NAME
				);
			}
		}	

		return $tablelinks;
	}

	public function hasField($table, $field){
		$query = $this->db->query("SELECT * 
		FROM INFORMATION_SCHEMA.COLUMNS 
		WHERE TABLE_SCHEMA = '$this->dbname' 
		AND TABLE_NAME = '$table' 
		AND COLUMN_NAME = '$field'");

		return $query->num_rows;

	}

	public function hasTable($table){
		$query = $this->db->query("
			SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
			WHERE TABLE_NAME = '$table' AND TABLE_SCHEMA = '$this->dbname' 
		");

		return $query->num_rows;
	}

	public function getFieldLink($table, $field){
		$tablelinks = array();
		$query = $this->db->query("
			SELECT REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME, TABLE_NAME, 
			COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
			WHERE TABLE_SCHEMA = '$this->dbname' AND REFERENCED_TABLE_NAME IS NOT NULL
			AND TABLE_NAME = '$table' AND COLUMN_NAME = '$field'
		"); 

		if($query->num_rows === 1){
			while($row = $query->fetch_object()){
				$tablelinks = array(
					"main_table" => $row->REFERENCED_TABLE_NAME,
					"main_field" => $row->REFERENCED_COLUMN_NAME,
					"child_table" => $row->TABLE_NAME,
					"child_field" => $row->COLUMN_NAME
				);
			}
		}	

		return $tablelinks;
	}

	public function getFieldIndex($table, $field){ //get indexes which are not equal to primary
		$field_indexes = array();
		$query = $this->db->query("
			SELECT TABLE_NAME, COLUMN_NAME, INDEX_NAME 
			FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = '$this->dbname' 
			AND TABLE_NAME = '$table' AND COLUMN_NAME = '$field' AND INDEX_NAME != 'PRIMARY'
		"); 
		
		if($query->num_rows > 0){
			while($row = $query->fetch_object()){
				array_push($field_indexes, $row->INDEX_NAME);
			}
		}
		return $field_indexes;
	}


	public function addKey($table, $field, $key_type){ //adds unique or primary keys
		$query = "ALTER TABLE $table ADD $key_type($field)";
		return $this->getResult($query);
	}

	public function addIndex($table, $field, $index_name){ //adds a named index to a field
		$query = "ALTER TABLE $table ADD INDEX $index_name($field)";
		return $this->getResult($query);
	}

	public function hasKey($table, $field, $key_type){ //checks if a field has a key and returns the properties (type of key, key name) on that key if there is 
		$query = "
			SELECT INFORMATION_SCHEMA.KEY_COLUMN_USAGE.COLUMN_NAME, 
			INFORMATION_SCHEMA.TABLE_CONSTRAINTS.CONSTRAINT_NAME, INFORMATION_SCHEMA.TABLE_CONSTRAINTS.TABLE_NAME, 
			INFORMATION_SCHEMA.CONSTRAINT_TYPE 
			FROM TABLE_CONSTRAINTS 
			INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE ON INFORMATION_SCHEMA.TABLE_CONSTRAINTS.TABLE_NAME = INFORMATION_SCHEMA.KEY_COLUMN_USAGE.TABLE_NAME
			WHERE TABLE_CONSTRAINTS.TABLE_SCHEMA = '$this->dbname' AND INFORMATION_SCHEMA.TABLE_CONSTRAINTS.TABLE_NAME = '$table' AND INFORMATION_SCHEMA.KEY_COLUMN_USAGE.COLUMN_NAME = '$field'
			AND INFORMATION_SCHEMA.KEY_COLUMN_USAGE.CONSTRAINT_NAME = INFORMATION_SCHEMA.TABLE_CONSTRAINTS.CONSTRAINT_NAME
		";

		return $this->getResult($query);

	}

	public function hasIndex($table, $field, $indexname){

	}

	public function dropForeignKey($table, $keyname){ //drops foreign key field
		$query = "ALTER TABLE $table DROP FOREIGN KEY $keyname";
		return $this->getResult($query);
	}

	public function dropPrimaryKey($table, $field, $data_type){ //used for dropping primary key
		$query = "ALTER TABLE $table MODIFY $field $data_type NOT NULL, DROP PRIMARY KEY";
		return $this->getResult($query);
	}

	public function dropIndex($table, $indexname){ //used for dropping indexes like foreign key and unique key
		$query = "ALTER TABLE $table DROP INDEX $indexname";
		return $this->getResult($query);
	}
}
/*
			SELECT DISTINCT COLUMNS.COLUMN_NAME,  COLUMNS.TABLE_NAME, COLUMNS.DATA_TYPE, 
			COLUMNS.COLUMN_DEFAULT, COLUMNS.COLUMN_KEY, COLUMNS.IS_NULLABLE, COLUMNS.COLUMN_TYPE, COLUMNS.EXTRA,
			REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME 
			FROM INFORMATION_SCHEMA.COLUMNS
			LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE ON INFORMATION_SCHEMA.KEY_COLUMN_USAGE.COLUMN_NAME = INFORMATION_SCHEMA.COLUMNS.COLUMN_NAME
			WHERE INFORMATION_SCHEMA.COLUMNS.TABLE_SCHEMA ='redbean'
 */
?>