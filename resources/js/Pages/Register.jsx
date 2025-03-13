import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import Logo from "../../../public/favicon.png";

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return <GuestLayout>
        <Head title="Home" />
        <div className="bg-white shadow-sm rounded-sm  w-[500px]">
            <div className="flex flex-col items-center justify-center border-b p-4">
                <img src={Logo} alt="Logo" className="w-52 h-52 mx-auto" />
                <h1 className="text-center text-3xl font-bold text-gray-800 mt-5 mb-3">Register</h1>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <div>
                        <label htmlFor="name">Name</label>
                        <input 
                            type="text"
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password_confirmation">Password Confirmation</label>
                        <input 
                            type="password" 
                            id="password_confirmation" 
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                        {errors.password_confirmation && (
                            <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                        )}
                    </div>
                    <button 
                        type="submit" 
                        className="bg-green-800 text-white px-4 py-2 rounded-md mt-10"
                        disabled={processing}
                    >
                        Register
                    </button>
                </form>
                <div className="flex justify-center mt-4">
                    <Link href={route("login")} className="text-green-800 hover:underline">Login</Link>
                    <span className="mx-2">|</span>
                    <Link href={route("forgot-password")} className="text-green-800 hover:underline">Reset Password</Link>
                </div>
            </div>
        </div>
    </GuestLayout>
}