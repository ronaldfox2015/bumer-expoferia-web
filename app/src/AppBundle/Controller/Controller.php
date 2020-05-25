<?php

namespace AppBundle\Controller;

use AppBundle\Auth\CrossSessionAuthentifier;
use Symfony\Bundle\FrameworkBundle\Controller\Controller as BaseController;
use Symfony\Component\Validator\ConstraintViolationList;

/**
 * Class Controller
 *
 * @package AppBundle\Controller
 * @author Andy Ecca <andy.ecca@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class Controller extends BaseController
{
    /**
     * @return CrossSessionAuthentifier
     */
    public function getAuth()
    {
        /** @var CrossSessionAuthentifier $sessionAuth */
        $sessionAuth = $this->get(CrossSessionAuthentifier::class);
        return $sessionAuth;
    }

    public function getAccessToken()
    {
        return $this->getAuth()->getAccessToken()->getToken();
    }

    public function getAccessTokenValidated()
    {
        if ($this->isLoggedIn()) {
            return $this->getUserAccessToken();
        } else {
            return $this->getAccessToken();
        }
    }

    public function isLoggedIn()
    {
        return $this->getAuth()->isLoggedIn();
    }

    public function getUserAccessToken()
    {
        return $this->getAuth()
            ->getUser()
            ->getAccessToken()
            ->getToken();
    }

    /**
     * @param $entity
     * @return ConstraintViolationList
     */
    public function validateEntity($entity)
    {
        $validator = $this->get('validator');
        return $validator->validate($entity);
    }

    /**
     * @param ConstraintViolationList $errors
     * @return array
     */
    public function getEntityConstraintList(ConstraintViolationList $errors)
    {
        $messages = [];

        foreach ($errors as $violation) {
            $messages[$violation->getPropertyPath()][] = $violation->getMessage();
        }

        return $messages;
    }

}