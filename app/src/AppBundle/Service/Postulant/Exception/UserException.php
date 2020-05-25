<?php

namespace AppBundle\Service\Postulant\Exception;
use Exception;

/**
 * Class UserException
 *
 * @package AppBundle\Service\Postulant\Exception
 * @author Ronald Cutisaca Ramirez <ronaldfox_17@hotmail.com>
 * @copyright (c) 2017, Orbis
 */
class UserException extends Exception
{
    public function __construct($message = "La solicitud es invalida.", $code = 400)
    {
        parent::__construct($message, $code);
    }
}