#!/bin/bash
#nohup /usr/bin/mongod &
#nohup nodejs bin/www &
#cd ../bindaas/bin
#sh startup.sh &
rm -f /var/run/apache2.pid
service apache2 start
htpasswd -bc /etc/apache2/.htpasswd admin quip2017
/root/src/iipsrv/src/iipsrv.fcgi --bind 127.0.0.1:9001 &
while true; do sleep 1000; done
