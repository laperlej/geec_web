from fabric.api import local

def test_local():
    local('python manage.py test --settings=geec_web.settings.development')

def deploy_local():
    local('python manage.py runserver --settings=geec_web.settings.development')

def deploy_develop():
    local('git push heroku develop:master')

def workon():
    local('workon geec_web')
