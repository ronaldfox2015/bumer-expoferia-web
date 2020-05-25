<?php

namespace AppBundle\Service\Job\Util;

use AppBundle\Entity\Postulant\ProfileInformation;
use AppBundle\Service\Postulant\Util\Postulant;

/**
 * Class Job
 *
 * @package AppBundle\Service\Job\Util
 * @author Alfredo Espiritu <alfredo.espiritu.m@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class Job
{
    const MIN_REGISTERED_STUDIES = 1;
    const MIN_REGISTERED_EXPERIENCES = 1;
    const APPLY_JOB = 'postular';
    const INCOMPLETE_INFORMATION_HASH = 'actualizarCV';
    const QUESTIONS_HASH = 'preguntasAdicionales';

    public static function getNextActionHash($hasQuestions = false, $information = array())
    {
        $response = self::APPLY_JOB;
        $hasCompleteInformation = self::hasCompleteInformation($information['profile'], $information['study'], $information['experience']);

        if (!$hasCompleteInformation) {
            $response = self::INCOMPLETE_INFORMATION_HASH;
        } elseif ($hasQuestions) {
            $response = self::QUESTIONS_HASH;
        }

        return $response;
    }

    public static function hasCompleteInformation($profile = array(), $studies = array(), $experiences = array())
    {
        $hasExperience = Postulant::filterHasExperience($profile['has_experience']);

        return self::hasBasicInformation($profile)
            && self::hasMinRegisteredExperiences($experiences, $hasExperience)
            && self::hasMinRegisteredStudies($studies);
    }

    private static function hasBasicInformation($profile = array())
    {
        $isComplete = !empty($profile['names'])
            && !empty($profile['first_surname'])
            && !empty($profile['birthed_at'])
            && !empty($profile['cellphone'])
            && !empty($profile['gender'])
            && !empty($profile['document_type'])
            && !empty($profile['document_number'])
            && !empty($profile['country_id']);

        if ($profile['country_id'] == ProfileInformation::PERU_LOCATION_ID) {
            $isComplete = $isComplete && !empty($profile['location_id']);
        }

        return $isComplete;
    }

    public static function hasMinRegisteredStudies($studies = array())
    {
        return count($studies) >= self::MIN_REGISTERED_STUDIES;
    }

    public static function hasMinRegisteredExperiences($experiences = array(), $hasExperience = null)
    {
        if (is_null($hasExperience)) {
            return false;
        }

        return $hasExperience === false || count($experiences) >= self::MIN_REGISTERED_EXPERIENCES;
    }

    public static function buildDate($month, $year)
    {
        if ($month && $year) {
            return sprintf('%s/%s', $month, $year);
        }

        return null;
    }

    public static function chunkComposeDate($date)
    {
        $chunkDate = explode('/', $date);
        return ['month' => (int)$chunkDate[0], 'year' => (int)$chunkDate[1]];
    }

    public static function cutText($haystack, $replace = 0)
    {
        $totalreplace = (strlen($haystack) > $replace )? $replace : 0;
        $text = substr($haystack, 0, $totalreplace);
        return (strlen($haystack) == $replace) ? $text : sprintf('%s ...', $text);
    }
}