<?php

require_once 'config.php';

header('Content-Type: application/json');

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!isset($data['_url'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing URL parameter']);
    exit;
}

switch( $data["_type"] ) {

    case "music":
        $url = filter_var($data['_url'], FILTER_SANITIZE_URL);
        break;
    case "weather":
        $url = filter_var($data['_url'] . "&appid=" . WEATHER_API_KEY, FILTER_SANITIZE_URL) ;
        break;
    default: 
        // http_response_code(400);
        $url = null;
}

// $url = filter_var($data['_url'], FILTER_SANITIZE_URL);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($httpCode !== 200) {
    error_log("Proxy error: HTTP $httpCode, Error: $error, URL: $url");
    http_response_code($httpCode);
    echo json_encode(['error' => "{$httpCode}, Failed to fetch data from the API"]);
    exit;
}
echo $response;
