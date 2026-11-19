from rest_framework import viewsets, permissions, status
from .models import Departamento, CentroDesarrollo, MiembroConsejo, MiembroFEU
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import DepartamentoSerializer, CentroSerializer, ConsejoSerializer, FEUSerializer
from usuarios.permissions import IsAdminOEditor

class DepartamentoViewSet(viewsets.ModelViewSet):
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']: 
            return [permissions.AllowAny()]
        return [IsAdminOEditor()]

    # función para eliminar varios departamentos a la vez
    @action(detail=False, methods=['post'], url_path='bulk-delete')
    def bulk_delete(self, request):
        # Recibimos una lista de IDs desde React: {"ids": [1, 2, 3]}
        ids = request.data.get('ids', [])
        
        if not ids:
            return Response({"error": "No se proporcionaron IDs"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Filtramos por los IDs que vienen y los eliminamos de un solo golpe
        departamentos_a_borrar = Departamento.objects.filter(id__in=ids)
        count = departamentos_a_borrar.count()
        departamentos_a_borrar.delete()
        
        return Response({"mensaje": f"{count} departamentos eliminados correctamente"}, status=status.HTTP_200_OK)

class CentroViewSet(viewsets.ModelViewSet):
    queryset = CentroDesarrollo.objects.all()
    serializer_class = CentroSerializer

class ConsejoViewSet(viewsets.ModelViewSet):
    queryset = MiembroConsejo.objects.all()
    serializer_class = ConsejoSerializer

class FEUViewSet(viewsets.ModelViewSet):
    queryset = MiembroFEU.objects.all()
    serializer_class = FEUSerializer
