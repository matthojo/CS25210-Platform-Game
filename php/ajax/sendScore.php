<?php
/**
 * Copyright 2012 matthojo.
 * Author: matthojo
 * Date: 15/03/2012
 * Time: 14:12
 */
include '../settings.php';
include '../classes/functions.php';

$score = sanitize($_POST['score']);
$user = sanitize($_POST['name']);

if($user && $score){
    $query = mysql_query("INSERT INTO `scores` (`name`, `score`) VALUES ('".$user."', '".$score."')")or die(mysql_error());
    if($query){
        $query = mysql_query("SELECT * FROM `scores` ORDER BY `score` DESC LIMIT 10");
        while($scores = mysql_fetch_array($query, MYSQL_ASSOC)){
            $name = $scores['name'];
            $meters = $scores['score'];

            echo '<li><span class="name">'.$name.'</span><span class="meters">'.$meters.' meters</span></li>';
        }
    }
    else{
        echo "Failed";
        echo $user;
        echo $score;
    }

}else{
    echo "Invalid data";
    echo $user;
    echo $score;
}
?>