<?php

namespace AppBundle\Util;

/**
 * Class GraphQl
 * @package AppBundle\Util
 * @author Jairo Rojas <jairo.rafa.1997@gmail.com>
 * @copyright (c) 2019, Orbis
 */
class GraphQl
{
    public static function graphqlQuery($endpoint, $query, $variables = [], $token = null): array
    {
        try {
            $headers = ['Content-Type: application/json'];
            $variables['input']['password'] = $variables['input']['provider'] == 'facebook' ? 'facebook' : $variables['input']['password'];
            $data = ['query' => $query, 'variables' => $variables];

            $ch = curl_init($endpoint);

            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

            $curl_response = curl_exec($ch);

            curl_close($ch);

            return json_decode($curl_response, true);
        } catch (\Exception $e) {
            throw new \Exception('Error de generación de token: ' . $e->getMessage());
        }
    }
}