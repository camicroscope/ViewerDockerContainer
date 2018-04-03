#!/bin/bash
#nohup /usr/bin/mongod &
#nohup nodejs bin/www &
#cd ../bindaas/bin
#sh startup.sh &
#------ new version starting here -----------
mkdir -p /var/www/html2
mkdir /var/www/html2/composite_results
cp -r /var/www/html/* /var/www/html2/.
sed -i -e "s/Camicroscope_DataLoader/Camicroscope_DataLoader_comp/g"  /var/www/html2/camicroscope/api/Configuration/config.php
sed -i -e "s/Camicroscope_Annotations/Camicroscope_Annotations_comp/g"  /var/www/html2/camicroscope/api/Configuration/config.php
sed -i -e "s/Camicroscope_DataLoader/Camicroscope_DataLoader_comp/g"  /var/www/html2/FlexTables/config.json
sed -i -e "s/default_db: 'quip'/default_db: 'quip_comp'/g"  /var/www/html2/featurescapeapps/js/config.js
# -- end of new version -------
rm -f /var/run/apache2.pid
service apache2 start
sed '/Listen 80/a Listen 8080' /etc/apache2/ports.conf
#restart apache2 server
service apache2 restart

htpasswd -bc /etc/apache2/.htpasswd admin quip2017
chmod 777 /etc/apache2/.htpasswd
/root/src/iipsrv/src/iipsrv.fcgi --bind 127.0.0.1:9001 &

apikey=$(python /var/www/html/createUser.py viewer@quip)

sed -i -e "s/APIKEY312/$apikey/g" /var/www/html/authenticate.php

while true; do sleep 1000; done
