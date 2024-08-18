from django.urls import re_path,path
from . import views
urlpatterns = [
    path('test/',views.Test.as_view(), name='testing api'),
    path('',views.index, name='index page '),
    #path('<str:room_name>/',views.room, name='room'),
    path('upload/', views.FileUploadView.as_view(), name='file-upload'),
]
