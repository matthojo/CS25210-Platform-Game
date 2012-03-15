<?php
/**
 * Copyright 2012 matthojo.
 * Author: matthojo
 * Date: 15/03/2012
 * Time: 13:56
 */

########## Database Info ##########
$db_server = 'localhost';
$db_name = 'runnerman';
$db_user = 'runner';
$db_passwd = 'running';

######### Connect to Database #########
$login = mysql_connect($db_server, $db_user, $db_passwd) or trigger_error(mysql_error(),E_USER_ERROR);
mysql_select_db($db_name);

?>