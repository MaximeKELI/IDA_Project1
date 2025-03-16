from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Filiere, Salle, Cours
from .serializers import FiliereSerializer, SalleSerializer, CoursSerializer

class FiliereViewSet(viewsets.ModelViewSet):
    queryset = Filiere.objects.all()
    serializer_class = FiliereSerializer

class SalleViewSet(viewsets.ModelViewSet):
    queryset = Salle.objects.all()
    serializer_class = SalleSerializer

class CoursViewSet(viewsets.ModelViewSet):
    queryset = Cours.objects.all()
    serializer_class = CoursSerializer