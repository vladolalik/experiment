<?php
    echo $_REQUEST["param"];
//
//    $file = 'people.txt';
//    // Open the file to get existing content
//    $current = file_get_contents($file);
//    // Append a new person to the file
//    $current .= $_REQUEST["param"];
//    // Write the contents back to the file
//    file_put_contents($file, $current);
    file_put_contents('logs.txt', $_REQUEST["param"].PHP_EOL , FILE_APPEND);

?>