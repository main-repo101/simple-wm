<?php
if (!isset($_GET['url'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing URL parameter']);
    exit;
}

$url = filter_var($_GET['url'], FILTER_SANITIZE_URL);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($httpCode !== 200) {
    error_log("Proxy error: HTTP $httpCode, Error: $error, URL: $url");
    http_response_code($httpCode);
    echo json_encode(['error' => 'Failed to fetch data from the API']);
    exit;
}

header('Content-Type: application/json');
echo $response;
