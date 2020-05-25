<?php

namespace AppBundle\Service\Fair;

use AppBundle\Service\Base\Enum\CompanyFilter;
use AppBundle\Service\Base\Enum\FairCategory;
use AppBundle\Service\Base\Enum\OrderType;
use AppBundle\Service\Base\Enum\SponsorRuc;
use AppBundle\Service\Job\JobService;
use GuzzleHttp\Client;
use Psr\Log\LoggerInterface;
use AppBundle\Service\AbstractHttpService;
use AppBundle\Service\Fair\Exception\FairException;
use Exception;

/**
 * Class FairService
 *
 * @package AppBundle\Service\Fair
 * @author Andy Ecca <andy.ecca@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class FairService extends AbstractHttpService
{
    const FAIR_ID = 1;

    protected $config;

    public function __construct(
        Client $client,
        $config,
        LoggerInterface $logger = null)
    {
        parent::__construct($client, $logger);
        $this->config = $config;
    }

    /**
     * Obtener el listado de empresas de una determinada feria
     *
     * @param int $fairId
     * @param string $category
     * @param string $sort
     * @param string $order
     * @return mixed
     */
    public function getCompanies($fairId = 1, $category = null, $sort = null, $order = '')
    {
        try {
            $params = [];
            if (!empty($category)) {
                $params = ['query' => ['category' => $category, 'sort' => $sort, 'order' => $order]];
            }

            $result = $this->client->get("fair/fairs/$fairId/companies", $params);
            return $this->decodeJson($result);
        }catch (Exception $exception) {
            throw new FairException('No se pudo obtener el listados de empresas', $exception, 401);
        }
    }

    /**
     * Obtener el listado de empresas de una determinada feria agrupadas por categoria
     *
     * @param int $fairId
     * @param string $category
     * @param array $rucNotIn
     * @return mixed
     */
    public function listCompanies($fairId = 1, $category = null, $rucNotIn = [])
    {
        try {

            $result = $this->getCompanies($fairId, $category);
            return $this->formatCompaniesData($result, $category, $rucNotIn);

        }catch (Exception $exception) {
            throw new FairException('No se pudo obtener el listados de empresas', $exception, 401);
        }
    }

    /**
     * Helper de vista para obtener el listado de empresas de la categoria empleo
     * @return mixed
     */
    public function companiesJobHelper()
    {
        try {
            $companies = $this->getCompanies(
                self::FAIR_ID,
                FairCategory::JOB_CATEGORY,
                CompanyFilter::TRADE_NAME,
                OrderType::ASC
            );

            return $this->reformatCompanyNames($companies);
        } catch (Exception $exception) {
            return [];
        }
    }

    private function reformatCompanyNames($companies)
    {
        $allCompanies = [];
        $firstCompany = [];
        if (!empty($companies)) {
            foreach ($companies as $key => $value) {
                if (strlen($value['trade_name']) >= 20) {
                    $companies[$key]['trade_name'] = substr($value['trade_name'], 0, 20) . '...';
                }
                $companies[$key]['full_trade_name'] = $value['trade_name'];
                if ($value['slug'] == JobService::STAND_EXPOFERIA_SLUG) {
                    $firstCompany = $companies[$key];
                } else {
                    $allCompanies[$key+1] = $companies[$key];
                }
            }
        }
        if ( count($firstCompany) > 0 ) {
            $allCompanies[0] = $firstCompany;
        }
        ksort($allCompanies);
        return $allCompanies;
    }

    /**
     * Helper de vista para obtener el listado de empresas de la categoria educacion
     * @return mixed
     */
    public function companiesEducationHelper()
    {
        try {
            $companies = $this->getCompanies(
                self::FAIR_ID,
                FairCategory::EDUCATION_CATEGORY,
                CompanyFilter::TRADE_NAME,
                OrderType::ASC
            );

            return $this->reformatCompanyNames($companies);
        } catch (Exception $exception) {
            return [];
        }
    }

    private function formatCompaniesData($companies, $category, $rucNotIn)
    {
        $type = ($category == FairCategory::JOB_CATEGORY ? 'jobs' : 'education');
        $newcompanies = [];
        foreach($companies as $idx => $company) {
            if (!in_array($company['document_number'], $rucNotIn)) {
                $company['class'] = str_replace(
                    ['ORO', 'PLATA', 'BRONCE'],
                    ['gold', 'silver', 'bronze'],
                    $company['stand']
                );
                $company['coords'] = ! empty($this->config[$type][$company['slug']]) ?
                    $this->config[$type][$company['slug']]['coords'] : '';
                $company['coords_tablet'] = ! empty($this->config[$type][$company['slug']]) ?
                    $this->config[$type][$company['slug']]['coords_tablet'] : '';
                $newcompanies[] = $company;
            }
        }
        return $newcompanies;
    }

    /**
     * Retorna la lista de empresas agrupadas por tipo de stand
     * @param $fairId
     * @return array
     */
    public function listCompaniesByCategory($fairId)
    {
        //Quitamos de la lista del home de compañias a los patrocinadores
        $result = $this->listCompanies($fairId, null, SponsorRuc::getAll());
        return $this->divideCategory($result);
    }

    private function divideCategory($companyList)
    {
        $goldKeys = array_keys(array_column($companyList, 'stand'), 'ORO');
        $silverKeys = array_keys(array_column($companyList, 'stand'), 'PLATA');
        $bronzeKeys = array_keys(array_column($companyList, 'stand'), 'BRONCE');
        return [
            'gold' => array_intersect_key($companyList, array_flip($goldKeys)),
            'silver' => array_intersect_key($companyList, array_flip($silverKeys)),
            'bronze' => array_intersect_key($companyList, array_flip($bronzeKeys))
        ];
    }

    /**
     * Obtener el detalle de una determinada empresa.
     *
     * @param $companySlug
     * @return array
     */
    public function getCompanyDetailBySlug($companySlug)
    {
        try {
            $result = $this->client->get("fair/companies/$companySlug");
            return $this->decodeJson($result);
        }catch (Exception $exception) {
            return null;
        }
    }

    /**
     * Obtener el detalle de una determinada empresa.
     *
     * @param $fairId
     * @param $companyId
     * @param string $category
     * @return array
     */
    public function getCompanyDetail($fairId, $companyId, $category = 'Empleo')
    {
        try {
            $result = $this->client->get("fair/fairs/$fairId/companies/$companyId", [
                'query' => [
                    'category' => $category,
                    'preview' => 'active'
                ]
            ]);

            return $this->decodeJson($result);
        }catch (Exception $exception) {
            throw new FairException('No se pudo obtener el detalle de la empresa', $exception, 401);
        }
    }

    /**
     * Obtener las reglas de configuracion del modelo.
     * @param $modelId
     * @return mixed
     */
    public function getModelRules($modelId)
    {
        try {
            $result = $this->client->get("fair/stand-models/$modelId");
            $result = $this->decodeJson($result);

            return $result['data'];

        }catch (Exception $exception) {
            throw new FairException('No se pudo obtener la configuración del modelo', $exception, 401);
        }
    }

    /**
     * Obtener la imagen del anfitrión.
     * @param $amphitryonId
     * @return mixed
     */
    public function getAmphitryonData($amphitryonId)
    {
        try {
            $result = $this->client->get("fair/stand-amphitryons/$amphitryonId");

            return $this->decodeJson($result);
        }catch (Exception $exception) {
            throw new FairException('No se pudo obtener la información del anfitrión', $exception, 401);
        }
    }

    public function listSponsors($fairId)
    {
        $response = [
            'title' => 'PATROCINADOR',
            'data' => []
        ];

        try {

            $result = $this->client->get(sprintf('fair/%s/sponsors', $fairId), [
                'query' => [
                    'category' => FairCategory::JOB_CATEGORY
                ]
            ]);

            $response['data'] = $this->decodeJson($result);
            if (count($response['data']) > 1) {
                $response['title'] = 'PATROCINADORES';
            }

        } catch (Exception $exception) {
        }

        return $response;
    }

    public function getFrontCompanies($companies)
    {
        $frontCompanies = [];
        foreach($companies as $company => $front) {
            if ($front['mapping'] && $front['mapping_tablet']) {
                $frontCompanies[] = $front;
            }
        }
        return $frontCompanies;
    }
}