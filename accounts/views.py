from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from .forms import RegisterForm


def register(request):

    if request.method == "POST":

        form = RegisterForm(request.POST)

        if form.is_valid():

            user = form.save()

            print("USER CREATED:", user.pk)
            print("USERNAME:", user.username)

            messages.success(
                request,
                "Your account was created successfully!"
            )

            return redirect("/")

        else:
            print("FORM IS INVALID!")
            print("ERRORS:", form.errors.as_json())

    else:
        form = RegisterForm()

    return render(
        request,
        "accounts/register.html",
        {"form": form}
    )

def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(
            request,
            data=request.POST
        )
        if form.is_valid():
            user = form.get_user()
            login(request, user)

            messages.success(
                request,
                "Welcome to ArvoxGear"
            )
            return redirect("/")
    else:
        form = AuthenticationForm(request)
    return render(request,
                  "accounts/login.html",
                  {"form" : form}
                  )