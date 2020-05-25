<?php

namespace AppBundle\Service\Postulant;

use AppBundle\Entity\Postulant\Study;
use AppBundle\Service\AbstractHttpService;
use AppBundle\Service\Postulant\Exception\StudyException;
use Exception;
use AppBundle\Service\Job\Util\Job;

/**
 * Class StudyService
 *
 * @author Alfredo Espiritu <alfredo.espiritu.m@gmail.com>
 * @package AppBundle\Service\Postulant
 * @copyright (c) 2017, Orbis
 */
class StudyService extends AbstractHttpService
{
    public function getByPostulantId($postulantId, $accessToken)
    {
        try {

            $response = $this->client->get("/postulants/$postulantId/studies", [
                'headers' => ['Authorization' => sprintf("%s %s", self::BEARER, $accessToken)]
            ]);

            return $this->decodeJson($response);

        } catch (Exception $exception) {

            list($code, $message) = $this->parseException($exception);
            throw new StudyException($message, $code);

        }
    }

    public function post($postulantId, $accessToken, Study $study)
    {
        try {

            if (!Job::hasMinRegisteredStudies($this->getLastByPostulantId($postulantId, $accessToken))) {


                $request = $this->formatRequestData($study);
                $response = $this->client->post("/postulants/$postulantId/studies", [
                    'headers' => ['Authorization' => sprintf("%s %s", self::BEARER, $accessToken)],
                    'json' => $request
                ]);

                return $this->decodeJson($response);

            }

        } catch (Exception $exception) {

            list($code, $message) = $this->parseException($exception);
            throw new StudyException($message, $code);

        }
    }

    public function put($postulantId, $accessToken, $experienceId, Study $study)
    {
        try {

            $request = $this->formatRequestData($study);
            $response = $this->client->put("/postulants/$postulantId/studies/$experienceId", [
                'headers' => ['Authorization' => sprintf("%s %s", self::BEARER, $accessToken)],
                'json' => $request
            ]);

            return $this->decodeJson($response);

        } catch (Exception $exception) {

            list($code, $message) = $this->parseException($exception);
            throw new StudyException($message, $code);

        }
    }

    public function createOrUpdate($studyId, $postulantId, $accessToken, Study $study)
    {
        if ($studyId) {
            $response = $this->put($postulantId, $accessToken, $studyId, $study);
        } else {
            $response = $this->post($postulantId, $accessToken, $study);
        }

        return $response;
    }

    public function getLastByPostulantId($postulantId, $accessToken)
    {
        $last = array();

        try {

            $response = $this->getByPostulantId($postulantId, $accessToken);

            if (!empty($response['data'])) {
                $last = array_shift($response['data']);
            }

        } catch (Exception $exception) {
        }

        return $last;
    }

    private function formatRequestData(Study $study)
    {
        return [
            'grade_id' => (int)$study->gradeId,
            'state_id' => (int)$study->stateId,
            'institution_id' => (int)$study->institutionId,
            'institution' => $study->institution,
            'career_id' => (int)$study->careerId,
            'career' => $study->career,
            'start_month' => (int)$study->startMonth,
            'start_year' => (int)$study->startYear,
            'end_month' => (int)$study->endMonth,
            'end_year' => (int)$study->endYear,
            'currently_studying' => (bool)$study->currentlyStudying,
            'country_id' => (int)$study->countryId
        ];
    }
}