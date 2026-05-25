from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Protocol(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pendente'),
        ('EXECUTED', 'Executado'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='protocols')
    
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_protocols')
    
    delegated_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='delegated_protocols')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.status}"