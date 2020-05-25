<?php

namespace AppBundle\Util;

/**
 * Class Profile
 * @package AppBundle\Util
 * @author Jairo Rojas <jairo.rafa.1997@gmail.com>
 * @copyright (c) 2019, Orbis
 */
class Profile
{
    const APPLICANT = 'postulante';
    const COMPANY = 'empresa';
    const COMPANY_ADMIN = 'empresa-admin';
    const ADMIN = 'admin-master';
    const ADMIN_CALLCENTER = 'admin-callcenter';
    const ADMIN_MODERATOR = 'admin-moderador';
    const ADMIN_SUPPORT = 'admin-soporte';
    const ADMIN_TYPESETTER = 'admin-digitador';
    const USER_INSTITUTION = 'institucion-usuario';
    const ADMIN_INSTITUTION = 'institucion-admin';

    public static function getRole($value)
    {
        $roles = array(
            self::APPLICANT => 'applicant'
        );

        return $roles[$value];
    }
}