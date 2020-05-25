<?php

namespace AppBundle\Service\Base;

use AppBundle\Service\AbstractHttpService;
use AppBundle\Service\Base\Exception\BaseException;
use Exception;

/**
 * Class BaseService
 *
 * @package AppBundle\Service\Base
 * @author Pedro Vega Asto <pakgva@gmail.com>
 * @copyright 2017, Orbis
 */
class BaseService extends AbstractHttpService
{
    /**
     * Listar paises
     *
     * @return array
     */
    public function countries()
    {
        try {
            $result = $this->client->get('countries');

            return $this->decodeJson($result)['data'];
        } catch (Exception $ex) {
            list($code, $message) = $this->parseException($ex, 'No se pudo obtener los paises');

            throw new BaseException($message, $ex, $code);
        }
    }

    /**
     * Buscar ciudades
     *
     * @param $query
     * @param $accessToken
     * @return array
     */
    public function searchLocations($query, $accessToken)
    {
        try {
            $result = $this->client->get('locations', [
                'headers' => [
                    'Authorization' => "Bearer $accessToken"
                ],
                'query' => [
                    'q' => $query
                ]
            ]);

            return $this->decodeJson($result)['data'];
        } catch (Exception $ex) {
            list($code, $message) = $this->parseException($ex, 'No se pudo buscar la ubicación');

            throw new BaseException($message, $ex, $code);
        }
    }

    /**
     * Buscar ciudades
     *
     * @param $query
     * @param $accessToken
     * @return array
     */
    public function searchInstitutions($query, $accessToken)
    {
        try {
            $result = $this->client->get('institutions', [
                'headers' => [
                    'Authorization' => "Bearer $accessToken"
                ],
                'query' => [
                    'q' => $query
                ]
            ]);

            return $this->decodeJson($result)['data'];
        } catch (Exception $ex) {
            list($code, $message) = $this->parseException($ex, 'No se pudo buscar la institución');

            throw new BaseException($message, $ex, $code);
        }
    }

    public function getGrades()
    {
        try {
            $result = $this->client->get('grades');
            $dataSetOrdered = $this->orderGrades($this->decodeJson($result)['data']);
            return $dataSetOrdered;
        } catch (Exception $ex) {
            list($code, $message) = $this->parseException($ex, 'No se pudo mostrar los grados');
            throw new BaseException($message, $ex, $code);
        }
    }

    private function orderGrades($data){
        $listOrdered = [];
        $quantity = count($data);
        foreach($data as $key => $value) {
            switch ($value['id']) {
                case 10 :
                    $listOrdered[1] = $value;
                    break;
                case 8 :
                    $listOrdered[2] = $value;
                    break;
                case 13 :
                    $listOrdered[3] = $value;
                    break;
                case 4 :
                    $listOrdered[4] = $value;
                    break;
                case 3 :
                    $listOrdered[5] = $value;
                    break;
                case 2 :
                    $listOrdered[6] = $value;
                    break;
                default :
                    $quantity++;
                    $listOrdered[$quantity] = $value;
                    break;
            }
        }
        ksort($listOrdered);
        $listOrdered = array_values($listOrdered);
        return $listOrdered;
    }

    public function searchCareers($query, $accessToken)
    {
        try {
            $result = $this->client->get('careers', [
                'headers' => [
                    'Authorization' => "Bearer $accessToken"
                ],
                'query' => [
                    'q' => $query
                ]
            ]);

            return $this->decodeJson($result)['data'];
        } catch (Exception $ex) {
            list($code, $message) = $this->parseException($ex, 'No se pudo buscar la carrera');
            throw new BaseException($message, $ex, $code);
        }
    }

    public function searchPositions($query, $accessToken)
    {
        try {
            $result = $this->client->get('positions', [
                'headers' => [
                    'Authorization' => "Bearer $accessToken"
                ],
                'query' => [
                    'q' => $query
                ]
            ]);

            return $this->decodeJson($result)['data'];
        } catch (Exception $ex) {
            list($code, $message) = $this->parseException($ex, 'No se pudo buscar el puesto');
            throw new BaseException($message, $ex, $code);
        }
    }

    public function getLevels()
    {
        try {
            $result = $this->client->get('levels');
            $dataSetOrdered = $this->orderGrades($this->decodeJson($result)['data']);
            return $dataSetOrdered;
        } catch (Exception $ex) {
            list($code, $message) = $this->parseException($ex, 'No se pudo mostrar los niveles de puesto');
            throw new BaseException($message, $ex, $code);
        }
    }

    public function getAreas()
    {
        try {
            $result = $this->client->get('areas');
            $dataSetOrdered = $this->orderGrades($this->decodeJson($result)['data']);
            return $dataSetOrdered;
        } catch (Exception $ex) {
            list($code, $message) = $this->parseException($ex, 'No se pudo mostrar las áreas');
            throw new BaseException($message, $ex, $code);
        }
    }

    public function getAptitusHost()
    {
        return getenv('APP_HOST');
    }
}