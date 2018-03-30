#!/bin/bash
#nohup /usr/bin/mongod &
#nohup nodejs bin/www &
#cd ../bindaas/bin
#sh startup.sh &
# tile overlay symlink
ln -s /data/images/overlays /var/www/html/overlays
rm -f /var/run/apache2.pid
service apache2 start
htpasswd -bc /etc/apache2/.htpasswd admin quip2017
chmod 777 /etc/apache2/.htpasswd
/root/src/iipsrv/src/iipsrv.fcgi --bind 127.0.0.1:9001 &

apikey=$(python /var/www/html/createUser.py viewer@quip)

echo "api_key=$apikey"  >> /var/www/html/config.ini

while true; do sleep 1000; done
