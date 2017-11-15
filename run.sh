#!/bin/bash
#nohup /usr/bin/mongod &
#nohup nodejs bin/www &
#cd ../bindaas/bin
#sh startup.sh &
rm -f /var/run/apache2.pid
service apache2 start
htpasswd -bc /etc/apache2/.htpasswd admin quip2017
chmod 777 /etc/apache2/.htpasswd
#/root/src/iipsrv/src/iipsrv.fcgi --bind 127.0.0.1:9001 &
sleep 60
apikey=$(python /var/www/html/createUser.py viewer@quip)

sed -i -e "s/APIKEY312/$apikey/g" /var/www/html/authenticate.php
#curl -H "Content-Type: application/json" -X POST -d @/root/templates/drawForm.json http://camicroscope-bindaas:9099/services/caMicroscope_Templates/AnnotationTemplate/submit/json?api_key=$apikey

while true; do sleep 1000; done
