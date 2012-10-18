<?php
class yp{
	
	private $db;
	private $dbname;
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
		if($this->mode == 0){
			return $query;
		}else{
			$this->db->query($query);
		}
	}

	public function addFields($table, $fields){
		$query = "ALTER TABLE " . $table . " ";
		if(is_array($fields)){
			$field_count = count($fields);
			foreach($fields as $key => $field){
				$query .= "ADD " . $field;
				if($field_count - 1 !== $key){
					$query .= ", ";
				}
			}
		}else{
			$query .= $fields;
		}
		
		if($this->mode == 0){
			return $query;
		}else{
			$this->db->query($query);
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

		if($this->mode == 0){
			return $query;
		}else{
			$this->db->query($query);
		}
	}

	public function modifyFields($table, $fields){

		$query = "ALTER TABLE " . $table . " ";
		if(is_array($fields)){
			
			$field_count = count($fields);

			foreach($fields as $key => $field){
				$fields_data = explode(":", $field);
				if($this->hasField($table, $fields_data[0]) === 1){
					$fields = str_replace(":", "", $field);
					$query .= "MODIFY " . $field;
					if($field_count - 1 !== $key){
						$query .= ", ";
					}
				}
			}
		}else{
				$fields_data = explode(":", $fields);
				if($this->hasField($table, $fields_data[0]) === 1){
					$fields = str_replace(":", "", $fields);
					$query .= "MODIFY " . $fields;
				}
		}

		if($this->mode == 0){
			return $query;
		}else{
			$this->db->query($query);
		}
	}

	public function createLink($childTable, $mainTable, $childField, $mainField){
		$query = "ALTER TABLE " . $childTable . " ADD FOREIGN KEY(" . $childField . ")";
		$query .= " REFERENCES " . $mainTable . "(" . $mainField . ")";
		

		if($this->mode == 0){
			return $query;
		}else{
			$this->db->query($query);
		}
	}

	public function dropTable($table){
		$query = "DROP TABLE " . $table;
		if($this->mode == 0){
			return $query;
		}else{
			$this->db->query($query);
		}
	}
	public function getTables(){
		$tables = array();
		$query = $this->db->query("
			SELECT TABLE_NAME FROM information_schema.COLUMNS 
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
			COLUMN_DEFAULT, COLUMN_KEY, IS_NULLABLE, CHARACTER_OCTET_LENGTH
			FROM INFORMATION_SCHEMA.COLUMNS
			WHERE TABLE_SCHEMA='$this->dbname'
		");
		if($query->num_rows > 0){
			while($row = $query->fetch_object()){
				$fields[$row->TABLE_NAME][] = array(
				'field_name'=>$row->COLUMN_NAME,
				'data_type'=>$row->DATA_TYPE, 'default_data'=>$row->COLUMN_DEFAULT,
				'column_key'=>$row->COLUMN_KEY, 'nullable'=>$row->IS_NULLABLE,
				'length'=>$row->CHARACTER_OCTET_LENGTH
				);
			}
		}
		return $fields;
	}

	private function hasField($table, $field){
		$query = $this->db->query("SELECT * 
		FROM information_schema.COLUMNS 
		WHERE TABLE_SCHEMA = '$this->dbname' 
		AND TABLE_NAME = '$table' 
		AND COLUMN_NAME = '$field'");

		return $query->num_rows;

	}
}
?>