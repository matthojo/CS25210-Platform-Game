<?php
/**
 * Copyright 2012 matthojo.
 * Author: matthojo
 * Date: 15/03/2012
 * Time: 16:10
 *
 * Retrieves the top 10 high scores.
 */
include '../settings.php';

    $query = mysql_query("SELECT * FROM `scores` ORDER BY `score` DESC LIMIT 10");
    while($scores = mysql_fetch_array($query, MYSQL_ASSOC)){
        $name = $scores['name'];
        $meters = $scores['score'];

        echo '<li><span class="name">'.$name.'</span><span class="meters">'.$meters.'</span></li>';
    }
?>