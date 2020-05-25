<?php

namespace AppBundle\Auth\Session;

class Util
{
    /**
     * Decode session data handler
     *
     * @param $encodedSessionData
     * @return array
     */
    public static function session_decode($encodedSessionData)
    {
        if ('' === $encodedSessionData) {
            return [];
        }

        if (is_array($encodedSessionData)) {
            $encodedSessionData = $encodedSessionData[0];
        }

        preg_match_all('/(^|;|\})(\w+)\|/i', $encodedSessionData, $matchesarray, PREG_OFFSET_CAPTURE);

        $decodedData = [];
        $lastOffset = null;
        $currentKey = '';

        foreach ($matchesarray[2] as $value) {
            $offset = $value[1];
            if (null !== $lastOffset) {
                $valueText = substr($encodedSessionData, $lastOffset, $offset - $lastOffset);
                $decodedData[$currentKey] = unserialize($valueText);
            }
            $currentKey = $value[0];
            $lastOffset = $offset + strlen($currentKey) + 1;
        }

        $valueText = substr($encodedSessionData, $lastOffset);
        $decodedData[$currentKey] = unserialize($valueText);

        return $decodedData;
    }

    /**
     * Encode session data handler
     *
     * @param $sessionData
     * @return string
     */
    public static function session_encode($sessionData)
    {
        if (empty($sessionData)) {
            return '';
        }

        $encodedData = '';

        foreach ($sessionData as $key => $value) {
            $encodedData .= $key . '|' . serialize($value);
        }

        return $encodedData;
    }
}