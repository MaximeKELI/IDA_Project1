from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FiliereViewSet, SalleViewSet, CoursViewSet

router = DefaultRouter()
router.register(r'filieres', FiliereViewSet)
router.register(r'salles', SalleViewSet)
router.register(r'cours', CoursViewSet)

urlpatterns = [
    path('', include(router.urls)),
]