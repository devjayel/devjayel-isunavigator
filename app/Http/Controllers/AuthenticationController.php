<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models;


class AuthenticationController extends Controller
{

    public function RenderLogin(){
        return Inertia::render("Home");
    }
    public function RenderRegister(){
        return Inertia::render("Register");
    }
    public function RenderForgotPassword(){
        return Inertia::render("ForgotPassword");
    }

    public function Login(Request $request){
        $request->validate([
            "email" => "required|email",
            "password" => "required"
        ]);
        $credentials = $request->only('email', 'password');

        // Check if the user is already logged in (i.e., if 'is_online' is true)
        $user = User::where('email', $request->email)->first();
    
        if ($user && $user->is_online) {
            // If the user is already logged in, prevent further login
            return back()->withErrors(['email' => 'You are already logged in from another device.']);
        }
    
        // Attempt to log the user in
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            
            // Set 'is_online' to true for the logged-in user
            $user->update(['is_online' => true]);
    
            return redirect()->intended('overview');
        }
    
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    public function Register(Request $request){
        $request->validate([
            "name" => "required",
            "email" => "required|email|unique:users",
            "password" => "required|min:8"
        ]);
        //Register
        User::create($request->all());
        
        return redirect()->route("login");
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
