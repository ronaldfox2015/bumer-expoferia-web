FROM amazonlinux:2018.03

RUN yum install -y \
    php70-curl \
    php70-mbstring \
    php70-mcrypt \
    php70-soap \
    php70-apcu \
    php70-opcache \
    php70-pecl-memcache \
    php70-memcached \
    php70-zip \
    &&  yum clean all

# Config PHP
COPY ./php.ini /etc/php.ini
COPY ./20-apcu.ini /etc/php-7.0.d/20-apcu.ini

ENV APP_DIR=/app
WORKDIR $APP_DIR