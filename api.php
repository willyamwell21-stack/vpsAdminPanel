<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$API_URL = 'https://backend.psb.hosting/order';
$API_TOKEN = 'JbUTdTAnkxT6XJbD7MaxxFYWTnbdeZV8l0eShp2NkgvU9sBiNRZvZKIpAroZdPHpK4H4F_WsHSrPZGX1kyYoWiIbXLaqFndaqx-wfa6GnrFYv_sWnziwfe8vYAsDBENSMG_Zl7q3_MjpbFFiVrDB3XG8kXDaobgX5sr1Kg';

$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => $API_URL,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: ' . $API_TOKEN,
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept: application/json',
        'Accept-Language: en-US,en;q=0.9',
    ],
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_TIMEOUT => 30
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

curl_close($ch);

if ($error) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Request failed',
        'message' => $error
    ]);
    exit;
}

if ($httpCode === 403) {
    http_response_code(403);
    echo json_encode([
        'error' => 'Cloudflare Protection',
        'message' => 'API is protected by Cloudflare',
        'httpCode' => $httpCode
    ]);
    exit;
}

http_response_code($httpCode);
echo $response;
?>
