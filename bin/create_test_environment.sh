#!bin/bash

#clean db
redis-cli flushall

# create user
redis-cli hmset user:1 name 'Gerard' lastName 'Clos' email 'demo@dezibel.com' hash '12345678' token 'helloworld' id 1
redis-cli set user:demo@dezibel.com 1
redis-cli lpush users 1
