<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function Map(){
        return Inertia::render("Admin/Map/Index");
    }
}
