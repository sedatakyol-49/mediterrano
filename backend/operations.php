<?php
declare(strict_types=1);

function operationsDocument(): array
{
    $empty = json_encode(['labels' => [], 'offers' => [], 'employees' => [], 'shifts' => []]);
    $db = database();
    $sql = $db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite'
        ? 'INSERT OR IGNORE INTO cms_documents (scope, revision, payload, updated_at) VALUES (?, 1, ?, ?)'
        : 'INSERT IGNORE INTO cms_documents (scope, revision, payload, updated_at) VALUES (?, 1, ?, ?)';
    $db->prepare($sql)->execute(['operations', $empty, gmdate('c')]);
    return document('operations');
}
function opNumber(array $row, string $key, float $min, float $max, bool $integer = false, bool $nullable = false): int|float|null
{
    $value = $row[$key] ?? null;
    if ($nullable && $value === null) return null;
    if ((!is_int($value) && !is_float($value)) || !is_finite((float)$value) || $value < $min || $value > $max || ($integer && !is_int($value))) {
        throw new InvalidArgumentException('Ungültige Zahl: ' . $key);
    }
    return $value;
}
function opEnum(array $row, string $key, array $allowed): string
{
    $value = $row[$key] ?? null;
    if (!in_array($value, $allowed, true)) throw new InvalidArgumentException('Ungültige Auswahl: ' . $key);
    return $value;
}
function opDate(array $row, string $key, bool $optional = false, bool $time = false): string
{
    $value = textField($row, $key, 16, !$optional);
    if ($optional && $value === '') return '';
    $format = $time ? 'Y-m-d\TH:i' : 'Y-m-d';
    $date = DateTimeImmutable::createFromFormat('!' . $format, $value, new DateTimeZone('UTC'));
    if (!$date || $date->format($format) !== $value) throw new InvalidArgumentException('Ungültiges Datum: ' . $key);
    return $value;
}
function opRows(array $data, string $key, int $max): array
{
    $rows = $data[$key] ?? null;
    if (!is_array($rows) || !array_is_list($rows) || count($rows) > $max) throw new InvalidArgumentException('Ungültiger Bereich: ' . $key);
    $ids = [];
    foreach ($rows as $row) {
        if (!is_array($row)) throw new InvalidArgumentException('Ungültiger Eintrag.');
        $id = identifier($row);
        if (isset($ids[$id])) throw new InvalidArgumentException('Doppelte Kennung.');
        $ids[$id] = true;
    }
    return $rows;
}
function validateOperations(array $data, array $previous): array
{
    $result = ['labels' => [], 'offers' => [], 'employees' => [], 'shifts' => []];
    foreach (opRows($data, 'labels', 500) as $row) {
        $item = ['id' => identifier($row)];
        foreach (['productId'=>100, 'name'=>200, 'subtitle'=>200, 'batch'=>100, 'ingredients'=>2500, 'allergens'=>1000, 'storage'=>500, 'nutrition'=>1000, 'origin'=>300] as $key=>$max) $item[$key] = textField($row, $key, $max, $key === 'name');
        $item['layout'] = opEnum($row, 'layout', ['package','counter','detail']);
        $item['unit'] = opEnum($row, 'unit', ['g','ml','Stück']);
        $item['priceBasis'] = opEnum($row, 'priceBasis', ['package','100g','100ml','piece']);
        $item['priceCents'] = opNumber($row, 'priceCents', 0, 10000000, true, true);
        $item['quantity'] = opNumber($row, 'quantity', 0.001, 100000, false, true);
        $item['bestBefore'] = opDate($row, 'bestBefore', true);
        $item['image'] = mediaPath(textField($row, 'image', 500));
        $result['labels'][] = $item;
    }
    $oldOffers = array_column($previous['offers'], null, 'id');
    // Keep old offer numbers stable; assign collision-free sequence numbers server-side.
    $sequence = (int)($previous['offerSequence'] ?? 0);
    foreach (opRows($data, 'offers', 500) as $row) {
        $id = identifier($row);
        $item = ['id'=>$id, 'number'=>$oldOffers[$id]['number'] ?? ('ANG-' . gmdate('Y') . '-' . str_pad((string)++$sequence, 5, '0', STR_PAD_LEFT))];
        foreach (['title'=>200,'customer'=>250,'address'=>1000,'email'=>190,'introduction'=>3000,'terms'=>3000,'notes'=>2000,'company'=>250,'companyAddress'=>1000,'companyContact'=>1000] as $key=>$max) $item[$key] = textField($row, $key, $max, $key === 'title');
        if ($item['email'] !== '' && !filter_var($item['email'], FILTER_VALIDATE_EMAIL)) throw new InvalidArgumentException('Ungültige Kunden-E-Mail.');
        foreach (['date','validUntil','eventDate'] as $key) $item[$key] = opDate($row, $key, $key !== 'date');
        if ($item['validUntil'] !== '' && $item['validUntil'] < $item['date']) throw new InvalidArgumentException('Die Gültigkeit liegt vor dem Angebotsdatum.');
        $item['guests'] = opNumber($row, 'guests', 0, 100000, true);
        $item['status'] = opEnum($row, 'status', ['draft','sent','accepted','declined','archived']);
        $item['priceMode'] = opEnum($row, 'priceMode', ['gross','net']);
        if (isset($row['showImages']) && !is_bool($row['showImages'])) throw new InvalidArgumentException('Ungültige Bildauswahl.');
        $item['showImages'] = $row['showImages'] ?? true;
        $item['lines'] = [];
        foreach (opRows($row, 'lines', 100) as $line) {
            $rate = opNumber($line, 'taxRate', 0, 100, false, true);
            $item['lines'][] = ['id'=>identifier($line), 'name'=>textField($line,'name',500,true), 'description'=>textField($line,'description',2000), 'image'=>mediaPath(textField($line,'image',500)), 'unit'=>textField($line,'unit',40,true), 'quantity'=>opNumber($line,'quantity',0.001,100000), 'unitCents'=>opNumber($line,'unitCents',0,10000000,true), 'taxRate'=>$rate];
        }
        if (in_array($item['status'], ['sent','accepted'], true) && ($item['customer'] === '' || !$item['lines'] || in_array(null, array_column($item['lines'], 'taxRate'), true))) throw new InvalidArgumentException('Kunde, Positionen und Steuersätze fehlen für diesen Angebotsstatus.');
        $result['offers'][] = $item;
    }
    $result['offerSequence'] = $sequence;
    foreach (opRows($data, 'employees', 200) as $row) {
        if (!is_bool($row['active'] ?? null)) throw new InvalidArgumentException('Ungültiger Personalstatus.');
        $result['employees'][] = ['id'=>identifier($row),'name'=>textField($row,'name',200,true),'role'=>textField($row,'role',150),'weeklyHours'=>opNumber($row,'weeklyHours',0,168),'active'=>$row['active']];
    }
    $employeeIds = array_column($result['employees'], 'id');
    $intervals = [];
    foreach (opRows($data, 'shifts', 5000) as $row) {
        $employeeId = identifier($row, 'employeeId');
        if (!in_array($employeeId, $employeeIds, true)) throw new InvalidArgumentException('Mitarbeiter nicht vorhanden.');
        $start = opDate($row,'start',false,true); $end = opDate($row,'end',false,true);
        $zone = new DateTimeZone('Europe/Berlin');
        $startDate = new DateTimeImmutable($start, $zone); $endDate = new DateTimeImmutable($end, $zone);
        if ($startDate->format('Y-m-d\TH:i') !== $start || $endDate->format('Y-m-d\TH:i') !== $end) throw new InvalidArgumentException('Diese Uhrzeit existiert wegen der Zeitumstellung nicht.');
        $minutes = ($endDate->getTimestamp() - $startDate->getTimestamp()) / 60;
        $pause = opNumber($row,'breakMinutes',0,1440,true);
        if ($minutes <= 0 || $minutes > 1440 || $pause >= $minutes) throw new InvalidArgumentException('Beginn, Ende oder Pause der Arbeitszeit sind ungültig.');
        $kind = opEnum($row,'kind',['planned','actual']);
        $group = $employeeId . ':' . $kind;
        foreach ($intervals[$group] ?? [] as [$otherStart,$otherEnd]) if ($start < $otherEnd && $end > $otherStart) throw new InvalidArgumentException('Überlappende Arbeitszeiten für denselben Mitarbeiter.');
        $intervals[$group][] = [$start,$end];
        $result['shifts'][] = ['id'=>identifier($row),'employeeId'=>$employeeId,'start'=>$start,'end'=>$end,'breakMinutes'=>$pause,'kind'=>$kind,'note'=>textField($row,'note',500)];
    }
    return $result;
}
