#!/usr/bin/env bash

set -e

setfacl -R -m u:nginx:rwX -m u:"$(whoami)":rwX $APP_DIR/var/
setfacl -dR -m u:nginx:rwX -m u:"$(whoami)":rwX $APP_DIR/var/

/usr/sbin/php-fpm -D && /usr/sbin/nginx -g 'daemon off;' && tail -f /var/log/nginx/local.payment.aptitus.com.error.log

