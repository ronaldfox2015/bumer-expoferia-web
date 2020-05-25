<?php

namespace AppBundle\Service\Base\Exception;

use Exception;

/**
 * Class UnauthorizedException
 * @package AppBundle\Service\Base\Exception
 * @author Alfredo Espiritu <alfredo.espiritu.m@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class UnauthorizedException extends Exception
{
    public function __construct($message = "La solicitud no está autorizada.", $code = 401)
    {
        parent::__construct($message, $code);
    }
}