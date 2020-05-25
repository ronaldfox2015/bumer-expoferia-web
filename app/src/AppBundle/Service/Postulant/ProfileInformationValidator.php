<?php


namespace AppBundle\Service\Postulant;

use AppBundle\Entity\Postulant\ProfileInformation;
use AppBundle\Service\Postulant\Util\Postulant;
use Symfony\Component\HttpFoundation\ParameterBag;

class ProfileInformationValidator extends EntityValidator implements Validator
{
    const FAIR_JOB_APPLICATION = 'fair job application';
    const REGISTER = 'register';

    function __construct(ParameterBag $requestData, $type)
    {
        $requestData->set('type', $type);
        parent::__construct($requestData);
    }

    public function setData(ParameterBag $requestData)
    {
        $surname = Postulant::extractSurname($requestData->get('last_name'));

        $this->entity = new ProfileInformation;
        $this->entity->name = $requestData->get('name');
        $this->entity->lastName = $requestData->get('last_name');
        $this->entity->firstSurname = $surname['first_surname'];
        $this->entity->secondSurname = $surname['second_surname'];
        $this->entity->email = $requestData->get('email');
        $this->entity->password = $requestData->get('password');
        $this->entity->birthDate = Postulant::formatDate($requestData->get('birth_date'));
        $this->entity->docType = $requestData->get('doc_type');
        $this->entity->docNumber = $requestData->get('doc_number');
        $this->entity->gender = $requestData->get('gender');
        $this->entity->cellphone = $requestData->get('cellphone');
        $this->entity->locationId = $requestData->get('location_id');
        $this->entity->countryId = $requestData->get('country_id');
        $this->entity->hasExperience = $requestData->get('has_experience');
        $this->entity->type = $requestData->get('type');
    }
}