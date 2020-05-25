<?php

namespace AppBundle\Entity\Postulant;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Class Experience
 *
 * @package AppBundle\Entity\Postulant
 * @author Alfredo Espititu <alfredo.espiritu.m@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class Experience
{
    const DEFAULT_PLACE = 'oficina';
    const OTHER_JOB_ID = 1292;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $company;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $industry;

    public $jobId;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $levelId;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $job;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $areaId;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $place;

    public $projectTypeId;

    public $projectName;

    public $projectBudget;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $experienceDateStart;

    public $startMonth;

    public $startYear;

    /**
     * @Assert\Expression(
     *     expression="!((!this.currentlyWorking) && value == '')",
     *     message="Este campo es requerido"
     * )
     */
    public $experienceDateEnd;

    public $endMonth;

    public $endYear;

    public $currentlyWorking;

    /**
     * @Assert\NotBlank(message="Este campo es requerido")
     */
    public $description;

    public function setJobId($jobId)
    {
        $this->jobId = (is_null($jobId) || (int)$jobId < 1) ? self::OTHER_JOB_ID : $jobId;
    }
}