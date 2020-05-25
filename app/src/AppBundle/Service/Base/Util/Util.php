<?php

namespace AppBundle\Service\Base\Util;

/**
 * Class Util
 *
 * @package AppBundle\Service\Base\Util
 * @author Joseph Marcilla <jbmarflo@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class Util
{
    public static function getIdJobBySlug($slugJob)
    {
        $id = null;
        $urlJob = explode('-', $slugJob);
        $count = count($urlJob);

        if ($count > 0) {
            $jobId = $urlJob[$count - 1];
            if ( ! empty($jobId)) {
                $id = $jobId;
            }
        }
        return $id;
    }
}