from fabric.api import local

def test_local():
    local('python manage.py test table --settings=geec_web.settings.development')

def deploy_local():
    local('python manage.py runserver --settings=geec_web.settings.development')
