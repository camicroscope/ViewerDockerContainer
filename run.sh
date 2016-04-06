#!/bin/bash
#nohup /usr/bin/mongod &
#nohup nodejs bin/www &
#cd ../bindaas/bin
#sh startup.sh &
service apache2 start
/root/src/iipsrv/src/iipsrv.fcgi --bind 127.0.0.1:9001 &
while true; do sleep 1000; done
