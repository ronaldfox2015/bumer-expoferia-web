<?php

namespace AppBundle\Controller;

use AppBundle\Service\Base\Enum\FairCategory;
use AppBundle\Service\Base\Enum\Month;
use AppBundle\Service\Base\SeoHead;
use AppBundle\Service\Fair\FairService;
use AppBundle\Service\Fair\FeedService;
use AppBundle\Service\Fair\StandService;
use AppBundle\Service\Job\Enum\Description;
use AppBundle\Service\Job\Exception\JobException;
use AppBundle\Service\Job\JobService;
use AppBundle\Service\Job\SearchService;
use AppBundle\Service\Job\Util\Job;
use AppBundle\Service\Notification\NotificationService;
use AppBundle\Service\Postulant\ProfileInformationService;
use Aptitus\Common\Util\Strings;
use DateTime;
use Exception;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class FairController
 *
 * @package AppBundle\Controller
 * @author Joseph Marcilla <jbmarflo@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class JobController extends Controller
{
    const FAIR_ID = 1;

    /**
     * Lista de empresas (aptitus web)
     *
     * @Route("/empleos", name="companies")
     * @return Response
     */
    public function companiesAction()
    {
        return $this->redirectToRoute('homepage');
    }

    /**
     * Lista de avisos de una empresa o institucion
     *
     * @Route("/empleos/{slug}/avisos", name="category_slug_jobs")
     * @param Request $request
     * @param String $slug
     * @return Response
     */
    public function categorySlugAction(Request $request, $slug)
    {
        return $this->getDataViewStand($request, $slug, 'avisos');
    }

    /**
     * @Route("/empleos/{slug}/perfil-institucional", name="jobs_company_perfil")
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
     * @Route("/empleos/{slug}/galeria", name="jobs_company_galeria")
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
     * @Route("/empleos/{slug}/documentos-descargables", name="jobs_company_documentos")
     * @Method("GET")
     * @param Request $request
     * @param $slug
     * @return Response
     */
    public function documentsAction(Request $request, $slug)
    {
        return $this->getDataViewStand($request, $slug, 'documentos');
    }

    private function getDataViewStand(Request $request, $slug, $section)
    {
        try {

            $page = $request->query->get('page', 1);
            $limit = $request->query->get('total', 12);
            $query = $request->query->get('q');
            $stand = $this->get(StandService::class)->getInfoStand(1, $slug, FairCategory::JOB_CATEGORY);
            $jobsList = $this->get(SearchService::class)->getDataViewStand(
                [
                    'q' => $query,
                    'limit' => $limit,
                    'page' => $page,
                    'company' => $slug,
                ],
                $this->getAccessToken(),
                $stand,
                $request->getUri(),
                $section,
                new SeoHead()
            );
            $jobsList['btn_cv_class'] = !$this->isLoggedIn() ? 'js-login-init' : 'js-leave-cv';
            $jobsList['page_fb_description'] = 'Revisando ofertas laborales';
            $jobsList['page_fb_title'] = sprintf('Estoy en %s', $jobsList['company']['trade_name']);
            $jobsList['page_tw_description'] = 'Revisando ofertas laborales';
            $jobsList['actual_page'] = $page;
            return $this->render('fair/stand.html.twig', $jobsList);
        } catch (Exception $e) {
            $this->addFlash('error', $e->getMessage());
            return $this->redirectToRoute('homepage');
        }
    }

    /**
     * Detalle de un aviso
     *
     * @Route("/empleos/{slug}/avisos/{slugJob}", name="category_slug_detail_job")
     * @param Request $request
     * @param $slug
     * @param $slugJob
     * @return Response
     */
    public function detailJobAction(Request $request, $slug, $slugJob)
    {
        $jobDetail = $this->get(JobService::class)->getBySlug(
            $slugJob,
            $this->getAccessTokenValidated(),
            $slug
        );

        $urlControl = $this->urlControl($jobDetail['data']['control'], $slug);
        $description = $this->generateDescriptionDetailJob($jobDetail['data']);
        $nextUrl = $this->generateUrl(
            'fair_job_apply',
            ['jobId' => $jobDetail['data']['id'], 'redirect' => $request->getUri()]
        );

        if (!$this->isLoggedIn()) {
            $jobDetail['data']['showModal'] = 'js-login-init';
        } else {

            if ($jobDetail['data']['showModal'] != 'g-btn--disabled') {

                $postulantId = $this->getAuth()->getUser()->getIdentityId();
                $profileInformation = $this->get(ProfileInformationService::class)->getInformationForJobApplication(
                    $postulantId,
                    $this->getAccessTokenValidated()
                );

                $nextActionHash = Job::getNextActionHash($jobDetail['data']['has_questions'], $profileInformation);

                if ($nextActionHash == Job::INCOMPLETE_INFORMATION_HASH) {
                    $jobDetail['data']['showModal'] = 'js-not-enough-information';
                } elseif (empty($jobDetail['data']['showModal'])) {
                    $jobDetail['data']['showModal'] = 'js-init-apply';
                }

            }

        }

        return $this->render('fair/offer.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir'))
                . DIRECTORY_SEPARATOR,
            'data' => $jobDetail['data'],
            'url' => [
                'stand' => $this->generateUrl('category_slug_jobs', ['slug' => $slug]),
                'previous' => $urlControl['previous'],
                'next' => $urlControl['next']
            ],
            'page_title' => $jobDetail['data']['title'],
            'page_description' => $description,
            'page_fb_description' => 'Recomiendo esta oferta laboral',
            'page_fb_title' => $jobDetail['data']['title'],
            'page_tw_description' => 'Recomiendo esta oferta laboral',
            'next_url' => $nextUrl
        ]);
    }

    /**
     * @param $controls
     * @param $slug
     * @return mixed
     */
    private function urlControl($controls, $slug)
    {
        $urlControl['previous'] = '';
        $urlControl['next'] = '';

        if ( ! empty($controls['previous'])) {
            $urlControl['previous'] = $this->generateUrl(
                'category_slug_detail_job',
                ['slug' => $slug, 'slugJob' => $this->generateLink($controls['previous'])]
            );
        }

        if ( ! empty($controls['next'])) {
            $urlControl['next'] = $this->generateUrl(
                'category_slug_detail_job',
                ['slug' => $slug, 'slugJob' => $this->generateLink($controls['next'])]
            );
        }

        return $urlControl;
    }

    private function generateLink($data)
    {
        return sprintf('%s-%s', $data['slug'], $data['id']);
    }

    /**
     * @Route("/fair/job/{jobId}/apply", name="fair_job_apply")
     * @param Request $request
     * @param int $jobId
     * @return RedirectResponse
     */
    public function fairJobApplyAction(Request $request, $jobId)
    {
        $url = $request->query->get('redirect', $this->generateUrl('companies'));

        if (!$this->isLoggedIn()) {
            $this->addFlash(
                'error',
                'Necesita iniciar sesión para actualizar sus datos.'
            );
            return $this->redirect($url);
        }

        try {

            $postulantId = $this->getAuth()->getUser()->getIdentityId();
            $answers = $request->request->get('answers', null);
            $jobDetail = $this->get(JobService::class)->getById($jobId, $this->getAccessTokenValidated());

            if (!$jobDetail['data']['applied']) {

                $profileInformation = $this->get(ProfileInformationService::class)->getInformationForJobApplication(
                    $postulantId,
                    $this->getAccessTokenValidated()
                );

                $nextActionHash = Job::getNextActionHash($jobDetail['data']['has_questions'], $profileInformation);

                if ($nextActionHash == Job::INCOMPLETE_INFORMATION_HASH) {
                    $url = $url . "#$nextActionHash";
                } else {

                    if ($nextActionHash == Job::QUESTIONS_HASH && !$answers) {
                        $url = $url . "#$nextActionHash";
                    } else {

                        $this->get(JobService::class)->applyJob(
                            $jobId,
                            $answers,
                            $this->getUserAccessToken(),
                            $request->headers->get('User-Agent')
                        );

                        $this->addFlash(
                            'success',
                            'Postuló al aviso satisfactoriamente'
                        );

                    }

                }

            }

        } catch (Exception $exception) {
            $this->addFlash('error', $exception->getMessage());
        }

        return $this->redirect($url);
    }

    /**
     * Comportir por email
     * @Route("/share-email", name="share_email")
     * @Method("POST")
     * @param Request $request
     * @return JsonResponse
     */
    public function shareEmailAction(Request $request)
    {
        $params = $request->request->all();

        try {

            $jobDetail = $this->get(JobService::class)->getById(
                $params['id'],
                $this->getAccessTokenValidated()
            );

            $status = 0;
            $message = 'Envío de correo fallido';

            if(!empty($jobDetail["data"])){
                $data = $jobDetail["data"];

                $result = $this->get(NotificationService::class)->shareEmailJob(
                    $params['txtEmail'],
                    $params['txtSenderName'],
                    $params['txtMessage'],
                    $data['title'],
                    $data['image'],
                    Job::cutText(Strings::cleanHtml($data['functions']),Description::NUMBER_OF_DESCRIPTION_CHARACTERS),
                    $data['url'],
                    $data['location'],
                    $data['area'],
                    $data['company']
                );

                $message = 'Envío de correo exitoso';
                $status = 1;
            }

            return new JsonResponse([
                'status' => $status,
                'msg' => $message
            ]);

        } catch (Exception $exception) {
            return new JsonResponse(
                ['message' => $exception->getMessage(), 'code' => $exception->getCode()],
                $exception->getCode()
            );
        }
    }

    /**
     * @Route(
     *     "/feed-{page}.{outputFormat}",
     *     requirements={
     *       "page": "(facebook)",
     *       "outputFormat": "(csv)"
     *     }
     * )
     * @Method("GET")
     * @param string $page
     * @param string $outputFormat
     *
     * @return Response
     */
    public function feedFacebookAction($page, $outputFormat)
    {
        $feed = $this->get(FeedService::class)->getFeedResourceContent($page, $outputFormat);
        return new Response($feed, Response::HTTP_OK, [
            'Content-Type' => 'text/csv; charset=utf-8'
        ]);
    }

    /**
     * Dejar CV
     * @Route("/receive-cv/{companyId}", name="receive_cv_company")
     * @param Request $request
     * @param int $companyId
     * @return JsonResponse
     */
    public function receiveCVAction(Request $request, $companyId)
    {
        $note = $request->request->get('note', null);

        try {
            if ( ! $this->isLoggedIn()) {
                throw new JobException('Necesita iniciar sesión como postulante', JsonResponse::HTTP_BAD_REQUEST);
            }

            $result = $this->get(JobService::class)->receiveCV(
                $companyId,
                $this->getAuth()->getUser()->getIdentityId(),
                $note,
                $this->getAccessToken()
            );

            return new JsonResponse($result);
        } catch (Exception $exception) {
            return new JsonResponse(
                ['message' => $exception->getMessage(), 'code' => $exception->getCode()],
                $exception->getCode()
            );
        }
    }

    /**
     * @param array $data
     * @return string
     */
    private function generateDescriptionDetailJob($data)
    {
        $date = DateTime::createFromFormat("Y-m-d", $data['published_at']);
        $month = Month::getName((int)$date->format('m'));
        $publishedAt = strftime("%d de $month del %Y", $date->getTimestamp());

        return sprintf(
            "Trabaja como %s en %s, %s. Publicado el %s | ExpoAptitus 2019",
            trim($data['title']),
            trim($data['company']),
            $data['location'],
            $publishedAt
        );
    }
}
