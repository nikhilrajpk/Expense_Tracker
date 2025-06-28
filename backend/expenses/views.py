from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status, permissions

from .permissions import IsOwnerOrAdmin
from .models import Expense
from .serializers import ExpenseSerializer, ExpenseSummarySerializer
from datetime import datetime
from django.db.models import Sum


class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    # def get_queryset(self):
    #     # Admin see all data, normal users see their own.
    #     if self.request.user.is_staff:
    #         return Expense.objects.all()
    #     return Expense.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Automatically assign the authenticated user to expense.
        serializer.save(user=self.request.user)
        
    def get_queryset(self):
        # Admin see all data, normal users see their own.
        if self.request.user.is_staff:
            queryset = Expense.objects.all()
        else:
            queryset = Expense.objects.filter(user=self.request.user)
        
        # Applying filters
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        category = self.request.query_params.get('category')
        user_id = self.request.query_params.get('user') if self.request.user.is_staff else None
        
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        if category:
            queryset = queryset.filter(category=category)
        if user_id and self.request.user.is_staff:
            queryset = queryset.filter(user_id=user_id)
        return queryset
    

class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    queryset = Expense.objects.all()
    
class ExpenseSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Admins can see summaries for all user, normal users can see their own summary
        if request.user.is_staff:
            queryset = Expense.objects.all()
        else:
            queryset = Expense.objects.filter(user=request.user)
        
        # Applying filters if provided.
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        # Calculate total by category
        summary = queryset.values('category').annotate(total_amount=Sum('amount')).order_by('category')
        serializer = ExpenseSummarySerializer(summary, many=True)
        return Response(serializer.data)
    