<?php
// systemthinking/api/quick-request.php

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
  exit;
}

// Read JSON (React fetch) or fallback to form-data
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
  $data = $_POST;
}

// Helpers
$pick = function(array $arr, array $keys, string $default = ''): string {
  foreach ($keys as $k) {
    if (isset($arr[$k])) {
      $val = trim((string)$arr[$k]);
      if ($val !== '') return $val;
    }
  }
  return $default;
};

$language = strtolower($pick($data, ['language', 'lang'], 'es'));
$language = in_array($language, ['es', 'en'], true) ? $language : 'es';

$email = $pick($data, ['email', 'correo', 'mail']);
$name  = $pick($data, ['name', 'nombre', 'fullName'], '(sin nombre)');
$role  = $pick($data, ['role', 'rol', 'organization', 'organizacion', 'company', 'rol_organizacion']);
$interest = $pick($data, ['interest', 'tipoInteres', 'tipo_de_interes', 'interestType', 'interes']);
$message = $pick($data, ['message', 'mensaje', 'notes', 'comentarios']);
$ip = $_SERVER['REMOTE_ADDR'] ?? '';

// Validate
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => ($language === 'en' ? 'Invalid email' : 'Email inválido')], JSON_UNESCAPED_UNICODE);
  exit;
}

// UTF-8 mail helper (supports CC)
$sendMail = function(string $to, string $subject, string $body, string $from, string $replyTo = '', string $cc = ''): bool {
  $headers = [];
  $headers[] = 'MIME-Version: 1.0';
  $headers[] = 'Content-Type: text/plain; charset=UTF-8';
  $headers[] = 'Content-Transfer-Encoding: 8bit';
  $headers[] = 'From: ' . $from;
  if ($replyTo !== '') $headers[] = 'Reply-To: ' . $replyTo;
  if ($cc !== '')      $headers[] = 'Cc: ' . $cc;

  $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

  return mail($to, $encodedSubject, $body, implode("\r\n", $headers));
};

// Addresses
$adminTo = 'info@annia.no';
$adminCc = 'systemthinking@annia.no';

// Use a branded From for better deliverability (you can change the display name)
$fromBranded = 'SystemThinking (ANNiA) <systemthinking@annia.no>';

// --------------------
// 1) Internal email (Admin)
// --------------------
$adminSubject = ($language === 'en')
  ? 'Quick request — SystemThinking'
  : 'Solicitud rápida — SystemThinking';

$adminBody  = ($language === 'en') ? "New quick request\n" : "Nueva solicitud rápida\n";
$adminBody .= "Name: " . ($name ?: '(not provided)') . "\n";
$adminBody .= "Email: " . $email . "\n";
if ($role !== '')     $adminBody .= (($language === 'en') ? "Role / Organization: " : "Rol / Organización: ") . $role . "\n";
if ($interest !== '') $adminBody .= (($language === 'en') ? "Interest type: " : "Tipo de interés: ") . $interest . "\n";
if ($message !== '')  $adminBody .= (($language === 'en') ? "Message: " : "Mensaje: ") . $message . "\n";
$adminBody .= "IP: " . $ip . "\n";

// Optional: keep payload for a few days, then remove
$adminBody .= "\n---- Payload received ----\n";
foreach ($data as $k => $v) {
  if (is_array($v)) $v = json_encode($v, JSON_UNESCAPED_UNICODE);
  $adminBody .= $k . ": " . (string)$v . "\n";
}

$adminSent = $sendMail($adminTo, $adminSubject, $adminBody, $fromBranded, $email, $adminCc);
if (!$adminSent) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => ($language === 'en' ? 'Could not send' : 'No se pudo enviar')], JSON_UNESCAPED_UNICODE);
  exit;
}

// --------------------
// 2) User confirmation (Executive-program style, based on interest)
// --------------------
$interestNorm = mb_strtolower(trim($interest), 'UTF-8');

$interestKey = 'press';
if ($interestNorm === 'participación individual' || $interestNorm === 'participacion individual') {
  $interestKey = 'individual';
} elseif ($interestNorm === 'inscripción de equipo' || $interestNorm === 'inscripcion de equipo') {
  $interestKey = 'team';
} elseif ($interestNorm === 'alianza institucional') {
  $interestKey = 'institution';
} else {
  // "Prensa u otro" or anything else
  $interestKey = 'press';
}

if ($language === 'en') {

  $userSubjectMap = [
    'individual'  => 'SystemThinking — Individual Participation (confirmation)',
    'team'        => 'SystemThinking — Team Enrollment (confirmation)',
    'institution' => 'SystemThinking — Institutional Partnership (confirmation)',
    'press'       => 'SystemThinking — Message received (confirmation)',
  ];

  $copyMap = [
    'individual' =>
      "Thank you for your interest in SystemThinking.\n\n"
      . "We’ve received your request for individual participation. You’ll hear from us shortly with an executive overview of the program and recommended next steps for enrollment.\n\n"
      . "SystemThinking is designed as an executive learning experience—helping leaders develop systemic perspective, strategic clarity, and practical decision frameworks.\n",

    'team' =>
      "Thank you for your interest in enrolling your team in SystemThinking.\n\n"
      . "We’ve received your request. Next, we’ll contact you to understand your context (team size, priorities, and timing) and share an executive overview with implementation options.\n\n"
      . "SystemThinking can be delivered as a cohort experience, a tailored leadership track, or a focused intervention aligned to your organization’s needs.\n",

    'institution' =>
      "Thank you for reaching out about an institutional partnership with SystemThinking.\n\n"
      . "We’ve received your request. We’ll contact you shortly to explore collaboration models, alignment with your institution’s goals, and potential formats.\n\n"
      . "We look forward to building a partnership grounded in rigor, impact, and long-term capability development.\n",

    'press' =>
      "Thank you for contacting us about SystemThinking.\n\n"
      . "We’ve received your message and will respond shortly.\n\n"
      . "If you’re reaching out for press, interviews, or collaborations, please include any relevant deadlines or context in your reply.\n",
  ];

  $userSubject = $userSubjectMap[$interestKey] ?? 'SystemThinking — Confirmation';
  $userBody =
    "Hi " . ($name ?: "") . ",\n\n"
    . ($copyMap[$interestKey] ?? $copyMap['press'])
    . "\n"
    . ($interest !== '' ? "Interest type: $interest\n" : "")
    . ($role !== '' ? "Role / Organization: $role\n" : "")
    . "\nYou can reply to this email to add context.\n\n"
    . "— ANNiA / SystemThinking\nhttps://annia.no\n";

} else {

  $userSubjectMap = [
    'individual'  => 'SystemThinking — Participación individual (confirmación)',
    'team'        => 'SystemThinking — Inscripción de equipo (confirmación)',
    'institution' => 'SystemThinking — Alianza institucional (confirmación)',
    'press'       => 'SystemThinking — Solicitud recibida (confirmación)',
  ];

  $copyMap = [
    'individual' =>
      "Gracias por tu interés en SystemThinking.\n\n"
      . "Hemos recibido tu solicitud de participación individual. Pronto te contactaremos con el resumen ejecutivo del programa y los próximos pasos recomendados para tu inscripción.\n\n"
      . "SystemThinking está diseñado como una experiencia ejecutiva de aprendizaje: desarrolla perspectiva sistémica, claridad estratégica y marcos prácticos para tomar decisiones.\n",

    'team' =>
      "Gracias por tu interés en inscribir a tu equipo en SystemThinking.\n\n"
      . "Hemos recibido tu solicitud. El siguiente paso es contactarte para entender el contexto (tamaño del equipo, prioridades y tiempos) y compartirte el resumen ejecutivo con opciones de implementación.\n\n"
      . "SystemThinking puede impartirse como cohorte, como track de liderazgo a la medida o como intervención focalizada según las necesidades de tu organización.\n",

    'institution' =>
      "Gracias por tu interés en explorar una alianza institucional con SystemThinking.\n\n"
      . "Hemos recibido tu solicitud. Pronto te contactaremos para explorar modelos de colaboración, alineación con los objetivos de tu institución y posibles formatos.\n\n"
      . "Nos entusiasma construir una colaboración con rigor, impacto y desarrollo de capacidades a largo plazo.\n",

    'press' =>
      "Gracias por escribirnos sobre SystemThinking.\n\n"
      . "Hemos recibido tu mensaje y responderemos pronto.\n\n"
      . "Si es una solicitud de prensa, entrevista o colaboración, por favor comparte cualquier fecha límite o contexto adicional en tu respuesta.\n",
  ];

  $userSubject = $userSubjectMap[$interestKey] ?? 'SystemThinking — Confirmación';
  $userBody =
    "Hola " . ($name ?: "") . ",\n\n"
    . ($copyMap[$interestKey] ?? $copyMap['press'])
    . "\n"
    . ($interest !== '' ? "Tipo de interés: $interest\n" : "")
    . ($role !== '' ? "Rol / Organización: $role\n" : "")
    . "\nPuedes responder a este correo para agregar contexto.\n\n"
    . "— ANNiA / SystemThinking\nhttps://annia.no\n";
}

// Send confirmation to user
$userSent = $sendMail($email, $userSubject, $userBody, $fromBranded, 'systemthinking@annia.no', '');

// Return debug flag to help you verify deliverability from the frontend network tab
echo json_encode(['ok' => true, 'user_confirmation_sent' => (bool)$userSent], JSON_UNESCAPED_UNICODE);