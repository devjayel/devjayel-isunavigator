import UsersLayout from "@/Layouts/UsersLayout";
import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from '@headlessui/react';
import { useForm, Link } from "@inertiajs/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UsersIndex({ auth, flash, usersFromDb }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isActionOpen, setIsActionOpen] = useState(false);
    const [actionType, setActionType] = useState('');

    const { post } = useForm();

    const handleAction = (type, user) => {
        setSelectedUser(user);
        setActionType(type);
        setIsActionOpen(true);
    };

    const confirmAction = () => {
        if (actionType === 'approve') {
            post(route('user.approve', selectedUser.id));
        } else if (actionType === 'decline') {
            post(route('user.decline', selectedUser.id));
        } else if (actionType === 'delete') {
            post(route('user.delete', selectedUser.id));
        }
        setIsActionOpen(false);
    };

    useEffect(() => {
        if (flash.message?.success) {
            toast.success(flash.message.success);
        }
        flash.message = {};
    }, [flash]);


    return (
        <UsersLayout title="Users" user={auth.user}>
            <ToastContainer />
            <div className="bg-white rounded shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {usersFromDb.data.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src={user.avatar ? `/storage/${user.avatar}` : '/storage/default.jpg'}
                                                alt={user.name}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`capitalize px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${user.approval_status === 'approved' ? 'bg-green-100 text-green-800' :
                                            user.approval_status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'}`}>
                                        {user.approval_status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setIsViewOpen(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-900 bg-blue-50 px-2 py-1 rounded"
                                        >
                                            View
                                        </button>
                                        {user.approval_status === 'waiting' ? (
                                            <>
                                                <button
                                                    onClick={() => handleAction('approve', user)}
                                                    className="text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction('decline', user)}
                                                    className="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded"
                                                >
                                                    Decline
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleAction('delete', user)}
                                                className="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Pagination Controls */}
                <div className="px-6 py-4 bg-white border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            {usersFromDb.prev_page_url && (
                                <Link
                                    href={usersFromDb.prev_page_url}
                                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                >
                                    Previous
                                </Link>
                            )}
                            {usersFromDb.next_page_url && (
                                <Link
                                    href={usersFromDb.next_page_url}
                                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing{' '}
                                    <span className="font-medium">{usersFromDb.from}</span>
                                    {' '}to{' '}
                                    <span className="font-medium">{usersFromDb.to}</span>
                                    {' '}of{' '}
                                    <span className="font-medium">{usersFromDb.total}</span>
                                    {' '}results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    {usersFromDb.links.map((link, i) => {
                                        if (link.url === null) return null;
                                        
                                        return (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                                                    link.active
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                } ${i === 0 ? 'rounded-l-md' : ''} ${
                                                    i === usersFromDb.links.length - 1 ? 'rounded-r-md' : ''
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Modal */}
            <Transition appear show={isViewOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsViewOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        User Details
                                    </Dialog.Title>
                                    {selectedUser && (
                                        <div className="mt-4">
                                            <div className="flex items-center gap-4 mb-4">
                                                <img
                                                    src={selectedUser.avatar ? `/storage/${selectedUser.avatar}` : '/storage/default.jpg'}
                                                    alt={selectedUser.name}
                                                    className="h-16 w-16 rounded-full"
                                                />
                                                <div>
                                                    <p className="text-lg font-semibold">{selectedUser.name}</p>
                                                    <p className="text-gray-500">{selectedUser.email}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="flex items-center gap-2">
                                                    <span className="font-medium">Status:</span>
                                                    <span className={`capitalize px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                            ${selectedUser.approval_status === 'approved' ? 'bg-green-100 text-green-800' :
                                                            selectedUser.approval_status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'}`}>
                                                        {selectedUser.approval_status}
                                                    </span>
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <span className="font-medium">Level:</span>
                                                    <span className="capitalize">
                                                        {selectedUser.level}
                                                    </span>
                                                </p>
                                                <p><span className="font-medium">Online:</span> {selectedUser.is_online ? 'Yes' : 'No'}</p>
                                                <p><span className="font-medium">Anonymous Mode:</span> {selectedUser.is_anonymous ? 'Yes' : 'No'}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200"
                                            onClick={() => setIsViewOpen(false)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Action Confirmation Modal */}
            <Transition appear show={isActionOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsActionOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Confirm Action
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Are you sure you want to {actionType} this user?
                                        </p>
                                    </div>

                                    <div className="mt-4 flex gap-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200"
                                            onClick={confirmAction}
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200"
                                            onClick={() => setIsActionOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </UsersLayout>
    );
}