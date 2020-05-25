<?php

namespace AppBundle\Controller;

use AppBundle\Service\Base\Enum\UserRole;
use AppBundle\Service\Postulant\UserService;
use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Class UserController
 *
 * @package AppBundle\Controller
 * @author Ronald Cutisaca Ramirez <ronaldfox_17@hotmail.com>
 * @copyright (c) 2017, Orbis
 */
class UserController extends Controller
{
    protected $userService;

    /**
     * @Route("/user/not-exists", name="user_get")
     * @Method("GET")
     * @param Request $request
     * @return JsonResponse
     */
    public function getUserNotExists(Request $request)
    {
        $notExists = true;

        if (!$request->isXmlHttpRequest()) {
            throw new NotFoundHttpException();
        }

        try {

            $email = $request->query->get('email', false);
            $user = $this->get(UserService::class)->getByEmailAndRole($email, UserRole::POSTULANT);

            if ($user['data']['active']) {
                $notExists = false;
            }

        } catch (Exception $exception) {
            $notExists = true;
        }

        return new JsonResponse($notExists);
    }
}