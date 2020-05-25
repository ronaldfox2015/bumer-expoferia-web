<?php

namespace AppBundle\Controller;

use AppBundle\Service\Base\Enum\FairCategory;
use AppBundle\Service\Base\GoogleRecaptcha;
use AppBundle\Service\Base\SeoHead;
use AppBundle\Service\Education\ContactLead;
use AppBundle\Service\Education\EducationService;
use AppBundle\Service\Fair\FairService;
use AppBundle\Service\Fair\StandService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class EducationController
 *
 *
 * @package AppBundle\Controller
 * @author Joseph Marcilla <jbmarflo@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class EducationController extends Controller
{
    const FAIR_ID = 1;

    /**
     * Lista de instituciones educativas (mas educacion)
     *
     * @Route("/educacion", name="education")
     * @return Response
     */
    public function educationAction()
    {
        return $this->render("fair/companies-edu.html.twig", [
            'institutions' => $this->get(FairService::class)->listCompanies(
                self::FAIR_ID,
                FairCategory::EDUCATION_CATEGORY
            ),
            'page_title' => 'Instituciones Educativas',
            'page_description' => 'Encuentra las diferentes instituciones educativas '.
                'que participan en la 6ta Expo Aptitus 2017.'
        ]);
    }

    /**
     * Lista de empresas (aptitus web) o instituciones (mas educacion)
     *
     * @Route("/educacion", name="institutions")
     * @return Response
     */
    public function institutionsAction()
    {
        return $this->render("fair/companies.html.twig", [
            'companies' => $this->get(FairService::class)->listCompanies(
                self::FAIR_ID,
                FairCategory::EDUCATION_CATEGORY
            ),
            'page_title' => 'Empresas',
            'page_description' => 'Encuentra las diferentes instituciones educativas que participan en la 6ta Expo Aptitus 2017.'
        ]);
    }

    /**
     * Lista de avisos de institucion educativa
     *
     * @Route("/educacion/{slug}/avisos", name="education_slug_record")
     * @param Request $request
     * @param String $slug
     * @return Response
     */
    public function educationSlugAction(Request $request, $slug)
    {
        return $this->getDataViewStand($request, $slug, 'avisos');
    }

    /**
     * @Route("/educacion/{slug}/perfil-institucional", name="education_company_profile")
     * @Method("GET")
     * @param Request $request
     * @param $slug
     * @return Response
     */
    public function institutionalProfileAction(Request $request, $slug)
    {
        return $this->getDataViewStand($request, $slug, 'perfil');
    }

    /**
     * @Route("/educacion/{slug}/galeria", name="education_company_gallery")
     * @Method("GET")
     * @param Request $request
     * @param $slug
     * @return Response
     */
    public function galleryAction(Request $request, $slug)
    {
        return $this->getDataViewStand($request, $slug, 'galeria');
    }

    /**
     * @Route("/educacion/{slug}/documentos-descargables", name="education_company_documents")
     * @Method("GET")
     * @param Request $request
     * @param $slug
     * @return Response
     */
    public function documentsAction(Request $request, $slug)
    {
        return $this->getDataViewStand($request, $slug, 'documentos');
    }

    /**
     * Detalle de un aviso
     *
     * @Route("/educacion/{slug}/avisos/{slugEducation}", name="education_detail")
     * @param $slug
     * @param $slugEducation
     * @return Response
     */
    public function detailJobAction($slug, $slugEducation)
    {
        $educationDetail = $this->get(EducationService::class)->getBySlug(
            $slugEducation
        );
        $description = $this->generateDescriptionDetailJob($educationDetail['data']);

        return $this->render('fair/education-offer.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
            'data' => $educationDetail['data'],
            'url' => [
                'stand' => $this->generateUrl('education_slug_record', ['slug' => $slug]),
                'previous' => $educationDetail['previous'],
                'next' => $educationDetail['next']
            ],
            'slug' => $slug,
            'page_title'   => $educationDetail['data']['title'],
            'page_description' => $description,
            'page_fb_description' => $description,
            'page_fb_title' => $educationDetail['data']['title'],
            'page_tw_description' => $description,
            'showCaptcha' => GoogleRecaptcha::useCaptcha(EducationService::TIME_SHOW_CAPTCHA),
            'contactLead' => ContactLead::get()
        ]);
    }

    private function getDataViewStand(Request $request, $slug, $section)
    {
        $page  = $request->query->get('page', 1);
        $limit = $request->query->get('total', 12);
        $query = $request->query->get('q');

        $stand = $this->get(StandService::class)->getInfoStand(1, $slug, FairCategory::EDUCATION_CATEGORY);

        $educationList = $this->get(EducationService::class)->getDataViewStand(
            [
                'company' => $slug,
                'q'       => $query,
                'limit'   => $limit,
                'page'    => $page
            ],
            $stand,
            $request->getUri(),
            $section,
            new SeoHead()
        );

        $educationList['page_fb_description'] = sprintf("Acabo de visitar el stand virtual de %s y estoy revisando sus avisos. ".
            "Te invito a visitarlo!",
            $educationList['company']['trade_name']
        );
        $educationList['page_fb_title'] = 'Estoy en la feria virtual Expo Aptitus 2017';
        $educationList['page_tw_description'] = sprintf("Estoy en #ExpoAptitus2017 revisando los avisos del stand virtual de %s",
            $educationList['company']['trade_name']
        );
        return $this->render('fair/stand-edu.html.twig', $educationList);
    }

    /**
     * @Route("/ajax/education/lead", name="ajax_education_lead")
     * @Method("POST")
     * @param Request $request
     * @return JsonResponse
     */
    public function setContactLead(Request $request)
    {
        $name = $request->request->get('name', null);
        $email = $request->request->get('email', null);
        $phone = $request->request->get('phone', null);
        $message = $request->request->get('message', null);
        $captchaResponse =  $request->request->get('g-recaptcha-response', null);
        $id = $request->request->get('id', null);
        $lead = $this->get(EducationService::class)->setLead(
            $id,
            [
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'message' => $message
            ],
            $captchaResponse
        );

        return new JsonResponse(
            [
                'message' => 'Se envió correctamente',
                'data' => $lead
            ]
        );
    }

    /**
     * @param array $data
     * @return string
     */
    private function generateDescriptionDetailJob($data)
    {
        return sprintf("%s en %s, evalúa éste y otros estudios aquí en MásEducación",
            $data['title'],
            $data['institution_name']
        );
    }
}
