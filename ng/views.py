__author__ = 'phil'

from django.views import generic


## Angular Views
class IndexView(generic.TemplateView):
    template_name = 'ng/index.html'
