from django.conf.urls import url
from django.conf import settings
from django.conf.urls.static import static

from views import MainView, DataView

urlpatterns = [
    url(r'^$', MainView.as_view(), name='main_table'),
    url(r'^data/$', DataView.as_view(), name='download_page'),
    ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
