<?php

namespace AppBundle\Auth\Data;

use JsonSerializable;

/**
 * Class User
 *
 * @package AppBundle\Auth\User
 * @author Andy Ecca <andy.ecca@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class User implements JsonSerializable
{
    protected $id;
    protected $identityId;
    protected $accessToken;
    protected $email;
    protected $role;
    protected $name;
    protected $firstSurname;
    protected $secondSurname;
    protected $summary;
    protected $documentType;
    protected $documentNumber;
    protected $birthDate;
    protected $gender;
    protected $age;
    protected $location;
    protected $locationId;
    protected $country;
    protected $countryId;
    protected $provider = 'feria';
    protected $loggedWithProvider = false;

    protected $data;

    public static function fromData(array $response)
    {
        $obj = new User();
        $obj->id             =  $response['data']['id'];
        $obj->name           =  $response['data']['name'];
        $obj->email          =  $response['data']['email'];
        $obj->identityId     =  $response['data']['identity_id'];
        $obj->firstSurname   =  $response['data']['first_surname'];
        $obj->secondSurname  =  $response['data']['second_surname'];
        $obj->documentNumber =  $response['data']['document_number'];
        $obj->documentType   =  $response['data']['document_type'];
        $obj->gender         =  $response['data']['gender'];
        $obj->age            =  $response['data']['age'];
        $obj->birthDate      =  $response['data']['birth_date'];
        $obj->country        =  $response['data']['country'];
        $obj->countryId      =  $response['data']['country_id'];
        $obj->location       =  $response['data']['location'];
        $obj->locationId     =  $response['data']['location_id'];
        $obj->provider       =  $response['data']['provider'];

        $obj->setAccessToken(AccessToken::fromData($response));
        $obj->data  = $response;

        return $obj;
    }

    /**
     * @return array
     */
    public function getData()
    {
        return $this->data;
    }

    public function getId()
    {
        return $this->id;
    }

    /**
     * @return int
     */
    public function getIdentityId()
    {
        return $this->identityId;
    }

    public function setAccessToken(AccessToken $token)
    {
        $token->setUserId($this->id);

        $this->accessToken = $token;
    }

    public function setRole(String $role)
    {
        $this->role = $role;
    }

    public function email(): String
    {
        return $this->email;
    }

    public function getAccessToken(): AccessToken
    {
        return $this->accessToken;
    }

    public function firstName()
    {
        return $this->name;
    }

    public function lastName()
    {
        return $this->firstSurname;
    }

    public function role()
    {
        return $this->role;
    }

    public function toArray()
    {
        return $this->data;
    }

    /**
     * {@inheritdoc}
     */
    public function jsonSerialize()
    {
        return [
           'user_id'       => $this->id,
           'identity_id'   => $this->identityId,
           'name'          => $this->name,
           'email'         => $this->email,
           'first_surname' => $this->firstSurname,
           'second_surname' => $this->secondSurname
        ];
    }
}