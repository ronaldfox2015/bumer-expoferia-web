<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Debug\Debug;

/** @var \Composer\Autoload\ClassLoader $loader */
$loader = require __DIR__.'/../vendor/autoload.php';
Debug::enable();

require 'env-params.php';

$kernel = new AppKernel('dev', true);
if (PHP_VERSION_ID < 70000) {
    $kernel->loadClassCache();
}

$request = Request::createFromGlobals();
Request::setTrustedProxies(
    ['127.0.0.1', $request->server->get('REMOTE_ADDR')]
);

$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
