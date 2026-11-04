<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond(int $code, array $payload): never {
    http_response_code($code); echo json_encode($payload); exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, ['success'=>false,'message'=>'POST method required.']);

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$subject = 'Portfolio contact message';
$message = trim((string)($_POST['message'] ?? ''));

if ($name === '' || mb_strlen($name)>120 || !filter_var($email,FILTER_VALIDATE_EMAIL) || mb_strlen($email)>254 ||
    mb_strlen($message)<10 || mb_strlen($message)>10000) {
    respond(422,['success'=>false,'message'=>'Please complete all fields with valid information.']);
}
// Honeypot field (add hidden input named website to form if desired)
if (!empty($_POST['website'])) respond(200,['success'=>true,'message'=>'Thank you!']);

try {
    // Create database and user in your hosting panel, then replace these values.
    $dbHost = 'localhost'; $dbName = 'YOUR_DATABASE_NAME';
    $dbUser = 'YOUR_DATABASE_USER'; $dbPass = 'YOUR_DATABASE_PASSWORD';
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4",$dbUser,$dbPass,[
        PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC
    ]);
    $stmt=$pdo->prepare('INSERT INTO contact_messages (full_name,email,subject,message) VALUES (:name,:email,:subject,:message)');
    $stmt->execute(['name'=>$name,'email'=>$email,'subject'=>$subject,'message'=>$message]);
} catch (Throwable $e) {
    error_log('Portfolio contact DB error: '.$e->getMessage());
    respond(500,['success'=>false,'message'=>'The message could not be saved. Please try again later.']);
}

// Configure your hosting provider's authenticated SMTP/mail delivery for PHP mail().
$to = 'ajmal.abdulrahimzai123@gmail.com';
$mailSubject = 'Portfolio contact: '.$subject;
$mailBody = "New portfolio contact message\n\nName: $name\nEmail: $email\nSubject: $subject\n\n$message\n";
$headers = "From: Portfolio Website <no-reply@YOUR_DOMAIN.com>\r\n";
$headers .= "Reply-To: ".str_replace(["\r","\n"], '', $email)."\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$mailSent = mail($to, '=?UTF-8?B?'.base64_encode($mailSubject).'?=', $mailBody, $headers);
if (!$mailSent) error_log('Portfolio contact saved, but mail() delivery failed.');
respond(200,['success'=>true,'message'=>'Thank you! Your message has been received.'.(!$mailSent?' (Email notification may be delayed.)':'')]);
