<?php

use Symfony\Component\Dotenv\Dotenv;

$dotEnv = new Dotenv();

if(is_dir(dirname(__DIR__) . '/../config/')) {
    $envPath = dirname(__DIR__) . '/../config';
}else {
    $envPath = dirname(__DIR__) . '/config';
}

$localEnv = false;

foreach (glob($envPath . '/*.env') as $file) {

    if( '.env' === $file) {
        // En caso exista un archivo .env, se lee solo este.
        // ya que debe contener todas las configuraciones.
        $dotEnv->load($file);
        break;
    }

    if (0 !== strpos($file, 'local')) {
        // En caso exista un archivo local.env, este se lee al final
        // para poder sobre-escribir todos las configuraciones
        $localEnv = $file;
    }

    $dotEnv->load($file);
}

$localEnv && $dotEnv->load($localEnv);