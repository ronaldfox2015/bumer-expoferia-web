FROM ronaldgcr/apt_expoferia_backend:base

ENV TMP_USER=dockerdev \
    TMP_UID=1234 \
    COMPOSER_HOME=$APP_DIR/.composer

COPY ./wait-for-it.sh /tmp/wait-for-it.sh
COPY ./entrypoint.sh /root/entrypoint.sh

RUN yum install -y git \
    php70-zip \
    && gpg --keyserver pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 \
    && curl -o /usr/local/bin/gosu -SL "https://github.com/tianon/gosu/releases/download/1.2/gosu-amd64" \
    && curl -o /usr/local/bin/gosu.asc -SL "https://github.com/tianon/gosu/releases/download/1.2/gosu-amd64.asc" \
    && gpg --verify /usr/local/bin/gosu.asc \
    && rm /usr/local/bin/gosu.asc \
    && rm -r /root/.gnupg/ \
    && chmod +x /usr/local/bin/gosu \
    && yum clean all \
    && curl https://getcomposer.org/composer.phar > /usr/bin/composer \
    && chmod +x /usr/bin/composer \
    && echo "memory_limit=-1" > /etc/php-7.0.d/memory-limit.ini \
    && useradd -u $TMP_UID -d $APP_DIR $TMP_USER \
    && chmod +x /root/entrypoint.sh \
    && chmod +x /tmp/wait-for-it.sh

ENTRYPOINT ["/root/entrypoint.sh"]