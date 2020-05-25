<?php

namespace AppBundle\Service\Postulant\Exception;

use Exception;

/**
 * Class StudyException
 * @package AppBundle\Service\Postulant\Exception
 * @author Alfredo Espiritu <alfredo.espiritu.m@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class StudyException extends Exception
{
    public function __construct($message = "La solicitud es invalida.", $code = 400)
    {
        parent::__construct($message, $code);
    }
}