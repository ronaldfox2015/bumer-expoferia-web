<?php

namespace AppBundle\Service\Postulant;

use AppBundle\Service\AbstractHttpService;
use AppBundle\Service\Postulant\Exception\UserException;
use Exception;

/**
 * Class UserService
 *
 * @package AppBundle\Service\Postulant
 * @author Ronald Cutisaca Ramirez <ronaldfox_17@hotmail.com>
 * @copyright (c) 2017, Orbis
 */
class UserService extends AbstractHttpService
{

    public function getByEmailAndRole($email, $role)
    {
        try {

            $response = $this->client->get("/users?email={$email}&role={$role}");
            return $this->decodeJson($response);

        } catch (Exception $exception) {

            list($code, $message) = $this->parseException($exception, 'No existe un usuario con el email solicitado');
            throw new UserException($message, $code);

        }
    }
}