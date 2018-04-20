#!/bin/bash
#nohup /usr/bin/mongod &
#nohup nodejs bin/www &
#cd ../bindaas/bin
#sh startup.sh &
mkdir /var/www/html/composite_results
# tile overlay symlink
ln -s /data/images/overlays /var/www/html/overlays
rm -f /var/run/apache2.pid
service apache2 start

#restart apache2 server
service apache2 restart

htpasswd -bc /etc/apache2/.htpasswd admin quip2017
chmod 777 /etc/apache2/.htpasswd
/root/src/iipsrv/src/iipsrv.fcgi --bind 127.0.0.1:9001 &

apikey=$(python /var/www/html/createUser.py viewer@quip)

echo "$apikey"  >> /var/www/html/api.key

while true; do sleep 1000; done
