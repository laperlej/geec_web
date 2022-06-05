from django.test import TestCase
from django.core.urlresolvers import reverse
from django.test import Client
from django.test.utils import override_settings

# Create your tests here.
class TestTable(TestCase):
    def setUp(self):
        self.client = Client()

    def test_main(self):
        url = reverse('main_table')

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'table/base.html')
        self.assertTemplateUsed(response, 'table/table.html')
        self.assertContains(response, 'datasets selected')

    def test_data(self):
        url = reverse("download_page")
        param_name = "datasets"
        param_value = "This is a test"

        response = self.client.post(url, {param_name: param_value})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.get('Content-Disposition'), 'attachment; filename="dummy.txt"'
        )
        self.assertEqual(response.content, "This is a test")