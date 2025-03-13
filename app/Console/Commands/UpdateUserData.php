<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class UpdateUserData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:update {id} {column} {value}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update a specific column of a user by ID';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $id = $this->argument('id');
        $column = $this->argument('column');
        $value = $this->argument('value');

        // Find the user
        $user = User::find($id);

        if (!$user) {
            $this->error("User with ID {$id} not found.");
            return 1; // Return non-zero for error
        }

        // Check if the column exists in the users table
        if (!\Schema::hasColumn('users', $column)) {
            $this->error("Column '{$column}' does not exist in the users table.");
            return 1; // Return non-zero for error
        }

        // Update the user column
        $user->{$column} = $value;
        $user->save();

        $this->info("User with ID {$id} updated: {$column} set to {$value}.");
        return 0; // Success
    }
}
