<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class UpdateUserStatus extends Command
{
    protected $signature = 'user:update-status {userId} {status}';
    protected $description = 'Update the online status of a user';

    public function handle()
    {
        $userId = $this->argument('userId');
        $status = $this->argument('status');

        $user = User::find($userId);
        if ($user) {
            $user->is_online = $status;
            $user->save();
            $this->info("User {$user->name}'s status has been updated to {$status}.");
        } else {
            $this->error("User not found.");
        }
    }
}