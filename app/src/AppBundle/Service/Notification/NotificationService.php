<?php

namespace AppBundle\Service\Notification;

use AppBundle\Service\AbstractHttpService;
use AppBundle\Service\Notification\Exception\NotificationException;
use Exception;
use GuzzleHttp\Client;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class NotificationService
 *
 * @package Aptitus\Identity\Infrastructure\Services\Notification
 * @author Pedro Vega Asto <pakgva@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class NotificationService extends AbstractHttpService
{
    protected $client;
    protected $siteUrl;

    /**
     * {@inheritdoc}
     */
    public function send($name, $firstSurname, $email, $password)
    {
        $response = $this->client->post('notification/email/send', [
            'json' => [
                'to' => $email,
                'name' => 'bienvenida-postulante',
                'subject' => 'Bienvenido a Aptitus.com',
                'data' => [
                    'user' => [
                        'fullName' => sprintf("%s %s", $name, $firstSurname),
                        'email' => $email,
                        'password' => $password
                    ],
                    'loginUrl' => sprintf("%s/%s", $this->siteUrl, '#login'),
                    'seeHereUrl' => $this->siteUrl,
                    'featuredProfileUrl' => sprintf("%s/%s", $this->siteUrl, 'perfil-destacado')
                ]
            ]
        ]);

        return ($response->getStatusCode() == JsonResponse::HTTP_OK);
    }

    public function shareEmailJob(
        $receiverMail,
        $nameUser,
        $userMessage,
        $jobsTitle,
        $jobsImage,
        $trimDescription,
        $jobsUrl,
        $jobsLocation,
        $jobsArea,
        $jobsCompany
    )
    {

        try {
            $result = $this->client->post("notification/email/send", [
                'json' => [
                    'to' => $receiverMail,
                    'subject' => sprintf(
                        '%s te ha enviado una oferta de empleo',
                        $nameUser
                    ),
                    'name' => 'aviso-compartir-por-email',
                    'data' => [
                        'user' => [
                            'message' => $userMessage
                        ],
                        'offer' => [
                            'title' => $jobsTitle,
                            'image' => $jobsImage,
                            'description' => $trimDescription,
                            'url' => $jobsUrl,
                            'location' => $jobsLocation,
                            'area' => $jobsArea,
                            'company' => $jobsCompany
                        ]
                    ]
                ]
            ]);

            $data = $this->decodeJson($result);
            return $data;
        } catch (Exception $exception) {
            throw new NotificationException($exception->getMessage(), 400, $exception);
        }
    }

}
