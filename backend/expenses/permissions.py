from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow access if the user is Admin or the owner of the expense.
        return request.user.is_staff or obj.user == request.user