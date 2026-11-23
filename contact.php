<?php
// The "Write to Vivek" form. Sends one plain-text email to Vivek and answers in JSON.
// No data is stored. Nothing is sent anywhere else.
$TO = 'vivek@aadivaahan.com';
$FROM = 'website@aadivaahan.com';

$ajax = isset($_SERVER['HTTP_X_REQUESTED_WITH']);
function done($ok, $msg, $ajax) {
    if ($ajax) {
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        echo json_encode(array('ok' => $ok, 'message' => $msg));
    } else {
        header('Content-Type: text/html; charset=utf-8');
        echo '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Vivek Chaturvedi</title>'
           . '<body style="font-family:system-ui,sans-serif;max-width:34em;margin:18vh auto;padding:0 20px;line-height:1.5"><p>' . htmlspecialchars($msg, ENT_QUOTES, 'UTF-8') . '</p><p><a href="/#connect">Back to the site</a></p>';
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); done(false, 'Please use the form on the site.', $ajax); }

function field($k, $max) {
    $v = isset($_POST[$k]) && is_string($_POST[$k]) ? trim($_POST[$k]) : '';
    return function_exists('mb_substr') ? mb_substr($v, 0, $max, 'UTF-8') : substr($v, 0, $max);
}
function oneLine($v) { return trim(preg_replace('/[\r\n\t]+/', ' ', $v)); }

$name = oneLine(field('name', 80));
$email = oneLine(field('email', 120));
$topic = oneLine(field('topic', 60));
$message = field('message', 4000);

// a hidden box that people never see: if it is filled in, it was a robot. Say thank you and send nothing.
if (field('website', 200) !== '') { done(true, 'Sent. Thank you.', $ajax); }

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    done(false, 'Please add your name, a working email address and a message.', $ajax);
}
$topics = array('Consult', 'Collaborate', 'Invest', 'A healing session', 'Coaching', 'Something else');
if (!in_array($topic, $topics, true)) { $topic = 'Something else'; }

$subject = 'Website: ' . $topic . ' (from ' . $name . ')';
$body = "A note from the form on aadivaahan.com\n\n"
      . "Name: " . $name . "\n"
      . "Email: " . $email . "\n"
      . "About: " . $topic . "\n\n"
      . $message . "\n\n"
      . "Reply to this email to answer " . $name . " directly.\n";
$headers = array(
    'From: Aadivaahan website <' . $FROM . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
);
$subjectEnc = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$sent = @mail($TO, $subjectEnc, $body, implode("\r\n", $headers), '-f' . $FROM);

if ($sent) { done(true, 'Sent. Thank you. Vivek will reply by email.', $ajax); }
http_response_code(500);
done(false, 'That did not go through. Please write to vivek@aadivaahan.com instead.', $ajax);
