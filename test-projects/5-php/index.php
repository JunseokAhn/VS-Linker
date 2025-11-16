<?php
/**
 * PHP Require/Include 테스트
 */

// require와 include 테스트
require_once './config.php';
require './functions.php';

echo "<h1>VS-Linker PHP Test</h1>";
echo "<p>App Name: " . APP_NAME . "</p>";
echo "<p>Version: " . APP_VERSION . "</p>";

$message = formatMessage("Hello from VS-Linker!");
echo "<p>" . $message . "</p>";

$result = multiply(5, 3);
echo "<p>5 x 3 = " . $result . "</p>";
?>
