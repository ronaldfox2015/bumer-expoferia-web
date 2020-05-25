<?php

namespace AppBundle\Controller;

use AppBundle\Service\Base\Exception\BadRequestException;
use AppBundle\Service\Base\Exception\UnauthorizedException;
use AppBundle\Service\Job\JobService;
use AppBundle\Service\Job\Util\Job;
use AppBundle\Service\Postulant\ExperienceService;
use AppBundle\Service\Postulant\ExperienceValidator;
use AppBundle\Service\Postulant\ProfileInformationService;
use AppBundle\Service\Postulant\ProfileInformationValidator;
use AppBundle\Service\Postulant\StudyService;
use AppBundle\Service\Postulant\StudyValidator;
use AppBundle\Service\Postulant\Util\Postulant;
use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * Class PostulantController
 *
 * @package AppBundle\Controller
 * @author Alfredo Espiritu <alfredo.espiritu.m@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class PostulantController extends Controller
{
    const FAIR_JOB_APPLICATION = 'fair job application';

    /**
     * @Route("/postulant/information", name="postulant_profile_get")
     * @Method("GET")
     * @param Request $request
     * @return JsonResponse
     */
    public function getProfileInformationAction(Request $request)
    {
        try {

            if (!$request->isXmlHttpRequest()) {
                throw new BadRequestException();
            }

            if (!$this->isLoggedIn()) {
                throw new UnauthorizedException('Necesita iniciar sesión para obtener sus datos.');
            }

            $profileInformation = $this->get(ProfileInformationService::class)->getInformationForJobApplication(
                $this->getAuth()->getUser()->getIdentityId(),
                $this->getAccessTokenValidated()
            );

            $response = Postulant::formatProfileInformationData($profileInformation);

            return new JsonResponse($response);

        } catch (Exception $exception) {

            return new JsonResponse([
                'message' => $exception->getMessage(),
                'code' => $exception->getCode()
            ],
                $exception->getCode()
            );

        }
    }

    /**
     * @Route("/postulant/update-profile", name="postulant_profile_patch")
     * @Method("POST")
     * @param Request $request
     * @return JsonResponse
     */
    public function updateProfileAction(Request $request)
    {
        try {

            if (!$request->isXmlHttpRequest()) {
                throw new BadRequestException();
            }

            if (!$this->isLoggedIn()) {
                throw new UnauthorizedException('Necesita iniciar sesión para actualizar sus datos.');
            }

            $postulantId = $this->getAuth()->getUser()->getIdentityId();
            $requestData = $request->request;
            $response = $this->saveProfileInformation($postulantId, $requestData);
            $job = new ParameterBag($requestData->get('job', []));

            if ($response['errors']) {
                return new JsonResponse(
                    $response,
                    JsonResponse::HTTP_BAD_REQUEST
                );
            }

            $profileInformation = $this->get(ProfileInformationService::class)->getInformationForJobApplication(
                $postulantId,
                $this->getAccessTokenValidated()
            );

            $this->updateAuthUserSession($profileInformation['profile']);

            $jobDetail = $this->get(JobService::class)->getById(
                $job->get('job_id'),
                $this->getAccessTokenValidated()
            );

            $response['next_action'] = Job::getNextActionHash($jobDetail['data']['has_questions'], $profileInformation);

            if ($response['next_action'] == Job::APPLY_JOB) {

                $this->get(JobService::class)->applyJob(
                    $job->get('job_id'),
                    null,
                    $this->getUserAccessToken(),
                    $request->headers->get('User-Agent')
                );

                $response['message'] = 'Postuló al aviso satisfactoriamente';

            }

            return new JsonResponse($response);

        } catch (Exception $exception) {

            return new JsonResponse([
                'message' => $exception->getMessage(),
                'code' => $exception->getCode()
            ],
                $exception->getCode()
            );

        }
    }

    private function saveProfileInformation($postulantId, ParameterBag $data)
    {
        $response = array(
            'message' => 'La solicitud es invalida.',
            'code' => JsonResponse::HTTP_BAD_REQUEST,
            'errors' => array()
        );

        $profileInformation = new ParameterBag($data->get('personal_information', []));
        $experience = new ParameterBag($data->get('experience', []));
        $study = new ParameterBag($data->get('study', []));
        $hasExperience = !filter_var($experience->get('has_experience'), FILTER_VALIDATE_BOOLEAN);
        $profileInformation->set('has_experience', $hasExperience);

        $profileInformationValidator = new ProfileInformationValidator(
            $profileInformation, ProfileInformationValidator::FAIR_JOB_APPLICATION
        );

        $studyValidator = new StudyValidator($study);
        $experienceValidator = new ExperienceValidator($experience);

        if ($profileInformationValidator->isValid() &&
            $studyValidator->isValid() &&
            (!$hasExperience || $experienceValidator->isValid())) {

            $accessToken = $this->getAccessTokenValidated();
            $patchProfile = $this->get(ProfileInformationService::class)->patchByPostulantId(
                $postulantId,
                $accessToken,
                $profileInformationValidator->getEntity()
            );

            $this->get(StudyService::class)->createOrUpdate($study->get('study_id'), $postulantId, $accessToken, $studyValidator->getEntity());

            if ($hasExperience) {
                $this->get(ExperienceService::class)->createOrUpdate(
                    $experience->get('experience_id'),
                    $postulantId,
                    $accessToken,
                    $experienceValidator->getEntity()
                );
            }

            $response['message'] = $patchProfile['message'];
            $response['code'] = JsonResponse::HTTP_OK;

        } else {

            $response['errors'] = [
                'personal_information' => $profileInformationValidator->getErrors(),
                'study' => $studyValidator->getErrors(),
                'experience' => []
            ];

            if ($hasExperience) {
                $response['errors']['experience'] = $experienceValidator->getErrors();
            }

        }

        return $response;
    }

    private function updateAuthUserSession($data = array())
    {
        $user = $this->getAuth()->getUser()->toArray();

        $user['data']['name'] = $data['names'];
        $user['data']['first_surname'] = $data['first_surname'];
        $user['data']['second_surname'] = $data['second_surname'];
        $user['data']['birthed_at'] = $data['birthed_at'];
        $user['data']['document_type'] = $data['document_type'];
        $user['data']['document_number'] = $data['document_number'];
        $user['data']['gender'] = $data['gender'];
        $user['data']['cellphone'] = $data['cellphone'];
        $user['data']['location_id'] = $data['location_id'];
        $user['data']['location'] = $data['location'];
        $user['data']['country_id'] = $data['country_id'];
        $user['data']['has_experience'] = $data['has_experience'];

        $this->getAuth()->setUser($user);

        return $user;
    }
}