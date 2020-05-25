<?php


namespace AppBundle\Service\Postulant;


use AppBundle\Entity\Postulant\Experience;
use AppBundle\Service\Job\Util\Job;
use Symfony\Component\HttpFoundation\ParameterBag;

class ExperienceValidator extends EntityValidator implements Validator
{
    public function setData(ParameterBag $requestData)
    {
        $currentlyWorking = filter_var($requestData->get('currently_working'), FILTER_VALIDATE_BOOLEAN);
        if (!empty($requestData->get('experience_date_start'))) {
            $startDate = Job::chunkComposeDate($requestData->get('experience_date_start'));
            $requestData->set('start_month', $startDate['month']);
            $requestData->set('start_year', $startDate['year']);
        }

        if (!$currentlyWorking) {
            if (!empty($requestData->get('experience_date_end'))) {
                $endDate = Job::chunkComposeDate($requestData->get('experience_date_end'));
                $requestData->set('end_month', $endDate['month']);
                $requestData->set('end_year', $endDate['year']);
            }
        }

        $this->entity = new Experience;
        $this->entity->company = $requestData->get('company');
        $this->entity->industry = $requestData->get('industry');
        $this->entity->job = $requestData->get('job');
        $this->entity->levelId = $requestData->get('level_id');
        $this->entity->areaId = $requestData->get('area_id');
        $this->entity->setJobId($requestData->get('job_id'));
        $this->entity->experienceDateStart = $requestData->get('experience_date_start');
        $this->entity->startMonth = $requestData->get('start_month');
        $this->entity->startYear = $requestData->get('start_year');
        $this->entity->experienceDateEnd = $requestData->get('experience_date_end');
        $this->entity->endMonth = $requestData->get('end_month');
        $this->entity->endYear = $requestData->get('end_year');
        $this->entity->currentlyWorking = $currentlyWorking;
        $this->entity->description = $requestData->get('description');
        $this->entity->place = $requestData->get('place', Experience::DEFAULT_PLACE);
        $this->entity->projectTypeId = $requestData->get('project_type_id');
        $this->entity->projectName = $requestData->get('project_name');
        $this->entity->projectBudget = $requestData->get('project_budget');
    }
}