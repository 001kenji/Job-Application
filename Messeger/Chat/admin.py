from django.contrib import admin
from django import forms
from .models import Account,AccountManager,GroupChat,PersonalChats,CommunityChat,JobsTable
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.contrib import admin
from django.contrib.auth.models import Group
from datetime import datetime
admin.site.site_title = 'login admin'
admin.site.site_header = 'LOGIN'
admin.site.site_index = 'Welcome Back'
import time, asyncio, json,os,datetime

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent



ActiveUser = Account.objects.all()
class UserAccountAdmin (admin.ModelAdmin):
    
    list_display=('name','email','is_staff')
    exclude=['JobsHistory,rattings','requestedJobs']
    list_filter=['is_staff','is_active','is_superuser']
    
    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        New_fieldsets = (
            (None, {
            'fields': ('email', 'name','password','is_active', 'is_staff','is_superuser')
        }),
        ('Profile',{
            'fields' : ('ProfilePic','about')
        })
        ,)
        
        return New_fieldsets 
    
    readonly_fields=('id',)

class JobsTableAdmin(admin.ModelAdmin):
    list_display = ('Details','OpenedDate','location')

    
admin.site.register(JobsTable,JobsTableAdmin)
admin.site.unregister(Group)
admin.site.register(Account, UserAccountAdmin)

