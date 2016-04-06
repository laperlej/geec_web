import os
import sys

from django.core.wsgi import get_wsgi_application
sys.path.append('/home/galaxy/geec_web/geec_web')
sys.path.append("/home/galaxy/geec_web/Library/Python2.7/bin")
sys.path.append("/home/galaxy/geec_web/.local/bin")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "geec_web.settings.base")

from dj_static import Cling
application = Cling(get_wsgi_application())
