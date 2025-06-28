from rest_framework import serializers

from .models import Expense

class ExpenseSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Expense
        fields = ['id', 'title', 'amount', 'category', 'date', 'notes', 'username', 'created_at', 'updated_at']
        read_only_fields = ['id', 'username', 'created_at', 'updated_at']
    
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value


class ExpenseSummarySerializer(serializers.Serializer):
    category = serializers.CharField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)