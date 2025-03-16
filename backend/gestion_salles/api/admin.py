from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Filiere, Salle, Cours

admin.site.register(Filiere)
admin.site.register(Salle)
admin.site.register(Cours)