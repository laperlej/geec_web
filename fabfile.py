from fabric.api import local

def test():
    local('python manage.py test table --settings=geec_web.settings.development')

def local_deploy():
    local('python manage.py runserver --settings=geec_web.settings.development')
