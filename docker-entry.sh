#!/bin/bash
sh mysql -u root -p root -e "update user set authentication_string=password('root'), plugin='mysql_native_password' where user='root';"