from django.shortcuts import render


def home(request):
    """Render the storefront; the v1 static catalog is owned by catalog.js."""
    return render(request, "storefront/home.html")