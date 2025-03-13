<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class UpdateUserApprovalStatus extends Command
{
    protected $signature = 'user:update-approval {userId} {status}';
    protected $description = 'Update the online status of a user';

    public function handle()
    {
        $userId = $this->argument('userId');
        $status = $this->argument('status');

        $user = User::find($userId);
        if ($user) {
            $user->approval_status = $status;
            $user->save();
            $this->info("User {$user->name}'s approval status has been updated to {$status}.");
        } else {
            $this->error("User not found.");
        }
    }
}
