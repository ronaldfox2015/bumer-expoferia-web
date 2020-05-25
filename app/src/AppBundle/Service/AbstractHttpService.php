<?php namespace AppBundle\Service;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Psr\Http\Message\ResponseInterface;
use Psr\Log\LoggerInterface;
use Exception;

/**
 * Class AbstractHttpService
 *
 * @package AppBundle\Service
 * @author Andy Ecca <andy.ecca@gmail.com>
 * @copyright (c) 2017, Orbis
 */
abstract class AbstractHttpService
{
    const BEARER = 'Bearer';

    protected $client;
    protected $logger;

    public function __construct(
        Client $client,
        LoggerInterface $logger = null)
    {
        $this->client = $client;
        $this->logger = $logger;
    }

    public function setClient(Client $client)
    {
        $this->client = $client;
    }

    public function decodeJson(ResponseInterface $response, bool $asArray = true)
    {
        return json_decode($response->getBody()->getContents(), $asArray);
    }

    /**
     * Metodo que se encarga de parsear las excepciones del servicio.
     *
     *  - Si el servicio retorna errores personalizados, estos se tienen que mostrar.
     *  - En el caso que el error no se encuentre mapeado, se devuelve
     *    un mensaje por defecto.
     *
     * @param Exception $ex
     * @param String $defaultMessage
     * @param int $defaultCode
     * @return array
     */
    protected function parseException(
        Exception $ex,
        String $defaultMessage = 'Ocurrio un error inesperado. Intente nuevamente.',
        int $defaultCode = 500): array
    {
        $code = $defaultCode;
        $message = $defaultMessage;

        if ($ex instanceof RequestException) {
            /**
             * En caso que el servicio envie un mensaje personalizado.
             */
            $response = $ex->getResponse();
            $code = $response->getStatusCode();

            if (in_array($code, [400, 401, 403])) {
                $data    = json_decode($response->getBody()->getContents(), true);
                $message = $data['message'];
                $code    = (int) $data['code'];
            }
        }

        return [$code, $message];
    }
}