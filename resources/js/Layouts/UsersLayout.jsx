import { Link, Head } from "@inertiajs/react";
import { useState } from "react";
import Logo from "@/Images/favicon.png";
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function UsersLayout({ children, title = 'Dashboard', user }) {

    return (
        <div className="flex h-screen bg-gray-100">
            <Head title={title} />
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-5">
                            <img src={Logo} className="inline-block size-12 rounded-full ring-2 ring-white" />
                            <div className="text-xl font-semibold text-gray-800">
                                {title}
                            </div>
                        </div>
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-md">
                                <span className="text-gray-600">{user.name}</span>
                                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Menu.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="px-1 py-1">
                                        {user.approval_status === 'approved' && (
                                            <>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link
                                                            href={route('overview')}
                                                            className={`${active ? 'bg-green-800 text-white' : 'text-gray-900'
                                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                        >
                                                            Overview
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <>
                                                            {user.level === 'admin' ? (
                                                                <Link
                                                                    href={route('admin.map')}
                                                                    className={`${active ? 'bg-green-800 text-white' : 'text-gray-900'
                                                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                                >
                                                                    Map
                                                                </Link>
                                                            ) : (
                                                                <Link
                                                                    href={route('map')}
                                                                    className={`${active ? 'bg-green-800 text-white' : 'text-gray-900'
                                                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                                >
                                                                    Map
                                                                </Link>

                                                            )}
                                                        </>
                                                    )}
                                                </Menu.Item>
                                                {user.level === 'admin' && (
                                                    <>
                                                        <Link
                                                            href={route('user.index')}
                                                            className={`hover:bg-green-800 hover:text-white group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                        >
                                                            Users
                                                        </Link>
                                                    </>
                                                )}
                                            </>
                                        )}
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href={route('profile')}
                                                    className={`${active ? 'bg-green-800 text-white' : 'text-gray-900'
                                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                >
                                                    Profile
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href={route("logout")}
                                                    method="post"
                                                    as="button"
                                                    className={`${active ? 'bg-green-800 text-white' : 'text-gray-900'
                                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                >
                                                    Logout
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </header>

                {/* Main Content */}
                <main className={"flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 w-full " + (title != 'Map' && "p-4")}>
                    {children}
                </main>
            </div>
        </div>
    );
}