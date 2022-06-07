from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
import os.path

def column_content(json_content):
    datasets = json_content.get("datasets", [])
    if len(datasets) == 0:
        return {}
    column_content = {}
    for key in datasets[0].keys():
        column_content[key] = set()
    for dataset in datasets:
        for key in dataset.keys():
            column_content.get(key, set()).add(dataset.get(key, "N/A"))
    for key in column_content.keys():
        column_content[key] = sorted(column_content[key])
    return column_content


MODULE_DIR = os.path.dirname(os.path.realpath(__file__))
STATIC_DIR = os.path.join(MODULE_DIR, 'static', 'table')

class SelectorCache(object):
    def __init__(self, file="hg19_IHEC_2016-11.json"):
        self.file = file
        self.json_update_time = 0
        self.options = {}
        self.content = {}
        self.update()

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

def slice_json(json_content, datasets, release):
    output = {"datasets":[]}
    count = 0
    for dataset in datasets:
        token = json_content.get("datasets",{}).get(dataset, "")
        if token:
            count += 1
            output["datasets"].append(token)
    output["release"] = release
    output["count"] = count
    return output


# Create your views here.
class MainView(View):
    """page principale de la table de selection"""
    def get(self, request):
        #galaxy users come to this page with a return url and an id
        galaxy_url = request.GET.get('GALAXY_URL', '')
        tool_id = request.GET.get('tool_id', '')
        send_to_galaxy = request.GET.get('sendToGalaxy', '0')
        release = request.GET.get('release', 'hg19_IHEC_2017-10')
        url = "/"
        abs_url = request.build_absolute_uri(request.path)
        selector = selector_cache.get(release)
        if selector:
            selector.update()
        else:
            selector_cache[release] = SelectorCache(release + ".json")
        rel_options = selector_cache[release].options
        base_data = {'galaxy_url': galaxy_url.replace("http://", "https://"),
            'release': release,
            'tool_id': tool_id,
            'send_to_galaxy': send_to_galaxy,
            'url': url,
            'abs_url': abs_url.replace("http://", "https://")}
        data = rel_options.copy()
        data.update(base_data)
        return render(request, 'table/table.html', data)

class DataView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(DataView, self).dispatch(*args, **kwargs)

    def post(self, request):
        data = request.POST.get('datasets', '').encode('ascii').split()
        json_content = selector_cache.get(data[0]).content
        datasets = data[1:]
        content = slice_json(json_content, datasets, data[0])
        response = HttpResponse(json.dumps(content))
        #data = request.POST.get('datasets', '')
        #response = HttpResponse(data)
        response['Content-Disposition'] = 'attachment; filename="dummy.txt"'
        return response
