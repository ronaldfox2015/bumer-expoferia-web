<?php

namespace AppBundle\Service\Education;
use AppBundle\Service\Base\AppCookie;

/**
 * Class ContactLead
 *
 * @package AppBundle\Service\Education
 * @author Joseph Marcilla <jbmarflo@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class ContactLead
{
    const NAME_COOKIE_DEFAULT = 'contactLead';

    public static function save(array $data)
    {
        AppCookie::set(self::NAME_COOKIE_DEFAULT, self::formatData($data));
    }

    public static function formatData($data = null)
    {
        $values['name'] = isset($data['name']) ? $data['name'] : null;
        $values['email'] = isset($data['email']) ? $data['email'] : null;
        $values['phone'] = isset($data['phone']) ? $data['phone'] : null;

        return self::encrypt($values);
    }

    public static function get()
    {
        if (! AppCookie::exist(self::NAME_COOKIE_DEFAULT)) {
            return self::decrypt(self::formatData());
        }

        return self::decrypt(AppCookie::get(self::NAME_COOKIE_DEFAULT));
    }

    public static function getByKey($key)
    {
        return self::get()[$key];
    }

    public static function encrypt($data)
    {
        return base64_encode(json_encode($data));
    }

    public static function decrypt($data)
    {
        return json_decode(base64_decode($data));
    }
}