<?php

namespace AppBundle\Auth\Data;

use Aptitus\Common\AbstractEnum;

final class UserRoleType extends AbstractEnum
{
    const POSTULANT      = 'postulante';
    const COMPANY        = 'empresa';
    const COMPANY_ADMIN  = 'empresa_admin';
}