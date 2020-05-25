#!/usr/bin/env bash

set -e

DOMAIN="local.expoferia.aptitus.com"
IMAGE="apt_expoferia_backend"

FRONTEND_DIR=app/frontend

CK='\u2714'
ER='\u274c'

alias cls='printf "\033c"'

export DEV_UID=$(id -u)
export DEV_GID=$(id -g)

app_read_params()
{
   for i in "$@"
   do
    case $i in
        -e=*|--env=*) APP_ENV="${i#*=}" && shift;;
        -c=*|--cdn=*) APP_CDN="${i#*=}" && shift;;
        *)
        ;;
    esac
   done
}

app_start()
{
    docker-compose up -d

    if [ $? -eq 0 ]; then
        echo -e "\n\n$CK  [Docker UP] "
        echo -e "\n----------------------------------------------------------"
        echo -e "\n App Server RUN  ===> http://$DOMAIN   \r"
        echo -e "\n----------------------------------------------------------\n"
    else
        echo -e "\n$ER [Docker UP] No se pudo levantar docker.\n"
    fi
}

app_down()
{
   docker-compose down

   echo -e "\n\n$CK  [Docker Down] \n"
}

app_docker_images_build()
{
   docker-compose -f docker-compose.build.yml build $@
}

app_docker_images_push()
{
   docker push docker.orbis.pe/$IMAGE:base && \
   docker push docker.orbis.pe/$IMAGE:nginx && \
   docker push docker.orbis.pe/$IMAGE:cli && \
   docker push docker.orbis.pe/$IMAGE:yarn
}

app_docker_images_pull()
{
   docker pull docker.orbis.pe/$IMAGE:base && \
   docker pull docker.orbis.pe/$IMAGE:nginx && \
   docker pull docker.orbis.pe/$IMAGE:cli && \
   docker pull docker.orbis.pe/$IMAGE:yarn
}

app_composer_cmd()
{
   docker-compose -f docker-compose.tasks.yml run \
         -e SYMFONY_ENV="$APP_ENV" \
         --rm cli composer $@
}

app_npm_cmd()
{
    export CDPATH=
    wd=$PWD

    cd $FRONTEND_DIR

    npm $@

    cd "$wd"
    echo -e "\n\n$CK  [Node Script] $@"
}

app_yarn_cmd()
{
    mkdir -p $FRONTEND_DIR/.config/yarn/global
    mkdir -p $FRONTEND_DIR/.config/yarn/link
    mkdir -p $FRONTEND_DIR/.cache/yarn/v1

    docker-compose -f docker-compose.tasks.yml run \
        -e APP_CDN="$APP_CDN" \
        -e APP_ENV="$APP_ENV" \
        --rm yarn yarn $@

    echo -e "\n\n$CK  [Node Script] $@"
}

app_install()
{
   app_read_params ${@};

   echo -n "$(git rev-parse --short HEAD)" > app/last_commit
   echo -e "\r"

   if ! grep -q "$DOMAIN" /etc/hosts;
    then
      echo -e "\nSetting Virtualhost ....\n"
      sudo su -c "echo '127.0.0.1 $DOMAIN' >> /etc/hosts"
      if [ $? -eq 0 ]; then
          echo -e "$CK  [Virtualhost] "
      else
         echo -e "\r $ER [Virtualhost] Error al configurar el virtualhost."
         exit
      fi
   else
        echo -e "$CK  [Virtualhost] "
   fi

   echo -e "$CK  [Folders & Permissions] "
   chmod 0600 ./docker/cli/ssh/id_rsa
   chmod 0644 ./docker/cli/ssh/id_rsa.pub
   mkdir -p ./app/.composer/cache/vcs
   mkdir -p ./app/var

   echo -e "\nInstall dependencies .... "

   if [ $APP_ENV ] && [ $APP_ENV == "prod" ]; then
     app_composer_cmd install \
         --no-dev \
         --optimize-autoloader \
         --no-progress \
         --profile \
         --prefer-dist
   else
     app_composer_cmd install \
          --no-progress \
          --profile \
          --prefer-dist
   fi

   if [ $? -eq 0 ]; then
      echo -e "$CK  [Dependencies] "
   else
      echo -e "\r $ER [Dependencies] Ocurrio un error al instalar las dependencias"
      exit
   fi

   app_yarn_cmd install --pure-lockfile --no-cache

   if [ $APP_ENV ] && [ $APP_ENV == "prod" ]; then
       app_yarn_cmd build:prod
   elif [ $APP_ENV ]; then
       app_yarn_cmd build:prod
   else
       app_yarn_cmd build
   fi

   echo -e "\n--------------------------------------------------"
   echo -e "  [OK] Ejecutar make start o docker-compose up   "
   echo -e "\n  Go to ==> http://$DOMAIN   \r"
   echo -e "----------------------------------------------------\n"
}

case "$1" in
"install")
    app_install ${@}
    ;;
"start")
    app_start
    ;;
"stop")
    app_down
    ;;
"composer")
    app_composer_cmd ${@:2}
    ;;
"npm")
    app_npm_cmd ${@:2}
    ;;
"yarn")
    app_yarn_cmd ${@:2}
    ;;
"build")
    app_docker_images_build ${@:2}
    ;;
"pull")
    app_docker_images_pull
    ;;
"push")
    app_docker_images_push
    ;;
*)
    echo -e "\n\n\n$ER [APP] No se especifico un comando valido\n"
    ;;
esac