from django.shortcuts import render

# Create your views here.
def main(request):
    """page principale de la table de selection"""
    #galaxy users come to this page with a return url and an id
    galaxy_url = request.GET.get('GALAXY_URL', '')
    tool_id = request.GET.get('tool_id', '')
    return render(request, 'table/table.html', {
           'galaxy_url': galaxy_url,
           'tool_id': tool_id})
