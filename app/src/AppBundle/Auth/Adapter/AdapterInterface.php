<?php

namespace AppBundle\Auth\Adapter;

use AppBundle\Auth\Data\AccessToken;
use AppBundle\Auth\Data\User;
use AppBundle\Entity\Postulant\ProfileInformation;

interface AdapterInterface
{
    /**
     * Obtener un accesstoken
     *
     * @return AccessToken
     */
    public function requestAccessToken();

    /**
     * Login de usuario mediante sus credenciales.
     *
     * @param String $email Email del usuario
     * @param String $password Clave del usuario
     * @param String $role Rol del usuario
     * @param String $provider provider (aptitus, facebook, google, etc)
     * @param String $providerToken token generado por el provider
     *
     * @return User Se retorn el usuario
     */
    public function login($email, $password, $role, $provider = null, $providerToken = null);

    /**
     * @param String $accessToken
     */
    public function logout($accessToken);

    /**
     * @param $email
     * @param $password
     * @param $profile
     * @param $provider
     * @return array
     */
    public function authorize($email, $password, $profile, $provider);

    /**
     * Registro de usuario.
     *
     * @param ProfileInformation $profileInformation Datos del usuario
     * @return int Se retorna el identificador del usuario
     */
    public function register(ProfileInformation $profileInformation);

    /**
     * @param String $email
     * @param String $role Rol del usuario.
     */
    public function recoveryPassword($email, $role);
}