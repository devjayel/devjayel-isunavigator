<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserProfileController extends Controller
{
    public function UpdateAccount(Request $request)
    {
        $validated = $request->validate([
            'is_anonymous' => ['required', 'boolean'],
        ]);

        $request->user()->update($validated);

        return back();
    }

    public function UpdateAvatar(Request $request)
    {
        $validated = $request->validate([
            'avatar' => ['required', 'image', 'max:1024'],
        ]);

        $user = $request->user();

        if ($user->avatar && $user->avatar !== 'avatars/default.jpg') {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return back();
    }

    public function UpdateEmail(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $request->user()->id],
        ]);

        $request->user()->update($validated);

        return back();
    }

    public function UpdateGeneral(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $request->user()->update($validated);

        return back();
    }

    public function UpdatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back();
    }

    public function AccountStatus(){
        return Inertia::render('AccountStatus');
    }
}
