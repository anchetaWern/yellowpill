<?php
class db{
	public function __construct($host, $user, $password){

		$this->db = new MySqli($host, $user, $password);
		
	}

	public function hasDatabase($dbname){
		$query = $this->db->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '$dbname'");
		
		if($query->num_rows === 0){
			$this->createDatabase($dbname);
			return 1;
		}else{
			return $query->num_rows;
		}
	}

	private function createDatabase($dbname){
		$this->db->query("CREATE DATABASE " . $dbname);
	}
}
?>