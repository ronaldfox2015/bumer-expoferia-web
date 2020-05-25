<?php

namespace AppBundle\Asset\Version;

use Symfony\Component\Asset\VersionStrategy\VersionStrategyInterface;

class TimestampVersionStrategy implements VersionStrategyInterface
{
    /**
     * @var string
     */
    private $format;


    /**
     * @param string|null $format
     */
    public function __construct($format = null)
    {
        $this->format = $format ?: '%s?%s';
    }

    public function getVersion($path)
    {
        return time();
    }

    public function applyVersion($path)
    {
        $version = $this->getVersion($path);

        if ('' === $version) {
            return $path;
        }

        $versionized = sprintf($this->format, ltrim($path, '/'), $version);

        if ($path && '/' === $path[0]) {
            return '/'.$versionized;
        }

        return $versionized;
    }
}