<?php

namespace AppBundle\Controller;

use Symfony\Bundle\TwigBundle\Controller\ExceptionController as BaseExceptionController;
use Symfony\Component\Debug\Exception\FlattenException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Log\DebugLoggerInterface;

/**
 * Class ExceptionController
 *
 * @package AppBundle\Controller
 * @author Andy Ecca <andy.ecca@gmail.com>
 * @copyright (c) 2017, Orbis
 * @internal
 */
class ExceptionController extends BaseExceptionController
{
    /**
     * Action a ejecutar cuando ocurre una excepcion.
     *
     * Se hace un override a los errores del tipo 404, para poder lanzar una pagina customizada.
     * En otros casos, se ejecuta el flujo normal de symfony.
     *
     * @param Request $request
     * @param FlattenException $exception
     * @param DebugLoggerInterface|null $logger
     * @return Response
     */
    public function showExceptionAction(Request $request, FlattenException $exception, DebugLoggerInterface $logger = null)
    {
        $code = $exception->getStatusCode();
        $currentContent = $this->getAndCleanOutputBuffering($request->headers->get('X-Php-Ob-Level', -1));

        if (404 === $code) {
            return new Response($this->twig->render(
                'exception/error404.html.twig',
                array(
                    'status_code' => $code,
                    'status_text' => isset(Response::$statusTexts[$code]) ? Response::$statusTexts[$code] : '',
                    'exception' => $exception,
                    'logger' => $logger,
                    'currentContent' => $currentContent,
                )
            ), 200, array('Content-Type' => $request->getMimeType($request->getRequestFormat()) ?: 'text/html'));
        }

        return parent::showAction($request, $exception, $logger);
    }
}