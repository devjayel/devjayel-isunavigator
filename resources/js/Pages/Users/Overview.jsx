import UsersLayout from "@/Layouts/UsersLayout";
export default function Dashboard({ auth, onlineUsers, storage }) {
    return (
        <UsersLayout title="Overview" user={auth.user}>
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Online Users</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {onlineUsers && onlineUsers.map((user) => (
                        <div key={user.id} className="flex items-center gap-3 p-4 border rounded-lg">
                            <div className="relative">
                                <img
                                    src={storage + "/" + user.avatar}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <h3 className="font-medium">{user.name}</h3>
                                <p className="text-sm text-gray-500">{user.location || 'No location set'}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {(!onlineUsers || onlineUsers.length === 0) && (
                    <p className="text-gray-500 text-center py-4">No users are currently online</p>
                )}
            </div>
        </UsersLayout>
    );
}
