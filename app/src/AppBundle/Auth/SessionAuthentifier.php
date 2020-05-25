<?php

namespace AppBundle\Auth;

use AppBundle\Auth\Adapter\AdapterInterface;
use AppBundle\Auth\Data\AccessToken;
use AppBundle\Auth\Data\User;
use AppBundle\Util\AptCookie;
use AppBundle\Util\Jwt;
use AppBundle\Util\Profile;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class SessionAuthentifier extends Authentifier
{
    const SESSION_POSTULANT = 'infPos';
    const APTITUS_AUTHORIZATION = 'aptAuth';
    protected $session;

    public function __construct(
        AdapterInterface $authAdapter,
        SessionInterface $session
    )
    {
        parent::__construct($authAdapter);

        $this->session = $session;
    }

    public function getAccessToken(): AccessToken
    {
        if($this->session->has('access_token')) {
            /** @var AccessToken $accessToken */
            $accessToken =  $this->session->get('access_token');

            if ($accessToken && !$accessToken->hasExpired()) {
                return $accessToken;
            }
        }

        $token = parent::getAccessToken();
        $this->session->set('access_token', $token);

        return $token;
    }

    public function logout($accessToken = null)
    {
        if($accessToken) {
            parent::logout($accessToken);
        }

        $this->session->remove('access_token');
        $this->session->remove('user');
    }

    /**
     * @return User
     */
    public function getUser()
    {
        return $this->session->get('user');
    }

    public function isLoggedIn()
    {
        return $this->session->has('user');
    }

    public function persistAuthentication(User $user)
    {
        $this->session->set('user', $user);
        $this->session->set('access_token', $user->getAccessToken());

        $jwtPostulant = Jwt::encode($user->getData());
        AptCookie::set(self::SESSION_POSTULANT, $jwtPostulant);
    }

    public function generateToken($email, $password, $role, $provider)
    {
        $authorization = $this->authAdapter->authorize($email, $password, Profile::getRole($role), $provider);
        AptCookie::set(self::APTITUS_AUTHORIZATION, $authorization['token']);
    }
}