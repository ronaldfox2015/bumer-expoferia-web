<?php

namespace AppBundle\Service\Fair;

use Exception;

/**
 * Class FeedService
 *
 * @package AppBundle\Service\Fair
 * @author Alfredo Espiritu <alfredo.espiritu.m@gmail.com>
 * @copyright (c) 2018, Orbis
 */
class FeedService
{
    const FACEBOOK_FILE_NAME = 'fair-feed';

    protected $elementsUrl;

    public function __construct($elementsUrl)
    {
        $this->elementsUrl = $elementsUrl;
    }

    /**
     * @param $page
     * @param $outputFormat
     *
     * @return string
     */
    public function getFeedResourceUrl($page, $outputFormat)
    {
        return sprintf(
            '%s/%s-%s-%s.%s',
            $this->elementsUrl,
            self::FACEBOOK_FILE_NAME,
            $page,
            date('Y-m-d'),
            $outputFormat
        );
    }

    public function getFeedResourceContent($page, $outputFormat)
    {
        $content = '';

        try {
            return file_get_contents($this->getFeedResourceUrl($page, $outputFormat));
        } catch (Exception $ex) {
        }

        return $content;
    }
}
