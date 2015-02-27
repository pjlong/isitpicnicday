#!/bin/sh

source ./ENV/bin/activate && git pull && gulp && python ./manage.py collectstatic --noinput
