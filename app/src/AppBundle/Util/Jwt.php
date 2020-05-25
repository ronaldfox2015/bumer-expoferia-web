<?php

namespace AppBundle\Util;

use Firebase\JWT\JWT as FirebaseJWT;

/**
 * Class Jwt
 *
 * @package AppBundle\Util
 * @author Jairo Rojas <jairo.rojas@metricaandina.com>
 * @copyright (c) 2018, Orbis
 */
class Jwt
{
    static private $key = 'aptitus-9300539451';
    static private $encryptionAlgorithm = 'HS256';

    /**
     * @param array $data
     * @param int $ttl tiempo de vida ( en segundos ), por defecto dura 5 minutos
     * @return string
     */
    public static function encode(array $data, $ttl = 300)
    {
        $issuedAt = time();
        $notBefore = $issuedAt + FirebaseJWT::$leeway;
        $expire = $notBefore + $ttl;
        $token = array(
            'iat' => $issuedAt,
            'nbf' => $notBefore,
            'exp' => $expire,
            'data' => $data,
        );

        return FirebaseJWT::encode($token, self::$key, self::$encryptionAlgorithm);
    }

    public static function decode($jwt)
    {
        try {
            $decode = FirebaseJWT::decode($jwt, self::$key, array(self::$encryptionAlgorithm));
            $result = (array)$decode->data;
        } catch (\Exception $e) {
            throw new \Exception("no se pudo leer la información del token");
        }

        return $result;
    }
}