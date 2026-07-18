<?php
/**
 * NOVA SM — Contact 메일 전송 (PHPMailer + Naver SMTP)
 *
 * 카페24 업로드 위치 : 사이트 루트 (index.html 과 같은 폴더)
 * PHPMailer 업로드 위치 : /phpmailer/  폴더 안에 3개 파일
 *   - Exception.php
 *   - PHPMailer.php
 *   - SMTP.php
 * → https://github.com/PHPMailer/PHPMailer 에서 src/ 폴더의 3개 파일을 내려받으세요.
 */

// ─── PHPMailer 존재 확인 ──────────────────────────────────────
if (!file_exists(__DIR__ . '/phpmailer/PHPMailer.php')) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'phpmailer/ 폴더가 없습니다. PHPMailer 파일을 업로드하세요.']);
    exit;
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method Not Allowed']);
    exit;
}

require_once __DIR__ . '/phpmailer/Exception.php';
require_once __DIR__ . '/phpmailer/PHPMailer.php';
require_once __DIR__ . '/phpmailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ─── 요청 데이터 파싱 ─────────────────────────────────────────
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => '잘못된 요청입니다.']);
    exit;
}

function s($key, $data) {
    return isset($data[$key]) ? htmlspecialchars(trim($data[$key]), ENT_QUOTES, 'UTF-8') : '미입력';
}

$company = s('company', $data);
$name    = s('name',    $data);
$tel     = s('tel',     $data);
$email   = s('email',   $data);
$subject = s('subject', $data);
$message = nl2br(s('message', $data));

// 필수 값 확인
if ($name === '미입력' || $tel === '미입력' || $email === '미입력') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => '담당자명, 연락처, 이메일은 필수입니다.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => '올바른 이메일 형식이 아닙니다.']);
    exit;
}

// ─── 메일 본문 (HTML 표) ──────────────────────────────────────
$html = "
<table style='width:100%;border-collapse:collapse;font-family:sans-serif;font-size:16px;color:#222;'>
  <tr><td colspan='2' style='background:#0f1a2e;color:#fff;padding:16px 20px;font-size:20px;font-weight:700;letter-spacing:0.1em;'>NOVA SM 문의 접수</td></tr>
  <tr style='background:#f5f5f5;'><td style='padding:10px 16px;font-weight:700;width:160px;'>회사명</td><td style='padding:10px 16px;'>{$company}</td></tr>
  <tr>                            <td style='padding:10px 16px;font-weight:700;'>담당자명</td><td style='padding:10px 16px;'>{$name}</td></tr>
  <tr style='background:#f5f5f5;'><td style='padding:10px 16px;font-weight:700;'>연락처</td><td style='padding:10px 16px;'>{$tel}</td></tr>
  <tr>                            <td style='padding:10px 16px;font-weight:700;'>이메일</td><td style='padding:10px 16px;'>{$email}</td></tr>
  <tr style='background:#f5f5f5;'><td style='padding:10px 16px;font-weight:700;'>제목</td><td style='padding:10px 16px;'>{$subject}</td></tr>
  <tr>                            <td style='padding:10px 16px;font-weight:700;'>문의내용</td><td style='padding:10px 16px;'>{$message}</td></tr>
</table>";

// ─── PHPMailer 전송 ───────────────────────────────────────────
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.naver.com';
    $mail->SMTPAuth   = true;

    // ▼▼▼ [수정 필요] SMTP 로그인 계정 — 네이버 메일 주소 / 앱 비밀번호 ▼▼▼
    $mail->Username   = 'YOUR_NAVER_ID@naver.com';   // ← 발송용 네이버 이메일
    $mail->Password   = 'YOUR_APP_PASSWORD';         // ← 네이버 앱 비밀번호
    // ▲▲▲ [수정 필요] SMTP 로그인 계정 ▲▲▲

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->Timeout    = 10;
    $mail->CharSet    = 'UTF-8';

    // ▼▼▼ [수정 필요] 발신자 / 수신자 이메일 — 웹에서 발송·수신할 주소 ▼▼▼
    $mail->setFrom('YOUR_NAVER_ID@naver.com', 'NOVA SM 웹사이트'); // ← 발신 표시 이메일 (SMTP Username 과 동일하게)
    $mail->addAddress('contact@naver.com', 'NOVA SM');              // ← 문의 수신 이메일 (여기로 문의 메일이 옴)
    // ▲▲▲ [수정 필요] 발신자 / 수신자 이메일 ▲▲▲

    $mail->addReplyTo($email, $name);

    $mail->isHTML(true);
    $mailSubject = ($subject !== '미입력') ? $subject : '문의';
    $mail->Subject = "[NOVA SM 문의] {$name} / {$tel} — {$mailSubject}";
    $mail->Body    = $html;
    $mail->AltBody = "회사명: {$company}\n담당자명: {$name}\n연락처: {$tel}\n이메일: {$email}\n제목: {$subject}\n문의내용: " . s('message', $data);

    $mail->send();

    echo json_encode(['ok' => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => '메일 전송 실패: ' . $mail->ErrorInfo]);
}
