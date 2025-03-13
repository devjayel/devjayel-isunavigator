import UsersLayout from "@/Layouts/UsersLayout";

export default function AccountStatus({auth,storage}) {
    const getStatusMessage = (status) => {
        switch(status) {
            case 'approved':
                return {
                    title: 'Account Approved',
                    message: 'Your account has been approved. You can now access all features of the application.',
                    color: 'bg-green-100 text-green-800',
                    icon: '✓'
                };
            case 'waiting':
                return {
                    title: 'Account Pending Approval',
                    message: 'Your account is currently under review. Please wait while our administrators verify your information.',
                    color: 'bg-yellow-100 text-yellow-800',
                    icon: '⌛'
                };
            case 'cancelled':
                return {
                    title: 'Account Cancelled',
                    message: 'Your account registration has been cancelled. Please contact the administrator for more information.',
                    color: 'bg-red-100 text-red-800',
                    icon: '✕'
                };
            default:
                return {
                    title: 'Unknown Status',
                    message: 'Unable to determine your account status.',
                    color: 'bg-gray-100 text-gray-800',
                    icon: '?'
                };
        }
    };

    const status = getStatusMessage(auth.user.approval_status);

    return (
        <UsersLayout title="Account Status" user={auth.user}>
            <div className="max-w-2xl mx-auto">
                <div className={`rounded-lg p-6 ${status.color}`}>
                    <div className="flex items-center gap-4">
                        <div className="text-4xl">{status.icon}</div>
                        <div>
                            <h2 className="text-xl font-semibold mb-2">{status.title}</h2>
                            <p className="text-sm">{status.message}</p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">What happens next?</h3>
                    <ul className="space-y-4">
                        {auth.user.approval_status === 'waiting' && (
                            <>
                                <li className="flex items-center gap-2">
                                    <span className="text-yellow-500">⌛</span>
                                    <span>Your account is being reviewed by our administrators</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-blue-500">📧</span>
                                    <span>You will receive an email notification once your account is approved</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>Once approved, you can access all features of the application</span>
                                </li>
                            </>
                        )}
                        {auth.user.approval_status === 'cancelled' && (
                            <li className="flex items-center gap-2">
                                <span className="text-blue-500">📧</span>
                                <span>Please contact support for more information about your account status</span>
                            </li>
                        )}
                        {auth.user.approval_status === 'approved' && (
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span>You can now proceed to use the application</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </UsersLayout>
    );
}