<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class DashboardController extends Controller
{
    public function Index(){
        $onlineUsers = User::where('is_online', true)->where('is_anonymous', false)->get();
        
        return Inertia::render("Users/Overview", [
            'onlineUsers' => $onlineUsers
        ]);
    }

    public function Map(){
        return Inertia::render("Users/Map");
    }

    public function Profile(){
        return Inertia::render("Users/Profile");
    }

    public function Logout(Request $request)
    {
        // Get the currently authenticated user
        $user = auth()->user();
    
        // If user exists, update the 'is_online' status before logging them out
        if ($user) {
            $user->update(['is_online' => false]);
        }
    
        // Logout the user
        Auth::logout();
    
        // Invalidate the session and regenerate the token
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    
        // Redirect to the login page
        return redirect()->route('login');
    }
}
