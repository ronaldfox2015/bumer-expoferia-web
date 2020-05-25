<?php

namespace AppBundle\Service\Base\Enum;

/**
 * Class SponsorRuc
 *
 * @author Paul Taboada <pacharly89@gmail.com>
 * @package AppBundle\Service\Base\Enum
 * @copyright (c) 2017, Orbis
 */
class SponsorRuc
{
    const U_ESAN = '20136507720';
    const U_CONTINENTAL = '20319363221';
    const FIDE = '20465826160';

    public static function getAll()
    {
        return [self::U_ESAN, self::U_CONTINENTAL, self::FIDE];
    }
}