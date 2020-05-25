<?php

namespace AppBundle\Asset\Version;

use Symfony\Component\Asset\VersionStrategy\VersionStrategyInterface;

class LastCommitVersionStrategy implements VersionStrategyInterface
{
    /**
     * @var string
     */
    private $format;
    private $lastCommit;
    private $lastCommitFile;

    public function __construct(String $lastCommitFile, String $format = null)
    {
        $this->format = $format ?: '%s?%s';
        $this->lastCommitFile = $lastCommitFile;
    }

    public function getVersion($path)
    {
        if ($this->lastCommit) {
            return $this->lastCommit;
        }

        $this->lastCommit = file_get_contents($this->lastCommitFile);

        return $this->lastCommit;
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