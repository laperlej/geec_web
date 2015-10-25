from fabric.api import local

def test():
    local('python manage.py test table --settings=geec_web.settings.development')
    