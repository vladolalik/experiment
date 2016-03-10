<?php
    $data = file_get_contents('php://input');
    $filename = $_COOKIE["username"]."_logs.txt";
    file_put_contents($filename, $data.PHP_EOL , FILE_APPEND);
    var_dump($filename);
?>