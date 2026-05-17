#!/bin/sh
set -e
PORT="${PORT:-80}"
sed "s/__PORT__/${PORT}/g" /tmp/nginx-default.conf > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'