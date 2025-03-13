<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\UserProfileController;

Route::middleware(["guest"])->group(function () {
    Route::get("/", [AuthenticationController::class, "RenderLogin"])->name("home");
    Route::get("/login", [AuthenticationController::class, "RenderLogin"])->name("login");
    Route::get("/register", [AuthenticationController::class, "RenderRegister"])->name("register");
    Route::get("/forgot-password", [AuthenticationController::class, "RenderForgotPassword"])->name("forgot-password");

    Route::post("/login", [AuthenticationController::class, "Login"])->name("post.login");
    Route::post("/register", [AuthenticationController::class, "Register"])->name("post.register");
});

// Routes requiring both authentication and email verification
Route::middleware(['auth', 'verified'])->group(function () {
    // General authenticated routes
    Route::get('/overview', [DashboardController::class, 'Index'])->name('overview');
    Route::get('/map', [DashboardController::class, 'Map'])->name('map');
});

Route::middleware(['auth','verified','role:admin'])->group(function () {
    Route::get('/admin/map', [AdminDashboardController::class, 'Map'])->name('admin.map');

    Route::prefix("/users")->group(function(){
        Route::get("/",[UsersController::class,"index"])->name("user.index");
        Route::post("/{id}/approve", [UsersController::class, "approve"])->name("user.approve");
        Route::post("/{id}/decline", [UsersController::class, "decline"])->name("user.decline");
        Route::post("/{id}/delete", [UsersController::class, "delete"])->name("user.delete");
    });
});

// Routes for users needing to check account status
Route::middleware(['auth'])->group(function () {
    // Profile-related routes
    Route::prefix("/profile")->group(function () {
        Route::get('/', action: [DashboardController::class, 'Profile'])->name('profile');
        Route::post("/account", [UserProfileController::class, "UpdateAccount"])->name("update.account");
        Route::post("/avatar", [UserProfileController::class, "UpdateAvatar"])->name("update.avatar");
        Route::post("/email", [UserProfileController::class, "UpdateEmail"])->name("update.email");
        Route::post("/general", [UserProfileController::class, "UpdateGeneral"])->name("update.general");
        Route::post("/password", [UserProfileController::class, "UpdatePassword"])->name("update.password");
    });

    Route::get("/account-status", [UserProfileController::class, "AccountStatus"])->name("account.status");
    Route::post("/logout", [AuthenticationController::class, "Logout"])->name("logout");
});


