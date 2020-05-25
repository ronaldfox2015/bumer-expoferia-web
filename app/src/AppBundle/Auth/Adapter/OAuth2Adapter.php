<?php

namespace AppBundle\Auth\Adapter;

use AppBundle\Auth\Data\AccessToken;
use AppBundle\Auth\Exception\AuthException;
use AppBundle\Auth\Data\User;
use AppBundle\Entity\Postulant\ProfileInformation;
use AppBundle\Service\Postulant\ProfileInformationValidator;
use AppBundle\Util\GraphQl;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Psr\Http\Message\ResponseInterface;

/**
 * Class OAuth2Adapter
 *
 * @package AppBundle\Auth\Adapter
 * @author Andy Ecca <andy.ecca@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class OAuth2Adapter implements AdapterInterface
{
    protected $client;
    protected $clientId;
    protected $clientSecret;
    protected $accessor;

    public function __construct(
        Client $client,
        String $clientId,
        String $clientSecret)
    {
        $this->client = $client;
        $this->clientId = $clientId;
        $this->clientSecret = $clientSecret;
    }

    /**
     * {@inheritdoc}
     */
    public function requestAccessToken()
    {
        try {
            $response = $this->client->post('oauth2/authorize', [
                'json' => [
                    'grant_type'    => 'client_credentials',
                    'client_id'     => $this->clientId,
                    'client_secret' => $this->clientSecret,
                ]
            ]);

            return AccessToken::fromData(
                $this->parseResponse($response)
            );

        }catch (Exception $ex) {
            list($code, $message) = $this->parseException($ex, 'No se pudo obtener el token');

            throw new AuthException($message, $code, $ex);
        }
    }
    /**
     * {@inheritdoc}
     */
    public function login($email, $password, $role, $provider = null, $providerToken = null)
    {
        try {
            $response = $this->client->post('oauth2/login', [
                'json' => [
                    'grant_type'     => 'password',
                    'client_id'      => $this->clientId,
                    'client_secret'  => $this->clientSecret,
                    'role'           => $role,
                    'email'          => $email,
                    'password'       => $password,
                    'provider'       => $provider,
                    'provider_token' => $providerToken
                ]
            ]);

            return $this->parseUser($this->parseResponse($response), $role);

        } catch (Exception $ex) {
            list($code, $message) = $this->parseException($ex, 'No se pudo iniciar sesión');

            throw new AuthException($message, $code, $ex);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function logout($accessToken)
    {
        try {
            $this->client->post('oauth2/logout', [
                'json' => ['token' => $accessToken]
             ]);

        } catch (Exception $ex) {
            throw new AuthException('No se pudo cerrar sesión', $ex->getCode(), $ex);
        }
    }


    /**
     * {@inheritdoc}
     */
    public function register(ProfileInformation $profileInformation)
    {
        try {

            $response = $this->client->post('register', [ 'json' => $profileInformation->jsonFormatRegister() ]);
            $jsonData = $this->parseResponse($response);

            return $jsonData['id'];

        } catch (Exception $ex) {
            list($code, $message) = $this->parseException($ex, 'No se pudo registrar el usuario');
            throw new AuthException($message, $code, $ex);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function recoveryPassword($email, $role)
    {
        try {
            $this->client->post('recovery-password', [
                'json' => [
                    'email' => $email,
                    'role'  => $role
                ]
            ]);

        } catch (Exception $ex) {
            list($code, $message) = $this->parseException($ex, 'No se pudo recuperar la contrasena');

            throw new AuthException($message, $code, $ex);
        }
    }

    /**
     * Pasar los datos del Usuario retornado por el servicio
     *
     * @param array $response
     * @param String $role
     * @return User
     */
    private function parseUser(array $response, String $role): User
    {
        $user = User::fromData($response);
        $user->setRole($role);

        return $user;
    }

    /**
     * Metodo que se encarga de parsear las excepciones del servicio.
     *
     *  - Si el servicio retorna errores personalizados, estos se tienen que mostrar.
     *  - En el caso que el error no se encuentre mapeado, se devuelve
     *    un mensaje por defecto.
     *
     * @param Exception $ex
     * @param String $defaultMessage
     * @param int $defaultCode
     * @return array
     */
    private function parseException(
        Exception $ex,
        String $defaultMessage = 'Ocurrio un error inesperado. Intente nuevamente.',
        int $defaultCode = 500): array
    {
        $code = $defaultCode;
        $message = $defaultMessage;

        if($ex instanceof RequestException) {
            /**
             * En caso que el servicio envie un mensaje personalizado.
             */
            $response = $ex->getResponse();
            $code = $response->getStatusCode();

            if(in_array($code, [400, 401, 403])){
                $data    = json_decode($response->getBody()->getContents(), true);
                $message = $data['message'];
                $code    = (int) $data['code'];
            }
        }

        return [$code, $message];
    }

    private function parseResponse(ResponseInterface $response)
    {
        return  json_decode($response->getBody()->getContents(), true);
    }

    /**
     * {@inheritdoc}
     */
    public function authorize($email, $password, $profile, $provider)
    {
        try {
            $query = <<<'GRAPHQL'
mutation loginUser($input: LoginInput!){
login(login: $input) {
token
code
message
}
}
GRAPHQL;

            $variables = array(
                'input' => array(
                    'email' => $email,
                    'password' => $password,
                    'profile' => $profile,
                    'provider' => $provider
                )
            );

            $response = GraphQl::graphqlQuery(getenv('SERVICES_URL') . 'gateway/', $query, $variables);

            return $response['data']['login'];

        } catch (Exception $ex) {
            throw new AuthException('No se pudo validar usuario', $ex->getCode(), $ex);
        }
    }
}