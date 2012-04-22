<?php
/**
 * Copyright 2012 matthojo.
 * Author: matthojo
 * Date: 15/03/2012
 * Time: 16:32
 *
 * Gets individuals highest score.
 */

include '../settings.php';
include '../classes/functions.php';

$user = sanitize($_POST['name']);

$query = mysql_query("SELECT `score` FROM `scores` WHERE `name`='$user' ORDER BY `score` DESC LIMIT 1");
while($scores = mysql_fetch_array($query, MYSQL_ASSOC)){
    $meters = $scores['score'];
    echo $meters;
}