<?php

namespace AppBundle\Listener;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\Templating\EngineInterface;

/**
 * Class MaintenanceListener
 *
 * @package AppBundle\Listener
 * @author Pedro Vega Asto <pakgva@gmail.com>
 * @copyright 2017, (c) Orbis
 */
class MaintenanceListener
{
    protected $engine;
    protected $maintenance;

    public function __construct(
        EngineInterface $engine,
        bool $maintenance
    )
    {
        $this->engine = $engine;
        $this->maintenance = $maintenance;
    }

    public function onKernelRequest(GetResponseEvent $event)
    {
        if ($this->maintenance) {
            $content = $this->engine->render('::fair/close.html.twig');
            $event->setResponse(new Response($content, Response::HTTP_OK));
            $event->stopPropagation();
            return;
        }

    }
}