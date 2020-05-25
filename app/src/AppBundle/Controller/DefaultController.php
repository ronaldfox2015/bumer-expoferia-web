<?php

namespace AppBundle\Controller;

use AppBundle\Service\Base\BaseService;
use AppBundle\Service\Base\Enum\FairCategory;
use AppBundle\Service\Fair\FairService;
use Exception;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{
    const FAIR_ID = 1;

    /**
     * @Route("/", name="homepage")
     */
    public function indexAction()
    {
        $companies = $this->get(FairService::class)->listCompanies(
            self::FAIR_ID,
            FairCategory::JOB_CATEGORY
        );
        return $this->render('fair/home.html.twig', [
            'page_description' => 'Bienvenido a la ExpoAptitus 2019. La feria virtual de trabajo ' .
                'más grande del Perú que conecta a candidatos con las mejores empresas para generar puestos de '.
                'trabajo en tiempo real. Actualiza tu CV y aumenta tus posibilidades de encontrar el empleo que '.
                'tanto buscabas | ExpoAptitus 2019',
            'page_fb_description' => 'Postula a más de 1,000 ofertas laborales',
            'page_fb_title' => 'La feria virtual de empleo más importante del Perú',
            'page_tw_description' => 'Postula a más de 1,000 ofertas laborales',
            'companies' => $companies,
            'sponsors' => $this->get(FairService::class)->listSponsors(self::FAIR_ID),
            'front_companies' => $this->get(FairService::class)->getFrontCompanies($companies)
        ]);
    }

    /**
     * @Route("/cierre", name="close")
     */
    public function closeAction()
    {
        return $this->render('fair/close.html.twig', [
            'page_description' => 'Bienvenido a la ExpoAptitus 2019. La feria virtual de trabajo ' .
                'más grande del Perú que conecta a candidatos con las mejores empresas para generar puestos de '.
                'trabajo en tiempo real. Actualiza tu CV y aumenta tus posibilidades de encontrar el empleo que '.
                'tanto buscabas | ExpoAptitus 2019',
            'page_fb_description' => 'Postula a más de 1,000 ofertas laborales',
            'page_fb_title' => 'La feria virtual de empleo más importante del Perú',
            'page_tw_description' => 'Postula a más de 1,000 ofertas laborales'
        ]);
    }

    /**
     * @Route("/stand", name="stand")
     * @param Request $request
     * @return Response
     */
    public function standAction(Request $request)
    {
        return $this->render('fair/stand.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')) . DIRECTORY_SEPARATOR,
        ]);
    }

    /**
     * @Route("/fair/company")
     * @Method("GET")
     */
    public function fairCompanyDetailAction()
    {
        return $this->get(FairService::class)->getCompanyDetail(1, 6);
    }

    /**
     * @Route("/demo")
     * @Method("GET")
     */
    public function testAction()
    {
        if ($this->isLoggedIn()) {
            return [
                'message' => 'Ya estas logeado',
                'user' => $this->getAuth()->getUser()
            ];
        } else {
            return [
                'message' => 'No estas logeado. Inicia sesion',
                'token  ' => $this->getAuth()->getAccessToken()
            ];
        }
    }

    /**
     * @Route("/ajax/locations", name="ajax_search_locations")
     * @Method("GET")
     * @param Request $request
     * @return JsonResponse
     */
    public function searchLocationsAction(Request $request)
    {
        try {
            $query = $request->get('q', null);

            return $this->get(BaseService::class)->searchLocations(
                $query,
                $this->getAccessToken()
            );
        } catch (Exception $exception) {
            return new JsonResponse(
                [
                    'message' => $exception->getMessage(),
                    'code' => $exception->getCode()
                ],
                $exception->getCode()
            );
        }
    }

    /**
     * @Route("/ajax/grades", name="ajax_get_grades")
     * @Method("GET")
     * @param Request $request
     * @return JsonResponse
     */
    public function getGradesAction(Request $request)
    {
        try {
            return $this->get(BaseService::class)->getGrades();
        } catch (Exception $exception) {
            return new JsonResponse(
                [
                    'message' => $exception->getMessage(),
                    'code' => $exception->getCode()
                ],
                $exception->getCode()
            );
        }
    }

    /**
     * @Route("/ajax/institutions", name="ajax_search_institutions")
     * @Method("GET")
     * @param Request $request
     * @return JsonResponse
     */
    public function searchInstitutionsAction(Request $request)
    {
        try {
            $query = $request->get('q', null);

            return $this->get(BaseService::class)->searchInstitutions(
                $query,
                $this->getAccessToken()
            );
        } catch (Exception $exception) {
            return new JsonResponse(
                [
                    'message' => $exception->getMessage(),
                    'code' => $exception->getCode()
                ],
                $exception->getCode()
            );
        }
    }

    /**
     * @Route("/ajax/careers", name="ajax_search_careers")
     * @Method("GET")
     * @param Request $request
     * @return JsonResponse
     */
    public function searchCarrersAction(Request $request)
    {
        try {
            $query = $request->get('q', null);

            return $this->get(BaseService::class)->searchCareers(
                $query,
                $this->getAccessToken()
            );
        } catch (Exception $exception) {
            return new JsonResponse(
                [
                    'message' => $exception->getMessage(),
                    'code' => $exception->getCode()
                ],
                $exception->getCode()
            );
        }
    }

    /**
     * @Route("/ajax/positions", name="ajax_search_positions")
     * @Method("GET")
     * @param Request $request
     * @return JsonResponse
     */
    public function searchPositionsAction(Request $request)
    {
        try {
            $query = $request->get('q', null);

            return $this->get(BaseService::class)->searchPositions(
                $query,
                $this->getAccessToken()
            );
        } catch (Exception $exception) {
            return new JsonResponse(
                [
                    'message' => $exception->getMessage(),
                    'code' => $exception->getCode()
                ],
                $exception->getCode()
            );
        }
    }

    /**
     * @Route("/ajax/levels", name="ajax_get_levels")
     * @Method("GET")
     * @param Request $request
     * @return JsonResponse
     */
    public function getLevelsAction(Request $request)
    {
        try {
            return $this->get(BaseService::class)->getLevels();
        } catch (Exception $exception) {
            return new JsonResponse(
                [
                    'message' => $exception->getMessage(),
                    'code' => $exception->getCode()
                ],
                $exception->getCode()
            );
        }
    }

    /**
     * @Route("/ajax/areas", name="ajax_get_areas")
     * @Method("GET")
     * @param Request $request
     * @return JsonResponse
     */
    public function getAreasAction(Request $request)
    {
        try {
            return $this->get(BaseService::class)->getAreas();
        } catch (Exception $exception) {
            return new JsonResponse(
                [
                    'message' => $exception->getMessage(),
                    'code' => $exception->getCode()
                ],
                $exception->getCode()
            );
        }
    }

}
