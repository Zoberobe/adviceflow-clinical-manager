from django.contrib import admin
from .models import Category, Protocol

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Protocol)
class ProtocolAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'status', 'creator', 'delegated_to', 'created_at')
    list_filter = ('status', 'category')
    search_fields = ('title', 'creator__username')