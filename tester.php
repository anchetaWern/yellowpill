<?php
require_once('yp.php');
$yp = new yp("localhost", "root", "1234", "redbean", 1);
echo $yp->modifyFields("tbl_names", "name: VARCHAR(40)");
?>