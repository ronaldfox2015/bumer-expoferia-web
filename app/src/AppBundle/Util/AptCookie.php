<?php

namespace AppBundle\Util;

/**
 * Class AptCookie
 *
 * @package AppBundle\Util
 * @author Jairo Rojas <jairo.rojas@metricaandina.com>
 * @copyright (c) 2018, Orbis
 */
class AptCookie
{
    private static $path = '/';
    private static $domain = '.aptitus.com';
    const DISCOUNT_COOKIE_NAME = 'showModalDiscount';

    /**
     * @param $name
     * @param $value
     * @param $expires 24 * 60 * 60 => 1 dia
     */
    public static function set($name, $value, $expires = 86400)
    {
        $expires += time();
        setcookie($name, $value, $expires, self::$path, self::$domain);
    }

    /**
     * @param $name
     * @param array $data
     * @param int $expires 24 * 60 * 60 => 1 dia
     */
    public static function setArray($name, array $data, $expires = 86400)
    {
        $value = json_encode($data);
        self::set($name, $value, $expires);
    }

    /**
     * @param string $name
     * @param null $default
     * @return mixed|null
     */
    public static function get($name, $default = null)
    {
        if (self::exist($name)) {
            return $_COOKIE[$name];
        }

        return $default;
    }

    /**
     * @param $name
     * @param null $default
     * @return array|null
     */
    public static function getArray($name, $default = null)
    {
        $data = self::get($name);
        if (is_null($data)) {
            return $default;
        }
        return json_decode($data, true);
    }

    /**
     * @param string $name
     * @return bool
     */
    public static function exist($name)
    {
        if (empty($_COOKIE)) {
            return false;
        }

        if (isset($_COOKIE[$name])) {
            return true;
        }

        return false;
    }

    /**
     * @param $name
     */
    public static function destroy($name)
    {
        setcookie($name, null, -1, self::$path, self::$domain);
    }
}