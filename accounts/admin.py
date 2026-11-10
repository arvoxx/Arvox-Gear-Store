from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        "username",
        "email",
        "phonenumber",
        "first_name",
        "last_name",
        "is_staff",
        "is_active",
    )

    search_fields = ("username", "email", "phonenumber")

    fieldsets = UserAdmin.fieldsets + (
        ("اطلاعات فروشگاه", {
            "fields": ("phonenumber",),
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ("اطلاعات فروشگاه", {
            "fields": ("email", "phonenumber"),
        }),
    )