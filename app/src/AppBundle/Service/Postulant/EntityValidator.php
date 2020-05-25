<?php


namespace AppBundle\Service\Postulant;


use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\Serializer\NameConverter\CamelCaseToSnakeCaseNameConverter;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Component\Validator\Validation;

abstract class EntityValidator
{
    protected $errors = [];
    protected $entity;

    public function __construct(ParameterBag $requestData)
    {
        $this->setData($requestData);
        $this->validateEntity();
    }

    /**
     * @param $entity
     * @return \Symfony\Component\Validator\ConstraintViolationListInterface
     */
    public function getValidator($entity)
    {
        $validator = Validation::createValidatorBuilder()
            ->enableAnnotationMapping()
            ->getValidator();
        return $validator->validate($entity);
    }

    public function getEntityConstraintList(ConstraintViolationListInterface $errors)
    {
        $messages = [];

        foreach ($errors as $violation) {
            $messages[$violation->getPropertyPath()][] = $violation->getMessage();
        }

        return $messages;
    }

    protected function validateEntity()
    {
        $this->errors = $this->getEntityConstraintList(
            $this->getValidator($this->entity)
        );
    }

    public function isValid()
    {
        return empty($this->errors);
    }

    public function getErrors()
    {
        $converter = new CamelCaseToSnakeCaseNameConverter;
        $errors = $this->errors;

        foreach ($errors as $key => $value) {
            unset($errors[$key]);
            $errors[$converter->normalize($key)] = $value;
        }

        return $errors;
    }

    public function getEntity()
    {
        return $this->entity;
    }

    public abstract function setData(ParameterBag $requestData);
}