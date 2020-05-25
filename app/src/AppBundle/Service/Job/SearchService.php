<?php

namespace AppBundle\Service\Job;

use AppBundle\Service\AbstractHttpService;
use AppBundle\Service\Fair\FairService;
use GuzzleHttp\Client;
use Psr\Log\LoggerInterface;
use AppBundle\Service\Base\SeoHead;
use AppBundle\Service\Job\Exception\SearchException;
use AppBundle\Service\PaginationService;
use Aptitus\Common\Util\Strings;
use Exception;

/**
 * Class SearchService
 *
 * @package AppBundle\Service\Search
 * @author Joseph Marcilla <jbmarflo@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class SearchService extends AbstractHttpService
{
    protected $jobService;

    public function __construct(
        Client $client,
        JobService $jobService,
        LoggerInterface $logger = null)
    {
        parent::__construct($client, $logger);

        $this->jobService = $jobService;
    }

    public function getJobs($params, $accessToken)
    {
        $params['withFacets'] = '0';
        $params['order'] = 'more-recent';

        try {
            $result = $this->client->get("/jobs/search", [
                'headers' => ['Authorization' => "Bearer $accessToken"],
                'query' => $params
            ]);

            return $this->decodeJson($result);
        }catch (Exception $exception) {
            throw new SearchException('No se pudo obtener los avisos de la empresa', 401, $exception);
        }
    }

    public function getDataViewStand(
        $params,
        $accessToken,
        $stand,
        $uri,
        $section,
        SeoHead $seoHead
    )
    {
        $standExpoAptitus = false;
        if ($params['company'] == JobService::STAND_EXPOFERIA_SLUG) {
            $params['company'] = null;
            $params['fair'] = FairService::FAIR_ID;
            $standExpoAptitus = true;
        }

        $jobs = $this->getJobs($params, $accessToken);

        $paginator = new PaginationService(
            $jobs['total'],
            $params['page'],
            $params['limit'],
            10,
            $uri
        );

        $titles = $seoHead->getTitleSectionList($stand['company']['trade_name']);
        $descriptions = $seoHead->getDescriptionSectionList($stand['company']['trade_name'], 'avisos de trabajo');

        if ($standExpoAptitus) {
            $companyData['data'] = [
                'id' => null,
                'trade_name' => null,
                'slug' => JobService::STAND_EXPOFERIA_SLUG,
                'business_name' => null,
                'logo' => null,
                'logo_name' => null
            ];
            $jobs['data'] = $this->replaceJobsCompanySlug($jobs['data']);
        } else {
            $companyData = $this->jobService->getCompanyByRuc(
                $stand['company']['document_number'],
                $accessToken
            );
        }

        return [
            'uri'        => $uri,
            'stand'      => $stand['configuration'],
            'company'    => $stand['company'],
            'enterprise' => $companyData['data'],
            'jobs'       => $jobs,
            'query'      => ucfirst(Strings::sanitizeSearch($params['q'])),
            'paginate'   => $paginator->paginate(),
            'page_title' => $titles[$section],
            'page_description' => $descriptions[$section],
            'titles'     => $titles
        ];
    }

    private function replaceJobsCompanySlug($jobList)
    {
        foreach($jobList as $id => $job) {
            $jobList[$id]['company_slug'] = JobService::STAND_EXPOFERIA_SLUG;
        }
        return $jobList;
    }
}