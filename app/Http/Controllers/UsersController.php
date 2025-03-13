<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsersController extends Controller
{
    public function index(){
        $users = User::paginate(10);
        return Inertia::render("Admin/Users/Index", [
            "usersFromDb" => $users
        ]);
    }

    public function approve($id)
    {
        $user = User::findOrFail($id);
        $user->update([
            'approval_status' => 'approved'
        ]);


        return redirect()->route("user.index")->with('success', 'User updated successfully');
    }

    public function decline($id)
    {
        $user = User::findOrFail($id);
        $user->update([
            'approval_status' => 'cancelled'
        ]);

        return redirect()->route("user.index")->with('success', 'User updated successfully');
    }

    public function delete($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->route("user.index")->with('success', 'User deleted successfully');
    }
}
