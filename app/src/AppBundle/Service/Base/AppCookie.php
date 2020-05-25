<?php

namespace AppBundle\Service\Base;

/**
 * Class AppCookie
 *
 * @package AppBundle\Service\Base
 * @author Joseph Marcilla <jbmarflo@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class AppCookie
{
    const EXPIRE_TIME = 86400;

    private static $path = '/';
    private static $domain = '.aptitus.com';

    /**
     * @param $name
     * @param $value
     * @param $expires
     */
    public static function set($name, $value, $expires = self::EXPIRE_TIME)
    {
        $expires += time();
        setcookie($name, $value, $expires, self::$path, self::$domain);
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
        unset($_COOKIE[$name]);
    }
}