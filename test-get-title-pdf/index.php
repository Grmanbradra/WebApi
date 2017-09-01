<?php

// Include Composer autoloader if not already done.
include 'vendor/autoload.php';

// Parse pdf file and build necessary objects.
$parser = new \Smalot\PdfParser\Parser();
$pdf    = $parser->parseFile('files/test.pdf');

echo '<pre>';

// Retrieve all details from the pdf file.
$details  = $pdf->getDetails();

// Loop over each property to extract values (string or array).
foreach ($details as $property => $value) {
    if (is_array($value)) {
        $value = implode(', ', $value);
    }
    echo $property . ' => ' . $value . "\n";
}

echo '</pre>';
?>