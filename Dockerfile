FROM python:latest
ENV PYTHONUNBUFFERED 1
COPY . /geec_web
WORKDIR /geec_web
RUN pip install -r requirements.txt && \
python manage.py makemigrations &&\
python manage.py migrate &&\
python manage.py collectstatic --noinput

ENTRYPOINT ["gunicorn"]
CMD ["geec_web.wsgi", "-b", "0.0.0.0:8000"]