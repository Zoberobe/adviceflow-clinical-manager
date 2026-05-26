from rest_framework import permissions

class IsCreatorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method == 'DELETE':
            return obj.creator == request.user
        
        return obj.creator == request.user or obj.delegated_to == request.user