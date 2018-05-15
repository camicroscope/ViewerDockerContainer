#!/bin/bash
#nohup /usr/bin/mongod &
#nohup nodejs bin/www &
#cd ../bindaas/bin
#sh startup.sh &

composite_dir="/var/www/html/composite_results"
if [ ! -d "$composite_dir" ]; then
  mkdir "$composite_dir"
fi

# Tile Overlay Directory and Symlink
overlays_dir="/data/images/overlays/"
if [ ! -d "$overlays_dir" ]; then
  mkdir "$overlays_dir"
  ln -s "$overlays_dir" /var/www/html/overlays
fi

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
