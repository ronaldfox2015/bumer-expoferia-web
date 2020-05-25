<?php

namespace AppBundle\Service\Postulant\Util;

use AppBundle\Service\Job\Util\Job;
use DateTime;
use Symfony\Component\HttpFoundation\ParameterBag;

/**
 * Class Postulant
 *
 * @package AppBundle\Service\Postulant\Util
 * @author Alfredo Espiritu <alfredo.espiritu.m@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class Postulant
{
    /**
     * Validate if the last name contains first and second surname
     * @param $lastName
     * @return array
     */
    public static function extractSurname($lastName)
    {
        $surname = [
            'first_surname' => null,
            'second_surname' => null
        ];

        $parts = explode(' ', trim($lastName));
        $parts = array_filter($parts, 'strlen');

        if (count($parts) >= 2) {

            $surnamePartsWithoutArticles = array_filter(
                $parts,
                function($var){
                    return !in_array(strtolower($var), ['de', 'la', 'del']);
                }
            );

            if (count($surnamePartsWithoutArticles) >= 2) {
                current($surnamePartsWithoutArticles);
                $indexFirstSurname = key($surnamePartsWithoutArticles);

                $firstSurnameParts = array_filter(
                    $parts,
                    function($key) use($indexFirstSurname){
                        return $key <= $indexFirstSurname;
                    },
                    ARRAY_FILTER_USE_KEY
                );

                $secondSurnameParts = array_filter(
                    $parts,
                    function($key) use($indexFirstSurname){
                        return $key > $indexFirstSurname;
                    },
                    ARRAY_FILTER_USE_KEY
                );

                $surname = [
                    'first_surname' => implode(' ', $firstSurnameParts),
                    'second_surname' => implode(' ', $secondSurnameParts)
                ];

            } else {
                $surname['first_surname'] = trim($lastName);
            }
        }else{
            $surname['first_surname'] = trim($lastName);
        }

        return $surname;
    }

    public static function formatDate($date, $inputFormat = 'd/m/Y', $outputFormat = 'Y-m-d')
    {
        if ($date) {
            $datetime = DateTime::createFromFormat($inputFormat, $date);
            return $datetime->format($outputFormat);
        }

        return null;
    }

    public static function filterHasExperience($hasExperience)
    {
        if (is_null($hasExperience) || $hasExperience === '') {
            return null;
        }

        return filter_var($hasExperience, FILTER_VALIDATE_BOOLEAN);
    }

    public static function formatLastName($firstSurname, $secondSurname)
    {
        if (empty($firstSurname) && empty($secondSurname)) {
            return null;
        }

        return sprintf('%s %s', $firstSurname, $secondSurname);
    }

    public static function formatProfileInformationData($profileInformation = array())
    {
        $profile = new ParameterBag($profileInformation['profile']);
        $experience = new ParameterBag($profileInformation['experience']);
        $study = new ParameterBag($profileInformation['study']);

        $data = [
            'personal_information' => [
                'name' => self::formatValue($profile->get('names')),
                'last_name' => self::formatLastName($profile->get('first_surname'), $profile->get('second_surname')),
                'birth_date' => self::formatDate($profile->get('birthed_at'), 'Y-m-d', 'd/m/Y'),
                'email' => self::formatValue($profile->get('email')),
                'cellphone' => self::formatValue($profile->get('cellphone')),
                'gender' => self::formatValue($profile->get('gender')),
                'doc_type' => self::formatValue($profile->get('document_type')),
                'doc_number' => self::formatValue($profile->get('document_number')),
                'country_id' => self::formatValue($profile->get('country_id')),
                'location' => self::formatValue($profile->get('location')),
                'location_id' => self::formatValue($profile->get('location_id'))
            ],
            'experience' => [
                'experience_id' => $experience->get('id'),
                'company' => self::formatValue($experience->get('company')),
                'industry' => self::formatValue($experience->get('industry')),
                'job' => self::formatValue($experience->get('job')),
                'job_txt' => self::formatValue($experience->get('job')),
                'job_id' => self::formatValue($experience->get('job_id')),
                'level_id' => self::formatValue($experience->get('level_id')),
                'area' => self::formatValue($experience->get('area')),
                'area_id' => self::formatValue($experience->get('area_id')),
                'experience_date_start' => Job::buildDate($experience->get('start_month'), $experience->get('start_year')),
                'experience_date_end' => Job::buildDate($experience->get('end_month'), $experience->get('end_year')),
                'currently_working' => $experience->get('currently_working'),
                'description' => self::formatValue($experience->get('description')),
                'has_experience' => self::filterHasExperience($profile->get('has_experience'))
            ],
            'study' => [
                'study_id' => $study->get('id'),
                'grade' => self::formatValue($study->get('grade')),
                'grade_id' => self::formatValue($study->get('grade_id')),
                'state' => self::formatValue($study->get('state')),
                'state_id' => self::formatValue($study->get('state_id')),
                'institution' => self::formatValue($study->get('institution')),
                'institution_txt' => self::formatValue($study->get('institution')),
                'institution_id' => self::formatValue($study->get('institution_id')),
                'career' => self::formatValue($study->get('career')),
                'career_txt' => self::formatValue($study->get('career')),
                'career_id' => self::formatValue($study->get('career_id')),
                'study_date_start' => Job::buildDate($study->get('start_month'), $study->get('start_year')),
                'study_date_end' => Job::buildDate($study->get('end_month'), $study->get('end_year')),
                'currently_studying' => $study->get('currently_studying')
            ],
            'has_complete_information' => Job::hasCompleteInformation(
                $profileInformation['profile'],
                $profileInformation['study'],
                $profileInformation['experience']
            )
        ];

        return $data;
    }

    private static function formatValue($value)
    {
        if (is_null($value) || $value === "" || $value === 0) {
            return null;
        }

        return $value;
    }

}