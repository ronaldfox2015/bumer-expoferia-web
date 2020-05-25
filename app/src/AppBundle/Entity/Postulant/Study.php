<?php

namespace AppBundle\Entity\Postulant;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Class Study
 *
 * @package AppBundle\Entity\Postulant
 * @author Alfredo Espititu <alfredo.espiritu.m@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class Study
{
    const DEFAULT_COUNTRY = 2533;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $gradeId;

    public $stateId;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $institution;

    public $institutionId;

    public $career;

    public $careerId;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $studyDateStart;

    public $startMonth;

    public $startYear;

    /**
     * @Assert\Expression(
     *     expression="!((!this.currentlyStudying) && value == '')",
     *     message="Este campo es requerido"
     * )
     */
    public $studyDateEnd;

    public $endMonth;

    public $endYear;

    public $currentlyStudying;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $countryId;
}