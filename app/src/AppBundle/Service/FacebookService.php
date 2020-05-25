<?php

namespace AppBundle\Service;

use Exception;
use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;
use Facebook\Facebook;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * Class FacebookService
 *
 * @package AppBundle\Service
 * @author Andy Ecca <andy.ecca@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class FacebookService
{
    const PROVIDER_NAME = 'facebook';

    protected $facebook;
    protected $router;
    protected $request;

    protected $accessToken;
    protected $authState;

    public function __construct(
        Facebook $facebook,
        UrlGeneratorInterface $router,
        RequestStack $requestStack
    )
    {
        $this->facebook = $facebook;
        $this->router = $router;
        $this->request = $requestStack->getCurrentRequest();
    }

    /**
     * @param string $nextUrl
     * @return string
     * @throws FacebookSDKException
     */
    public function getLoginUrl($nextUrl = '')
    {
        if (empty($nextUrl)) {
            $nextUrl = $this->request->getUri();
        }

        $redirectUrl = $this->router->generate('auth_facebook', [], UrlGeneratorInterface::ABSOLUTE_URL);
        $state = vsprintf('{st|%s,next|%s}', [
            $this->generatePersistentAuthState(),
            $this->encodeNextUri($nextUrl)
        ]);

        $this->setPersistentAuthState($state);

        return $this->getLoginHelper()->getLoginUrl($redirectUrl, ['email']);
    }

    public function getAccessToken()
    {
        try {
            if ($this->accessToken) {
               return $this->accessToken;
            }

            $this->accessToken = $this->getLoginHelper()
                ->getAccessToken()
                ->getValue();

            return $this->accessToken;

        } catch (FacebookResponseException $e) {
            throw new Exception('Graph returned an error: ' . $e->getMessage());
        } catch (Exception $e) {
            throw new Exception('Facebook SDK returned an error: ' . $e->getMessage());
        }
    }

    public function getUser($accessToken = null)
    {
        try {

            if (null === $accessToken) {
                $accessToken = $this->getAccessToken();
            }

            $response = $this->facebook->get(
                '/me?fields=id,name,email',
                $accessToken
            );

            return $response->getGraphUser();


        } catch (FacebookResponseException $e) {
            throw new Exception('Graph returned an error: ' . $e->getMessage());
        } catch (Exception $e) {
            throw new Exception('Facebook SDK returned an error: ' . $e->getMessage());
        }
    }

    public function getClient()
    {
        return $this->facebook;
    }

    private function getLoginHelper()
    {
        return $this->facebook->getRedirectLoginHelper();
    }

    public function encodeNextUri($url)
    {
        return base64_encode($url);
    }

    public function decodeNextUri($url)
    {
        return base64_decode($url);
    }

    /**
     * @return string
     * @throws FacebookSDKException
     */
    public function generatePersistentAuthState()
    {
        if (is_null($this->authState)) {
            $loginHelper = $this->getLoginHelper();
            $this->authState = $loginHelper->getPseudoRandomStringGenerator()->getPseudoRandomString($loginHelper::CSRF_LENGTH);
        }

        return $this->authState;
    }

    public function setPersistentAuthState($state)
    {
        $this->getLoginHelper()->getPersistentDataHandler()->set('state', $state);
    }

    public function getAuthStateParameters($state)
    {
        $state = str_replace(array('{','|', ',','}'), array('{"','":"', '","', '"}'), $state);
        return json_decode($state, true);
    }

    public function setInputAuthState($state)
    {
        $_GET['state'] = $state;
    }
}