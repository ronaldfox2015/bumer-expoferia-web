<?php

namespace AppBundle\Service\Base;

use ReCaptcha\ReCaptcha;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

/**
 * Class GoogleRecaptcha
 *
 * @package AppBundle\Service\Base
 * @author Joseph Marcilla <jbmarflo@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class GoogleRecaptcha
{
    const NAME_COOKIE_DEFAULT = 'timeReCaptcha';

    private $secretKey;
    private $siteKey;
    /** @var ReCaptcha  */
    private $recaptcha;
    private $ip;

    public function __construct($secretKey, $siteKey = null)
    {
        $this->secretKey = $secretKey;
        $this->siteKey = $siteKey;
        $this->recaptcha = new ReCaptcha($secretKey);
        $this->ip = $_SERVER["REMOTE_ADDR"];
    }

    public function getSecretKey()
    {
        return $this->secretKey;
    }

    public function getSiteKey()
    {
        return $this->siteKey;
    }

    public static function getCookieTime()
    {
        if (! AppCookie::exist(self::NAME_COOKIE_DEFAULT)) {
            return 0;
        }

        return (int) AppCookie::get(self::NAME_COOKIE_DEFAULT);
    }

    public static function useCaptcha($timeAppear = 0)
    {
        return self::getCookieTime() > 0
        && $timeAppear != 0
        && self::getCookieTime() % $timeAppear == 0;
    }

    public static function addCountTimeCookie()
    {
        AppCookie::set(self::NAME_COOKIE_DEFAULT, self::getCookieTime() + 1);
    }

    public function validate($response, $timeAppear = 0)
    {
        self::addCountTimeCookie();

        if (self::useCaptcha($timeAppear)) {
            $verification = $this->recaptcha->verify($response, $this->ip);

            if (!$verification->isSuccess()) {
                throw new BadRequestHttpException('Captcha inválido.');
            }
        }
    }
}