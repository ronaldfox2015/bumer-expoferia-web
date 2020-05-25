<?php

namespace AppBundle\Auth;

use AppBundle\Auth\Adapter\AdapterInterface;
use AppBundle\Auth\Data\AccessToken;
use AppBundle\Auth\Data\User;
use Exception;
use SessionHandlerInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Class SSOAuthentifier
 *
 * @package AppBundle\Auth
 * @author Andy Ecca <andy.ecca@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class CrossSessionAuthentifier extends SessionAuthentifier
{
    /**
     * @var string Nombre compartido de la variable de session
     */
    protected $sessName = 'oauth2';
    protected $crossSessionStorage;

    /**
     * @var string Identificador de la session actual.
     */
    protected $sessionId;

    /**
     * CrossSessionAuthentifier constructor.
     *
     * @param AdapterInterface $authAdapter Adaptador de Authenticacion.
     *
     * @param SessionInterface $session Adaptador de la sesion del sitio.
     *
     * @param SessionHandlerInterface $crossSessionStorage Adaptador del storage de la sesion compartida.
     *
     */
    public function __construct(
        AdapterInterface $authAdapter,
        SessionInterface $session,
        SessionHandlerInterface $crossSessionStorage
    )
    {
        parent::__construct($authAdapter, $session);

        if (!$this->session->isStarted()) {
            $this->session->start();
        }

        $this->sessionId = $session->getId();
        $this->crossSessionStorage = $crossSessionStorage;
    }

    /**
     * {@inheritdoc}
     */
    public function getAccessToken(): AccessToken
    {
        return parent::getAccessToken();
    }

    /**
     * {@inheritdoc}
     */
    public function isLoggedIn()
    {
        if (parent::isLoggedIn() && null !== $this->getUser()) {
            return true;
        }

        $session = $this->getCrossSession();

        if (empty($session[$this->sessName])) {
            return false;
        }

        $data = $session[$this->sessName];

        if (!isset($data['access_token'])) {
            return false;
        }

        $this->setUser($data);

        return true;
    }

    public function setUser($data)
    {
        $this->persistAuthentication(User::fromData($data));
    }

    /**
     * {@inheritdoc}
     */
    public function getUser()
    {
        return parent::getUser();
    }

    /**
     * {@inheritdoc}
     */
    public function login($email, $password, $role, $provider = null, $providerToken = null)
    {
        try {
            $login = parent::login($email, $password, $role, $provider, $providerToken);

            $data = $this->getCrossSession();
            $data[$this->sessName] = $this->getUser()->toArray();

            $this->crossSessionStorage->write($this->sessionId, $data);

            return $login;

        } catch (Exception $ex) {
            throw  $ex;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function logout($accessToken = null)
    {
        parent::logout($accessToken);

        $this->crossSessionStorage->destroy($this->sessionId);
    }

    /**
     * @return array|string
     */
    private function getCrossSession()
    {
        return $this->crossSessionStorage->read($this->sessionId);
    }
}