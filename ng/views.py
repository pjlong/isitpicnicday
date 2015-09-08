__author__ = 'phil'

from django.views import generic


## Angular Views
class IndexView(generic.TemplateView):
    template_name = 'ng/index.html'

class NgTemplateView(generic.TemplateView):

    def get_template_names(self):
        temp = ["ng/{0}".format(self.kwargs['template_name'])]
        return temp