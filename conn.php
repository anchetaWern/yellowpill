<?php
require_once('config.php');
$db = new Mysqli(HOST, USER, PASSWORD);

if($db->connect_errno){
	die('Connect Error: ' . $db->connect_errno);
}
?>