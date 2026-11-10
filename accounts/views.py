from django.shortcuts import render, redirect
from django.contrib import messages

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