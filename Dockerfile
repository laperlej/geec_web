FROM python:latest
RUN apt-get update && apt-get install -y apache2 apache2-utils ssl-cert libapache2-mod-wsgi-py3 && apt-get clean
ENV APACHE_RUN_USER=root
ENV APACHE_RUN_GROUP=root
ENV APACHE_LOG_DIR=/var/log/apache2
ENV APACHE_PID_FILE=/var/run/apache2/apache2.pid
ENV APACHE_LOCK_DIR=/var/lock/apache2
ENV APACHE_RUN_DIR=/var/run/apache2
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf
COPY apache2.conf /etc/apache2/apache2.conf
COPY . /geec_web
RUN chmod 777 /geec_web
WORKDIR
RUN pip install virtualenv
RUN python -m virtualenv venv
RUN . venv/bin/activate && \
pip install -r requirements.txt && \
python manage.py migrate &&\
python manage.py collectstatic --noinput
RUN chmod 777 /venv
USER root
#/usr/sbin/apache2 -D FOREGROUND
ENTRYPOINT ["/usr/sbin/apache2"]
CMD ["-D", "FOREGROUND"]
