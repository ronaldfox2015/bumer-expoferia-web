<?php

namespace AppBundle\Util;

/**
 * Class URL
 *
 * @package AppBundle\Util
 * @author Andy Ecca <andy.ecca@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class URL
{
    /**
     * Validate domain name
     *
     * @param $domainName
     * @return bool
     */
    public static function isValidDomainName(String $domainName): bool
    {
        return (preg_match("/^([a-z\d](-*[a-z\d])*)(\.([a-z\d](-*[a-z\d])*))*$/i", $domainName) //valid chars check
            && preg_match("/^.{1,253}$/", $domainName) //overall length check
            && preg_match("/^[^\.]{1,63}(\.[^\.]{1,63})*$/", $domainName)); //length of each label
    }

    /**
     * Validate if url contains valid domain name
     *
     * @param $url
     * @param $domainName
     * @return bool
     */
    public static function checkDomain($url, $domainName): bool
    {
        $url = parse_url($url);

        return strstr($url['host'], $domainName) !== FALSE;
    }
}