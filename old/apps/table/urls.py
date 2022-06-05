from django.urls import re_path
from django.conf import settings
from django.conf.urls.static import static

from .views import MainView, DataView

urlpatterns = [
    re_path(r'^$', MainView.as_view(), name='main_table'),
    re_path(r'^data/$', DataView.as_view(), name='download_page'),
    ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
