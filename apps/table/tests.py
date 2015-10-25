from django.test import TestCase
from django.core.urlresolvers import reverse
from django.test import Client
from django.test.utils import override_settings

# Create your tests here.
class TestPage(TestCase):
    def setUp(self):
        self.client = Client()

    def test_index_render(self):
        response = self.client.get('')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'table/base.html')
        self.assertTemplateUsed(response, 'table/table.html')
        self.assertContains(response, 'datasets selected')