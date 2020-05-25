<?php


namespace AppBundle\Service\Postulant;



use Symfony\Component\HttpFoundation\ParameterBag;

interface Validator
{
    public function setData(ParameterBag $requestData);

    public function isValid();

    public function getEntity();
}