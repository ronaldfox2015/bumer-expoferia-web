<?php

namespace AppBundle\Entity\Postulant;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Class ProfileInformation
 *
 * @package AppBundle\Entity\Postulant
 * @author Alfredo Espititu <alfredo.espiritu.m@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class ProfileInformation
{
    const PERU_LOCATION_ID = 2533;
    const HAS_NOT_EXPERIENCE = 0;
    const HAS_EXPERIENCE = 1;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $name;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $lastName;

    public $firstSurname;

    public $secondSurname;

    /**
     * @Assert\Expression(
     * expression="!(this.type == constant('AppBundle\\Service\\Postulant\\ProfileInformationValidator::REGISTER') && value == '')",
     * message="Este campo es requerido"
     * )
     */
    public $email;

    /**
     * @Assert\Expression(
     * expression="!(this.type == constant('AppBundle\\Service\\Postulant\\ProfileInformationValidator::REGISTER') && value == '')",
     * message="Este campo es requerido"
     * )
     */
    public $password;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $birthDate;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $docType;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $docNumber;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $gender;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $cellphone;

    public $telephone;

    public $address;

    public $civilStatus;

    public $disabilityType;

    public $conadisCode;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $countryId;

    /**
     * @Assert\Expression(
     * expression="!(this.countryId == constant('AppBundle\\Entity\\Postulant\\ProfileInformation::PERU_LOCATION_ID') && value == '')",
     * message="Este campo es requerido"
     * )
     */
    public $locationId;

    public $moveToProvinceOrAbroad;

    public $facebook;

    public $twitter;

    public $summary;

    public $hasExperience;

    public $type;
    
    public function jsonFormatRegister()
    {
        return [
            'document_number' => $this->docNumber,
            'email' => $this->email,
            'second_surname' => $this->secondSurname,
            'first_surname' => $this->firstSurname,
            'password' => $this->password,
            'location_id' => (int)$this->locationId,
            'telephone' => $this->telephone,
            'name' => $this->name,
            'birth_date' => $this->birthDate,
            'country_id' => (int)$this->countryId,
            'document_type' => $this->docType,
            'gender' => $this->gender,
            'provider' => 'aptitus',
            'cellphone' => $this->cellphone
        ];
    }
}