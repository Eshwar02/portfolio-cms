#!/usr/bin/env bash
# Build step for deploy platforms (e.g. Render). Fails fast on any error.
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate --noinput
python manage.py init_admin
