<?php

namespace AppBundle\Controller;

use AppBundle\Auth\CrossSessionAuthentifier;
use AppBundle\Auth\Data\UserRoleType;
use AppBundle\Auth\SessionAuthentifier;
use AppBundle\Entity\Postulant\ProfileInformation;
use AppBundle\Service\FacebookService;
use AppBundle\Service\Job\JobService;
use AppBundle\Service\Postulant\ExperienceService;
use AppBundle\Service\Postulant\ExperienceValidator;
use AppBundle\Service\Postulant\ProfileInformationValidator;
use AppBundle\Service\Postulant\StudyService;
use AppBundle\Service\Postulant\StudyValidator;
use AppBundle\Util\AptCookie;
use AppBundle\Util\URL;
use Exception;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class AuthController extends Controller
{

    protected $authentifier;
    protected $facebookService;

    public function __construct(
        CrossSessionAuthentifier $authentifier,
        FacebookService $facebookService)
    {
        $this->authentifier = $authentifier;
        $this->facebookService = $facebookService;
    }

    /**
     * @Route("/auth/login", name="auth_login")
     * @Method("POST")
     *
     * @param Request $request
     * @return array|JsonResponse
     */
    public function loginAction(Request $request)
    {
        try {
            return new JsonResponse(
                $this->authentifier->login(
                    $request->request->get('email'),
                    $request->request->get('password'),
                    $request->request->get('role', UserRoleType::POSTULANT),
                    $request->request->get('provider', 'aptitus'),
                    $request->request->get('provider_token')
                )
            );
        } catch (Exception $exception) {

            $this->get('logger')->error($exception->getMessage(), $exception->getTrace());

            return new JsonResponse(
                ['message' => $exception->getMessage(), 'code' => $exception->getCode()],
                $exception->getCode()
            );
        }
    }

    /**
     * @Route("/auth/facebook",
     *    name="auth_facebook"
     * )
     *
     * @param Request $request
     * @return RedirectResponse|Response
     */
    public function loginFbAction(Request $request)
    {
        try {
            $token = $request->query->get('code', false);
            $state = $request->query->get('state', false);

            if (!$token || !$state) {
                throw new UnauthorizedHttpException('No tiene permisos para esta solicitud');
            }

            $parameters = $this->facebookService->getAuthStateParameters($state);

            $this->facebookService->setPersistentAuthState($parameters['st']);
            $this->facebookService->setInputAuthState($parameters['st']);
            $user  = $this->facebookService->getUser();

            $request->request->set('email', $user->getEmail());
            $request->request->set('provider', FacebookService::PROVIDER_NAME);
            $request->request->set('provider_token', $this->facebookService->getAccessToken());

            $this->authentifier->login(
                $request->request->get('email'),
                $request->request->get('password'),
                $request->request->get('role', UserRoleType::POSTULANT),
                $request->request->get('provider', 'aptitus'),
                $request->request->get('provider_token')
            );

            $nextUrl = $this->facebookService->decodeNextUri($parameters['next']);
            $nextUrl = URL::checkDomain($nextUrl, 'aptitus.com') ? $nextUrl : '/';

            return $this->redirect($nextUrl);

        }catch (Exception $exception) {

            $this->addFlash('error','No se pudo loguear con facebook.');

            $this->get('logger')->error('Facebook Login error' , [
                'trace'     => $exception->getTrace(),
                'error'     => $exception->getMessage(),
                'data'      => $request->request->all(),
            ]);

            return $this->redirect('/');
        }

    }

    /**
     * @Route("/auth/logout")
     *
     */
    public function logoutAction()
    {
        $token = $this->getAccessToken();
        $this->get(CrossSessionAuthentifier::class)->logout($token);

        AptCookie::set(SessionAuthentifier::SESSION_POSTULANT, '');
        unset($_COOKIE[SessionAuthentifier::SESSION_POSTULANT]);
        AptCookie::set(SessionAuthentifier::APTITUS_AUTHORIZATION, '');
        unset($_COOKIE[SessionAuthentifier::APTITUS_AUTHORIZATION]);

        return $this->redirectToRoute('homepage');
    }

    /**
     * @Route("/register", name="register")
     * @param Request $request
     * @return JsonResponse
     */
    public function registerAction(Request $request)
    {
        $request->request->set("provider", "aptitus");

        try {
            $data = $request->request->all();
            $profileInformationValidator = new ProfileInformationValidator(
                new ParameterBag($data['personal_information']), ProfileInformationValidator::REGISTER
            );
            $studyValidator = new StudyValidator(new ParameterBag($data['study']));
            $experienceValidator = new ExperienceValidator(new ParameterBag($data['experience']));

            $hasNoExperience = !filter_var($data['experience']['has_experience'], FILTER_VALIDATE_BOOLEAN);

            if($profileInformationValidator->isValid() &&
                $studyValidator->isValid() &&
                ($experienceValidator->isValid() || !$hasNoExperience)) {
                if (!$this->isLoggedIn()) {
                    $resultId = $this->authentifier->register($profileInformationValidator->getEntity());
                } else {
                    $resultId = $this->getAuth()->getUser()->getIdentityId();
                }
            }else{
                return new JsonResponse(
                    array(
                        'message' => 'La solicitud es invalida.',
                        'code' => JsonResponse::HTTP_BAD_REQUEST,
                        'errors' => array(
                            'personal_information' => $profileInformationValidator->getErrors(),
                            'study' => $studyValidator->getErrors(),
                            'experience' => $experienceValidator->getErrors()
                        )
                    ),
                    JsonResponse::HTTP_BAD_REQUEST
                );
            }

            /** @var ProfileInformation $profileInformation */
            $profileInformation = $profileInformationValidator->getEntity();
            if (!$this->isLoggedIn()) {
                $this->authentifier->login(
                    $profileInformation->email,
                    $profileInformation->password,
                    $request->request->get('role', UserRoleType::POSTULANT),
                    $request->request->get('provider', 'aptitus')
                );
            }

            $this->get(StudyService::class)->post(
                $resultId,
                $this->getAccessToken(),
                $studyValidator->getEntity()
            );

            $this->get(JobService::class)->updateHasExperience(
                $resultId,
                $this->getAccessToken(),
                $hasNoExperience
            );

            if ($hasNoExperience) {
                $this->get(ExperienceService::class)->post(
                    $resultId,
                    $this->getAccessToken(),
                    $experienceValidator->getEntity()
                );
            }

            return new JsonResponse(["id" => $resultId], JsonResponse::HTTP_CREATED);
        } catch (Exception $exception) {
            return new JsonResponse(
                ['message' => $exception->getMessage(), 'code' => $exception->getCode()],
                $exception->getCode()
            );
        }
    }

    /**
     * @Route("/recovery-password", name="recovery_password")
     * @param Request $request
     * @return JsonResponse
     */
    public function recoveryPasswordAction(Request $request)
    {
        try {
            $this->get(SessionAuthentifier::class)
                ->recoveryPassword(
                    $request->request->get('email'),
                    $request->request->get('role', UserRoleType::POSTULANT)
                );

            return new JsonResponse(
                ['message' => 'Se solicitó el cambio de contraseña correctamente']
            );
        } catch (Exception $exception) {
            return new JsonResponse(
                ['message' => $exception->getMessage(), 'code' => $exception->getCode()],
                $exception->getCode()
            );
        }
    }
}