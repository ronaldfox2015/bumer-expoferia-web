<?php

namespace AppBundle\Service\Postulant;

use AppBundle\Entity\Postulant\Experience;
use AppBundle\Entity\Postulant\ProfileInformation;
use AppBundle\Service\AbstractHttpService;
use AppBundle\Service\Postulant\Exception\ExperienceException;
use Exception;
use AppBundle\Service\Job\Util\Job;


/**
 * Class ExperienceService
 *
 * @author Alfredo Espiritu <alfredo.espiritu.m@gmail.com>
 * @package AppBundle\Service\Postulant
 * @copyright (c) 2017, Orbis
 */
class ExperienceService extends AbstractHttpService
{
    public function getByPostulantId($postulantId, $accessToken)
    {
        try {

            $response = $this->client->get("/postulants/$postulantId/experiences", [
                'headers' => ['Authorization' => sprintf("%s %s", self::BEARER, $accessToken)]
            ]);

            return $this->decodeJson($response);

        } catch (Exception $exception) {

            list($code, $message) = $this->parseException($exception);
            throw new ExperienceException($message, $code);

        }
    }

    public function post($postulantId, $accessToken, Experience $experience)
    {
        try {

            if (!Job::hasMinRegisteredExperiences(
                $this->getLastByPostulantId($postulantId, $accessToken),
                ProfileInformation::HAS_NOT_EXPERIENCE)
            ) {

                $request = $this->formatRequestData($experience);
                $response = $this->client->post("/postulants/$postulantId/experiences", [
                    'headers' => ['Authorization' => sprintf("%s %s", self::BEARER, $accessToken)],
                    'json' => $request
                ]);

                return $this->decodeJson($response);

            }

        } catch (Exception $exception) {

            list($code, $message) = $this->parseException($exception);
            throw new ExperienceException($message, $code);

        }
    }

    public function put($postulantId, $accessToken, $experienceId, Experience $experience)
    {
        try {

            $request = $this->formatRequestData($experience);
            $response = $this->client->put("/postulants/$postulantId/experiences/$experienceId", [
                'headers' => ['Authorization' => sprintf("%s %s", self::BEARER, $accessToken)],
                'json' => $request
            ]);

            return $this->decodeJson($response);

        } catch (Exception $exception) {

            list($code, $message) = $this->parseException($exception);
            throw new ExperienceException($message, $code);

        }
    }

    public function createOrUpdate($experienceId, $postulantId, $accessToken, Experience $experience)
    {
        if ($experienceId) {
            $response = $this->put($postulantId, $accessToken, $experienceId, $experience);
        } else {
            $response = $this->post($postulantId, $accessToken, $experience);
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

    public function formatRequestData(Experience $experience)
    {
        return [
            'company' => $experience->company,
            'industry' => $experience->industry,
            'job' => $experience->job,
            'level_id' => (int)$experience->levelId,
            'area_id' => (int)$experience->areaId,
            'job_id' => (int)$experience->jobId,
            'start_month' => (int)$experience->startMonth,
            'start_year' => (int)$experience->startYear,
            'end_month' => (int)$experience->endMonth,
            'end_year' => (int)$experience->endYear,
            'currently_working' => (bool)$experience->currentlyWorking,
            'description' => $experience->description,
            'place' => $experience->place,
            'project_type_id' => $experience->projectTypeId,
            'project_name' => $experience->projectName,
            'project_budget' => $experience->projectBudget
        ];
    }
}