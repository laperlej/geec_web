from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
import os.path
from collections import OrderedDict

def column_content(json_content):
    assays = OrderedDict()
    assay_cats = OrderedDict()
    cell_types = OrderedDict()
    cell_type_cats = OrderedDict()
    rel_groups = OrderedDict()
    for dataset in json_content['datasets']:
        assays[dataset['assay']] = None
        assay_cats[dataset['assay_category']] = None
        cell_types[dataset['cell_type']] = None
        cell_type_cats[dataset['cell_type_category']] = None
        rel_groups[dataset['analysis_group']] = None
    return {'assays':sorted(assays),
            'assay_cats':sorted(assay_cats),
            'cell_types':sorted(cell_types),
            'cell_type_cats':sorted(cell_type_cats),
            'rel_groups':sorted(rel_groups)}

MODULE_DIR = os.path.dirname(os.path.realpath(__file__))
STATIC_DIR = os.path.join(MODULE_DIR, 'static', 'table')

class SelectorCache(object):
    def __init__(self, file="hg19.json"):
        self.file = file
        self.json_update_time = 0
        self.options = {}
        self.content = {}

    def refactor_json(self):
        new_content = {"datasets":{}}
        for token in self.content["datasets"]:
            new_content["datasets"][token["id"]] = token
        self.content = new_content

    def update(self):
        json_path = os.path.join(STATIC_DIR, self.file)
        modif_time = os.path.getmtime(json_path)
        if self.json_update_time < modif_time:
            self.json_update_time = modif_time
            with open(json_path) as json_file:
                self.content = json.load(json_file)
            self.options = column_content(self.content)
            self.refactor_json()

selector_cache = {}
selector_cache["hg19_4-16"] = SelectorCache("hg19_4-16.json")
selector_cache["hg19_3-16"] = SelectorCache("hg19_3-16.json")
selector_cache["hg19_test"] = SelectorCache("hg19_test.json")
selector_cache["saccer"] = SelectorCache("saccer.json")

def slice_json(json_content, datasets):
    output = {"datasets":{}}
    for dataset in datasets:
        token = json_content.get("datasets",{}).get(dataset, "")
        if token:
            output["datasets"][token["id"]] = token
    return output


# Create your views here.
class MainView(View):
    """page principale de la table de selection"""
    def get(self, request):
        #galaxy users come to this page with a return url and an id
        galaxy_url = request.GET.get('GALAXY_URL', '')
        tool_id = request.GET.get('tool_id', '')
        send_to_galaxy = request.GET.get('sendToGalaxy', '0')
        release = request.GET.get('release', 'hg19_4-16')
        url = request.build_absolute_uri(request.path)
        selector_cache[release].update()
        hg19_options = selector_cache[release].options
        return render(request, 'table/table.html', {
            'galaxy_url': galaxy_url,
            'release': release,
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
        data = request.POST.get('datasets', '').encode('ascii').split()
        json_content = selector_cache.get(data[0]).content
        datasets = data[1:]
        content = slice_json(json_content, datasets)
        response = HttpResponse(json_content)
        #response = HttpResponse(json.dumps(content))
        #data = request.POST.get('datasets', '')
        #response = HttpResponse(data)
        response['Content-Disposition'] = 'attachment; filename="dummy.txt"'
        return response