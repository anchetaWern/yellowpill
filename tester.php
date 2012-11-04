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
//print_r($yp->getFieldLink("tbl_students", "course_id"));
//echo $yp->addKey("tbl_students", "id", "PRIMARY KEY");
//echo $yp->addKey("tbl_students", "name", "UNIQUE");
//echo $yp->dropIndex("tbl_students", "bim");
//echo $yp->dropForeignKey("tbl_students", "tbl_students_ibfk_1");
//echo $yp->dropIndex("tbl_students", "name");
//echo $yp->dropPrimaryKey("tbl_students", "id", "INT");
//echo $yp->addIndex("tbl_students", "id", "bim");
print_r($yp->getFieldIndex("tbl_courses", "course"));
?>