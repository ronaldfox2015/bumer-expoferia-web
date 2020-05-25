<?php

namespace AppBundle\Service\Base;

use AppBundle\Auth\SessionAuthentifier;
use AppBundle\Service\Job\JobService;

/**
 * Class DataLayerService
 *
 * @author Paul Taboada <pacharly89@gmail.com>
 * @package AppBundle\Service\Base
 * @copyright (c) 2017, Orbis
 */
class DataLayerService
{
    protected $auth;

    const CATEGORY_DEJARCV = 'dejarcv';
    const CATEGORY_POSTULACION = 'postulacion';
    const CATEGORY_POSTULACION_SUCCESS = 'postulacion_success';
    const CATEGORY_COMPANY = 'company';
    const CATEGORY_PARTNER = 'partner';
    const CATEGORY_ZEPPELIN = 'zeppelin';
    const CATEGORY_LOGO = 'logo';
    const CATEGORY_PULLDOWN = 'pulldown';
    const CATEGORY_REGISTER_LOGIN = 'register_login';
    const CATEGORY_COMPANIES = 'companies';
    const CATEGORY_SLIDER = 'slider';
    const CATEGORY_INFO = 'info';
    const CATEGORY_RRSS = 'rrss';
    const CATEGORY_JOB = 'job';
    const CATEGORY_CV = 'cv';

    /**
     * DataLayerService constructor.
     * @param SessionAuthentifier $auth
     */
    public function __construct(SessionAuthentifier $auth)
    {
        $this->auth = $auth;
    }

    public function createDataLayer($category, $nameSection, $value, $params = [])
    {
        $userId = ($this->auth->isLoggedIn() ? $this->auth->getUser()->getIdentityId() : 0);
        $params = $this->setDefaultValues($params);
        switch ($category) {
            case self::CATEGORY_DEJARCV:
                $categoryName = 'ExpoAptitusDejarCV';
                $dataLabel = $userId . '_' . $params['companyName'];
                break;
            case self::CATEGORY_POSTULACION:
            case self::CATEGORY_POSTULACION_SUCCESS:
                $categoryName = 'Postulacion ExpoAptitus';
                $dataLabel = $userId . '_' . $params['jobId'];

                if (!$params['hasQuestions'] && !$params['applied'] && $this->auth->isLoggedIn()) {
                    $nameSection = 'Postulacion';
                    $value = 1;
                }
                break;
            case self::CATEGORY_COMPANY:
                $categoryName = 'Expoaptitus Logo Empresa Participante';

                if (JobService::STAND_EXPOFERIA_SLUG == $params['companySlug']) {
                    $categoryName = 'Expoaptitus Stand Avisos Destacados';
                }
                $dataLabel = $userId . '|' . $params['pagePath'];
                break;
            case self::CATEGORY_PARTNER:
                $categoryName = 'Expoaptitus Banderolas de Patrocinio';
                $dataLabel = $userId . '|' . $params['pagePath'];
                break;
            case self::CATEGORY_ZEPPELIN:
                $categoryName = 'Expoaptitus Zepelin';
                $dataLabel = $userId . '|' . $params['pagePath'];
                break;
            case self::CATEGORY_LOGO:
                $categoryName = 'Expoaptitus Logo';
                $dataLabel = $userId . '|' . $params['pagePath'];
                break;
            case self::CATEGORY_PULLDOWN:
                $categoryName = 'Expoaptitus Pulldown Empresas Participantes';
                $dataLabel = $userId . '|' . $params['pagePath'];
                break;
            case self::CATEGORY_REGISTER_LOGIN:
                $categoryName = 'Expoaptitus Botón Registro | Login';
                $dataLabel = $userId . '|' . $params['pagePath'];
                break;
            case self::CATEGORY_COMPANIES:
                $categoryName = 'Expoaptitus Empresas Participantes';
                $dataLabel = $userId . '|' . $params['pagePath'];
                break;
            case self::CATEGORY_SLIDER:
                $categoryName = 'Expoaptitus Slider';
                $dataLabel = $userId . '|' . $params['companySlug'];
                break;
            case self::CATEGORY_INFO:
                $categoryName = 'Expoaptitus Link Información Empresa';
                $dataLabel = $userId . '|' . $params['companySlug'];
                break;
            case self::CATEGORY_RRSS:
                $categoryName = 'Expoaptitus Logos RRSS Empresa';
                $dataLabel = $userId . '|' . $params['companySlug'];
                break;
            case self::CATEGORY_JOB:
                $categoryName = 'Expoaptitus Aviso de Trabajo';
                $dataLabel = $userId . '|' .
                    sprintf(
                        '%s,%s,%s,%s,%s',
                        $params['jobName'],
                        $params['jobId'],
                        $params['first'],
                        $params['last'],
                        $params['page']
                    );
                break;
            case self::CATEGORY_CV:
                $categoryName = 'Expoaptitus Dejar CV';
                $dataLabel = $userId;
                break;
            default:
                $categoryName = '';
                $dataLabel = '';
        }

        $cadDataLayer = "dataLayer.push({'event':'Expoaptitus', 'category':'$categoryName',".
            " 'action':'$nameSection', 'label':'" . $dataLabel . "', 'value':$value})";

        switch ($category) {
            case self::CATEGORY_POSTULACION:
                $datalayer = ($this->auth->isLoggedIn() && $params['applied']) ? '' : $cadDataLayer;
                break;
            case self::CATEGORY_POSTULACION_SUCCESS:
            default:
                $datalayer = $cadDataLayer;
        }

        return $datalayer;
    }

    private function setDefaultValues($params)
    {
        if (!isset($params['companyName'])) {
            $params['companyName'] = '';
        }
        if (!isset($params['companySlug'])) {
            $params['companySlug'] = '';
        }
        if (!isset($params['jobId'])) {
            $params['jobId'] = 0;
        }
        if (!isset($params['jobName'])) {
            $params['jobName'] = '';
        }
        if (!isset($params['hasQuestions'])) {
            $params['hasQuestions'] = false;
        }
        if (!isset($params['applied'])) {
            $params['applied'] = false;
        }
        if (!isset($params['pagePath'])) {
            $params['pagePath'] = '';
        }
        if (!isset($params['companySlug'])) {
            $params['companySlug'] = '';
        }
        if (!isset($params['first'])) {
            $params['first'] = 0;
        }
        if (!isset($params['last'])) {
            $params['last'] = 0;
        }
        if (!isset($params['page'])) {
            $params['page'] = 0;
        }
        return $params;
    }
}