<?php

namespace AppBundle\Service\Job;

use AppBundle\Service\AbstractHttpService;
use AppBundle\Service\Base\Enum\Month;
use AppBundle\Service\Base\Enum\OriginType;
use AppBundle\Service\Base\Util\Util;
use AppBundle\Service\Job\Exception\JobException;
use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use DateTime;

/**
 * Class JobService
 *
 * @author Paul Taboada <pacharly89@gmail.com>
 * @author Joseph Marcilla <jbmarflo@gmail.com>
 * @package AppBundle\Service\Job
 * @copyright (c) 2017, Orbis
 */
class JobService extends AbstractHttpService
{
    const ORIGIN_FAIR = 'feria';
    const BEARER = 'Bearer';
    const PREVIEW = 'active';
    const STAND_EXPOFERIA_SLUG = 'avisos-destacados';
    const ACTIVE_FAIR_EXTRACHARGE = 1;

    public function getBySlug($slug, $accessToken, $slugCompany)
    {
        $id = Util::getIdJobBySlug($slug);

        return $this->getById($id, $accessToken, $slugCompany);
    }

	public function getById($id, $accessToken, $slugCompany = '')
    {
        $queryParams = ['preview' => self::PREVIEW, 'origin' => OriginType::WEB];
        if ($slugCompany == self::STAND_EXPOFERIA_SLUG) {
            $queryParams['fair'] = self::ACTIVE_FAIR_EXTRACHARGE;
        }

        try {
            $result = $this->client->get("/jobs/$id", [
                'headers' => ['Authorization' => sprintf("%s %s", self::BEARER, $accessToken)],
                'query' => $queryParams
            ]);

            $data = $this->decodeJson($result);
            $data['data'] = $this->formatOfferDetail($data['data']);

            return $data;
        } catch (Exception $exception) {
            throw new JobException('No se pudo obtener el detalle del aviso', 401, $exception);
        }
    }

    private function formatOfferDetail($data)
    {
        $date = DateTime::createFromFormat("Y-m-d", $data['published_at']);
        $month = Month::getName((int)$date->format('m'));
        $data['published_at_format'] = strftime("%d/%m/%Y",$date->getTimestamp());
        $data['published_at_ago'] = 'Publicado '.$data['published_at_ago'];
        $data['requirements'] = [];

        foreach($data['studies'] as $studies) {
            $data['requirements'][] = $studies['requirement'];
        }
        foreach($data['other_studies'] as $otherStudies) {
            $data['requirements'][] = $otherStudies['requirement'];
        }
        foreach($data['experiences'] as $experiences) {
            $data['requirements'][] = $experiences['requirement'];
        }
        foreach($data['languages'] as $languages) {
            $data['requirements'][] = $languages['requirement'];
        }
        foreach($data['programs'] as $programs) {
            $data['requirements'][] = $programs['requirement'];
        }

        $hasQuestions = (count($data['questions']) > 0);
        $data['has_questions'] = $hasQuestions;
        $data['showModal'] = $data['applied'] ? 'g-btn--disabled' : ($hasQuestions ? 'js-open-questions': '');

        return $data;
    }

    /**
     * @param int $jobId
     * @param array $answers
     * @param string $accessToken
     * @param string|null $userAgent
     * @return mixed
     * @throws JobException
     */
    public function applyJob($jobId, $answers, $accessToken, $userAgent = null)
    {
        $headers =[];
        $headers['Authorization'] = sprintf('Bearer %s', $accessToken);

        if(! empty($userAgent)) {
            $headers['User-Agent'] = $userAgent;
        }

        try {
            $result = $this->client->post("jobs/$jobId/apply", [
                'headers' => $headers,
                'json' => [
                    'origin'  => self::ORIGIN_FAIR,
                    'answers' => $answers
                ]
            ]);

            return $this->decodeJson($result);
        }catch (Exception $ex) {
            list($code, $message) = $this->parseException($ex, 'No se pudo postular al aviso');

            throw new JobException($message, $code, $ex);
        }
    }

    /**
     * Compartir Aviso por correo.
     * @param $data
     * @return mixed
     * @throws JobException
     */
    public function shareEmailJob($data)
    {
        try {
            $result = $this->client->post($data['url'], [
                'headers' => ['X-Requested-With' => 'XMLHttpRequest'],
                'form_params' => $data
            ]);

            if (empty($result)) {
                throw new JobException('Error al compartir el aviso', JsonResponse::HTTP_BAD_REQUEST);
            }

            return $this->decodeJson($result);
        } catch (Exception $exception) {
            throw new JobException('No se pudo compartir el aviso', 401, $exception);
        }
    }

    /**
     * Dejar cv de postulante.
     * @param $companyId
     * @param $postulantId
     * @param $note
     * @param $accessToken
     * @return mixed
     * @throws JobException
     */
    public function receiveCV($companyId, $postulantId, $note, $accessToken)
    {
        try {
            $result = $this->client->post("/companies/$companyId/receive-cv", [
                'headers' => [
                    "Authorization" => "Bearer $accessToken"
                ],
                'json' => [
                    'note' => $note,
                    'postulant_id' => $postulantId,
                    'origin' => self::ORIGIN_FAIR
                ]
            ]);

            return $this->decodeJson($result);
        }catch (Exception $ex) {
            list($code, $message) = $this->parseException($ex, 'No se pudo dejar el cv correctamente');

            throw new JobException($message, $code, $ex);
        }
    }

    /**
     * Obtener empresa por RUC
     * @param $ruc
     * @param $accessToken
     * @return mixed
     * @throws JobException
     */
    public function getCompanyByRuc($ruc, $accessToken)
    {
        try {
            $result = $this->client->get("/companies/search", [
                'headers' => [
                    "Authorization" => "Bearer $accessToken"
                ],
                'query' => ['ruc'  => $ruc]
            ]);

            return $this->decodeJson($result);
        }catch (Exception $ex) {
            list($code, $message) = $this->parseException($ex, 'No se pudo obtener la empresa');

            throw new JobException($message, $code, $ex);
        }
    }

    /**
     * @param $postulantId
     * @param $accessToken
     * @param $hasExperience
     * @return mixed
     * @throws JobException
     */
    public function updateHasExperience($postulantId, $accessToken, $hasExperience)
    {
        try {
            $result = $this->client->patch("/postulants/$postulantId/information", [
                'headers' => [
                    "Authorization" => "Bearer $accessToken"
                ],
                'json' => [
                    'has_experience' => $hasExperience,
                    'type' => 'fair'
                ]
            ]);

            return $this->decodeJson($result);
        }catch (Exception $ex) {
            list($code, $message) = $this->parseException($ex, 'No se pudo actualizar el campo experiencia');

            throw new JobException($message, $code, $ex);
        }
    }
}