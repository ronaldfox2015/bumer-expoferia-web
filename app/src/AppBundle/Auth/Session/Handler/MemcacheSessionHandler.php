<?php

namespace AppBundle\Auth\Session\Handler;

use AppBundle\Auth\Session\Util;
use Symfony\Component\HttpFoundation\Session\Storage\Handler\MemcacheSessionHandler as MemcacheHandler;

class MemcacheSessionHandler extends MemcacheHandler
{
    /**
     * {@inheritdoc}
     */
    public function read($sessionId)
    {
        if (empty($sessionId)) {
            return false;
        }

        $data = parent::read($sessionId);

        if (empty($data)) {
            return false;
        }

        return Util::session_decode($data);
    }

    /**
     * {@inheritdoc}
     */
    public function write($sessionId, $data)
    {
        return parent::write($sessionId, Util::session_encode($data));
    }
}