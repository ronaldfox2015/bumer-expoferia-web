<?php

namespace AppBundle\Service\Base\Enum;

/**
 * Class Month
 *
 * @author Paul Taboada <pacharly89@gmail.com>
 * @package AppBundle\Service\Base\Enum
 * @copyright (c) 2017, Orbis
 */
class Month
{
    public static function getName($number)
    {
        return self::getList()[$number];
    }

    public static function getList()
    {
        return [
            1 => 'Enero',
            2 => 'Febrero',
            3 => 'Marzo',
            4 => 'Abril',
            5 => 'Mayo',
            6 => 'Junio',
            7 => 'Julio',
            8 => 'Agosto',
            9 => 'Septiembre',
            10 => 'Octubre',
            11 => 'Noviembre',
            12 => 'Diciembre',
        ];
    }
}