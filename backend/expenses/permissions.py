from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        print(f"getting in to the permission. {request.user}")
        # Allow access if the user is Admin or the owner of the expense.
        return request.user.is_staff or obj.user == request.user