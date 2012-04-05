<?php
/**
 * Copyright 2012 matthojo.
 * Author: matthojo
 * Date: 15/03/2012
 * Time: 13:58
 */
function getScores(){
    $query = mysql_query("SELECT * FROM `scores` ORDER BY `score` DESC LIMIT 10");
    while($scores = mysql_fetch_array($query, MYSQL_ASSOC)){
        $name = $scores['name'];
        $meters = $scores['score'];
        
        echo '<li><span class="name">'.$name.'</span><span class="meters">'.$meters.'</span></li>';
    }
}

/**
 * FROM http://css-tricks.com/snippets/php/sanitize-database-inputs/
 * @param $input
 * @return mixed
 */
function cleanInput($input) {

    $search = array(
        '@<script[^>]*?>.*?</script>@si',   // Strip out javascript
        '@<[\/\!]*?[^<>]*?>@si',            // Strip out HTML tags
        '@<style[^>]*?>.*?</style>@siU',    // Strip style tags properly
        '@<![\s\S]*?--[ \t\n\r]*>@'         // Strip multi-line comments
    );

    $output = preg_replace($search, '', $input);
    return $output;
}

/**
 * FROM http://css-tricks.com/snippets/php/sanitize-database-inputs/
 * @param $input
 * @return array|string
 */
function sanitize($input) {
    if (is_array($input)) {
        foreach($input as $var=>$val) {
            $output[$var] = sanitize($val);
        }
    }
    else {
        if (get_magic_quotes_gpc()) {
            $input = stripslashes($input);
        }
        $input  = cleanInput($input);
        $output = mysql_real_escape_string($input);
    }
    return $output;
}
?>