<?php

namespace AppBundle\Service\Postulant;

use AppBundle\Entity\Postulant\ProfileInformation;
use AppBundle\Service\AbstractHttpService;
use AppBundle\Service\Postulant\Exception\PostulantException;
use Exception;
use GuzzleHttp\Client;

/**
 * Class ProfileInformationService
 *
 * @author Alfredo Espiritu <alfredo.espiritu.m@gmail.com>
 * @package AppBundle\Service\Postulant
 * @copyright (c) 2017, Orbis
 */
class ProfileInformationService extends AbstractHttpService
{
    const MIN_REGISTERED_STUDIES = 1;
    const MIN_REGISTERED_EXPERIENCES = 1;

    protected $studyService;
    protected $experienceService;

    public function __construct(
        Client $client,
        StudyService $study,
        ExperienceService $experience)
    {
        parent::__construct($client);
        $this->studyService = $study;
        $this->experienceService = $experience;
    }

    public function getByPostulantId($postulantId, $accessToken)
    {
        try {

            $result = $this->client->get("/postulants/$postulantId/information", [
                'headers' => ['Authorization' => sprintf("%s %s", self::BEARER, $accessToken)]
            ]);

            return $this->decodeJson($result);

        } catch (Exception $exception) {

            list($code, $message) = $this->parseException($exception);
            throw new PostulantException($message, $code);

        }
    }

    public function patchByPostulantId($postulantId, $accessToken, ProfileInformation $profileInformation)
    {
        try {

            $request = $this->formatRequestData($profileInformation);
            $result = $this->client->patch("/postulants/$postulantId/information", [
                'headers' => ['Authorization' => sprintf("%s %s", self::BEARER, $accessToken)],
                'json' => $request
            ]);

            return $this->decodeJson($result);

        } catch (Exception $exception) {

            list($code, $message) = $this->parseException($exception);
            throw new PostulantException($message, $code);

        }
    }

    public function getInformationForJobApplication($postulantId, $accessToken)
    {
        $profile = $this->getByPostulantId($postulantId, $accessToken);
        $study = $this->studyService->getLastByPostulantId($postulantId, $accessToken);
        $experience = $this->experienceService->getLastByPostulantId($postulantId, $accessToken);

        return array(
            'profile' => $profile['data'],
            'study' => $study,
            'experience' => $experience
        );
    }

    private function formatRequestData(ProfileInformation $profileInformation)
    {
        return [
            'names' => $profileInformation->name,
            'first_surname' => $profileInformation->firstSurname,
            'second_surname' => $profileInformation->secondSurname,
            'birthed_at' => $profileInformation->birthDate,
            'document_type' => $profileInformation->docType,
            'document_number' => $profileInformation->docNumber,
            'gender' => $profileInformation->gender,
            'cellphone' => $profileInformation->cellphone,
            'location_id' => (int)$profileInformation->locationId,
            'country_id' => (int)$profileInformation->countryId,
            'has_experience' => (bool)$profileInformation->hasExperience,
            'type' => $profileInformation->type
        ];
    }
}