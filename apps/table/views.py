from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt    
from django.utils.decorators import method_decorator                                      

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