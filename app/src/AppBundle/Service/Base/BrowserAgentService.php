<?php

namespace AppBundle\Service\Base;

use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Class BrowserAgentService
 *
 * @package AppBundle\Service\Base
 * @author Pedro Vega Asto <pakgva@gmail.com>
 * @copyright 2017, Orbis
 */
class BrowserAgentService
{
    protected $deviceDetector;
    protected $userAgent;

    public function __construct(
        RequestStack $request
    ) {

        $request = $request->getCurrentRequest();
        $this->userAgent = $request->headers->get("User-Agent");
    }

    public function isIE()
    {
        return preg_match('/Trident\/\d{1,2}.\d{1,2}; rv:([0-9]*)/', $this->userAgent);
    }
}