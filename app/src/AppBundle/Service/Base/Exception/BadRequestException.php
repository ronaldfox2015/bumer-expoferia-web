<?php

namespace AppBundle\Service\Base\Exception;

use Exception;

/**
 * Class BadRequestException
 * @package AppBundle\Service\Base\Exception
 * @author Alfredo Espiritu <alfredo.espiritu.m@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class BadRequestException extends Exception
{
    public function __construct($message = "La solicitud es invalida.", $code = 400)
    {
        parent::__construct($message, $code);
    }
}