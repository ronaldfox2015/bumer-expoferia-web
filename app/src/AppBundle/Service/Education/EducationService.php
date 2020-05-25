<?php

namespace AppBundle\Service\Education;

use AppBundle\Service\AbstractHttpService;
use AppBundle\Service\Base\Enum\FairCategory;
use AppBundle\Service\Base\GoogleRecaptcha;
use AppBundle\Service\Base\SeoHead;
use AppBundle\Service\Base\Util\Util;
use AppBundle\Service\Education\Exception\EducationException;
use AppBundle\Service\Fair\StandService;
use AppBundle\Service\PaginationService;
use Aptitus\Common\Exception\Exception;
use Aptitus\Common\Util\Strings;
use GuzzleHttp\Client;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class EducationService
 *
 * @package AppBundle\Service\Education
 * @author Joseph Marcilla <jbmarflo@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class EducationService extends AbstractHttpService
{
    const PREVIEW_STATE = 'active';
    const TIME_SHOW_CAPTCHA = 4;

    protected $captcha;

    public function __construct(
        Client $client,
        GoogleRecaptcha $captcha,
        LoggerInterface $logger)
    {
        parent::__construct($client, $logger);

        $this->captcha = $captcha;
    }

    public function getBySlug($slug)
    {
        $id = Util::getIdJobBySlug($slug);

        return $this->getById($id);
    }

    public function getById($id)
    {
        try {
            $result = $this->client->get("education-records/$id", [
                'query' => [
                    'preview' => self::PREVIEW_STATE
                ]
            ]);

            $data = $this->decodeJson($result);

            return $this->formatDetail($data['data']);
        } catch (Exception $exception) {
            throw new EducationException('No se pudo obtener el detalle del aviso', 401, $exception);
        }
    }

    public function setLead($id, $body, $captchaResponse)
    {   
        try {
            $this->captcha->validate($captchaResponse, self::TIME_SHOW_CAPTCHA);
            ContactLead::save($body);
            return $this->postLead($body, $id);
        } catch (Exception $exception) {
            throw new EducationException($exception->getMessage(), JsonResponse::HTTP_BAD_REQUEST, $exception);
        }
    }

    public function postLead($body, $id)
    {
        try {
            $result = $this->client->post("education-records/$id/lead", [
                'json' => $body
            ]);

            $data = $this->decodeJson($result);

            return $data['data'];
        } catch (Exception $exception) {
            throw new EducationException('No se pudo registrar los datos.', JsonResponse::HTTP_UNAUTHORIZED, $exception);
        }
    }

    private function formatDetail(array $data)
    {
        $control = $data['control'];
        unset($data['control']);
        return [
            'data' => $data,
            'next' => $control['next'],
            'previous' => $control['previous']
        ];
    }

    public function getAll($params)
    {
        try {
            $result = $this->client->get("education-records", [
                'query' => $params
            ]);

            $result = $this->decodeJson($result);

            return $this->formatGetAll($result);
        } catch (Exception $exception) {
            throw new EducationException('No se pudo obtener las fichas educativas', 401, $exception);
        }
    }

    private function formatGetAll($data)
    {
        return [
            'total' => $data['data']['totalItemCount'],
            'pages' => $data['data']['pageCount'],
            'data' => isset($data['data']['items']) ? $data['data']['items'] : []
        ];
    }

    public function getDataViewStand(
        $params,
        $stand,
        $uri,
        $section,
        SeoHead $seoHead
    )
    {
        $data = $this->getAll($params);

        $paginator = new PaginationService(
            $data['total'],
            $params['page'],
            $params['limit'],
            10,
            $uri
        );

        $titles = $seoHead->getTitleSectionList($stand['company']['trade_name']);
        $descriptions = $seoHead->getDescriptionSectionList($stand['company']['trade_name'], 'opciones de estudios');

        return [
            'uri'        => $uri,
            'stand'      => $stand['configuration'],
            'company'    => $stand['company'],
            'records'    => $data,
            'query'      => ucfirst(Strings::sanitizeSearch($params['q'])),
            'paginate'   => $paginator->paginate(),
            'page_title' => $titles[$section],
            'page_description' => $descriptions[$section],
            'titles'     => $titles
        ];
    }
}