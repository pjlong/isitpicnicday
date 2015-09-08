from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()


from ng.views import IndexView, NgTemplateView


urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'isitpicnicday.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^ng/(?P<template_name>([\w\/]+)([\w\.-]+)\.html)$', NgTemplateView.as_view()),
    url(r'^', IndexView.as_view())
)
