<?php

namespace AppBundle\Auth;

use AppBundle\Auth\Adapter\AdapterInterface;
use AppBundle\Auth\Data\AccessToken;
use AppBundle\Auth\Data\User;
use AppBundle\Entity\Postulant\ProfileInformation;
use AppBundle\Service\Postulant\ProfileInformationValidator;

/**
 * Class Authentifier
 *
 * @package AppBundle\Auth
 * @author Andy Ecca <andy.ecca@gmail.com>
 * @copyright (c) 2017, Orbis
 */
abstract class Authentifier
{
    protected $authAdapter;

    public function __construct(AdapterInterface $authAdapter)
    {
        $this->authAdapter = $authAdapter;
    }

    public function getAccessToken(): AccessToken
    {
        return $this->authAdapter->requestAccessToken();
    }

    public function logout($accessToken)
    {
        $this->authAdapter->logout($accessToken);
    }

    public function login($email, $password, $role, $provider = null, $providerToken = null)
    {
        if ($this->isLoggedIn()) {
            return true;
        }

        $user = $this->authAdapter->login($email, $password, $role, $provider, $providerToken);

        $this->persistAuthentication($user);

        $this->generateToken($email, $password, $role, $provider);

        return true;
    }

    public function register(ProfileInformation $profileInformation)
    {
        return $this->authAdapter->register($profileInformation);
    }

    public function recoveryPassword($email, $role)
    {
        return $this->authAdapter->recoveryPassword($email, $role);
    }

    abstract public function getUser();
    abstract public function isLoggedIn();
    abstract public function persistAuthentication(User $user);
    abstract public function generateToken($email, $password, $role, $provider);
}