<?php


namespace AppBundle\Service\Postulant;


use AppBundle\Entity\Postulant\Study;
use AppBundle\Service\Job\Util\Job;
use Symfony\Component\HttpFoundation\ParameterBag;

class StudyValidator extends EntityValidator implements Validator
{
    public function setData(ParameterBag $requestData)
    {
        $currentlyStudying = filter_var($requestData->get('currently_studying'), FILTER_VALIDATE_BOOLEAN);
        if (!empty($requestData->get('study_date_start'))) {
            $startDate = Job::chunkComposeDate($requestData->get('study_date_start'));
            $requestData->set('start_month', $startDate['month']);
            $requestData->set('start_year', $startDate['year']);
        }

        if (!$currentlyStudying) {
            if (!empty($requestData->get('study_date_end'))) {
                $endDate = Job::chunkComposeDate($requestData->get('study_date_end'));
                $requestData->set('end_month', $endDate['month']);
                $requestData->set('end_year', $endDate['year']);
            }
        }

        $this->entity = new Study;
        $this->entity->gradeId = $requestData->get('grade_id');
        $this->entity->stateId = $requestData->get('state_id');
        $this->entity->institution = $requestData->get('institution');
        $this->entity->institutionId = $requestData->get('institution_id');
        $this->entity->career = $requestData->get('career');
        $this->entity->careerId = $requestData->get('career_id');
        $this->entity->startMonth = $requestData->get('start_month');
        $this->entity->startYear = $requestData->get('start_year');
        $this->entity->studyDateStart = $requestData->get('study_date_start');
        $this->entity->endMonth = $requestData->get('end_month');
        $this->entity->endYear = $requestData->get('end_year');
        $this->entity->studyDateEnd = $requestData->get('study_date_end');
        $this->entity->currentlyStudying = $currentlyStudying;
        $this->entity->countryId = $requestData->get('country_id', Study::DEFAULT_COUNTRY);
    }
}