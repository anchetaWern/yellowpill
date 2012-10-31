<?php
session_start();
require_once('yp.php');
$yp = new yp("localhost", "root", "1234", "redbean", 1);
//echo $yp->modifyFields("tbl_names", array("name: VARCHAR(23)",  "address: TEXT", "bing: CHAR"));
//echo $yp->addFields("tbl_names", "nameX: VARCHAR(30)");
//echo $yp->dropFields("tbl_names", "namess");
//$table = "aaa";
//$fields = array("id:  INT(23)  DEFAULT 31  NOT NULL");
//echo $yp->modifyFields($table, $fields);
//echo $yp->dropTable("tbl_awesome");
//echo $yp->createDatabase("oroboros");
echo $yp->dropTable("tbl_nothing");
?>