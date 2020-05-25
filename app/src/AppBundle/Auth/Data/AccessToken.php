<?php

namespace AppBundle\Auth\Data;

use JsonSerializable;

class AccessToken implements JsonSerializable
{
    protected $token;
    protected $expiresIn;
    protected $expires;
    protected $userId = null;
    protected $tokenType;

    public static function fromData(array $data)
    {
        $obj = new AccessToken();
        $obj->token     = $data['access_token'];
        $obj->expiresIn = (int)(isset($data['expires_in']) ? $data['expires_in'] : $data['expires']);
        $obj->expires   = time() + $obj->expiresIn;

        if (isset($data['token_type'])) {
            $obj->tokenType = $data['token_type'];
        }

        if (isset($data['user_id'])) {
            $obj->userId = $data['user_id'];
        }

        return $obj;
    }

    /**
     * @return String
     */
    public function getToken(): String
    {
        return $this->token;
    }

    public function getExpiresIn(): int
    {
        return $this->expiresIn;
    }

    public function hasExpired()
    {
        return $this->expires < time();
    }

    /**
     * @param String $token
     */
    public function setToken(String $token)
    {
        $this->token = $token;
    }

    /**
     * @param int $userId
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
    }

    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * {@inheritdoc}
     */
    function jsonSerialize()
    {
        return [
            'access_token' => $this->token,
            'expires_in' => $this->expiresIn,
            'token_type' => $this->tokenType
        ];
    }
}