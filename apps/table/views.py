from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt    
from django.utils.decorators import method_decorator                                      
import json
import os.path
from collections import OrderedDict

def column_content(json_path):
    with open(json_path) as json_file:
        content = json.load(json_file)
    assays = OrderedDict()
    assay_cats = OrderedDict()
    cell_types = OrderedDict()
    cell_type_cats = OrderedDict()
    rel_groups = OrderedDict()
    for dataset in content['dataset']:
        assays[dataset['assay']] = None
        assay_cats[dataset['assay_category']] = None
        cell_types[dataset['cell_type']] = None
        cell_type_cats[dataset['cell_type_category']] = None
        rel_groups[dataset['releasing_group']] = None
    return {'assays':sorted(assays),
            'assay_cats':sorted(assay_cats),
            'cell_types':sorted(cell_types),
            'cell_type_cats':sorted(cell_type_cats),
            'rel_groups':sorted(rel_groups)}

MODULE_DIR = os.path.dirname(os.path.realpath(__file__))
STATIC_DIR = os.path.join(MODULE_DIR, 'static', 'table')
hg19_options = column_content(os.path.join(STATIC_DIR, "hg19.json"))

# Create your views here.
class MainView(View):
    """page principale de la table de selection"""
    def get(self, request):
        #galaxy users come to this page with a return url and an id
        galaxy_url = request.GET.get('GALAXY_URL', '')
        tool_id = request.GET.get('tool_id', '')
        send_to_galaxy = request.GET.get('sendToGalaxy', '0')
        url = request.build_absolute_uri(request.path)
        return render(request, 'table/table.html', {
            'galaxy_url': galaxy_url,
            'tool_id': tool_id,
            'send_to_galaxy': send_to_galaxy,
            'assays': hg19_options['assays'],
            'assay_cats': hg19_options['assay_cats'],
            'cell_types': hg19_options['cell_types'],
            'cell_type_cats': hg19_options['cell_type_cats'],
            'rel_groups': hg19_options['rel_groups'],
            'url': url})

class DataView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(DataView, self).dispatch(*args, **kwargs)

    def post(self, request):
        content = request.POST.get('datasets', '')
        response = HttpResponse(content)
        response['Content-Disposition'] = 'attachment; filename="dummy.txt"'
        return response