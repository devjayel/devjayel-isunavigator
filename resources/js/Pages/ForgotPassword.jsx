import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import Logo from "../../../public/favicon.png";
export default function ForgetPassword() {
    return <GuestLayout>
        <Head title="Forgot Password" />
        <div className="bg-white shadow-sm rounded-sm  w-[500px]">
            <div className="flex flex-col items-center justify-center border-b p-4">
                <img src={Logo} alt="Logo" className="w-52 h-52 mx-auto" />
                <h1 className="text-center text-3xl font-bold text-gray-800 mt-5 mb-3">Forgot Password</h1>
            </div>
            <div className="p-5">
                <form className="flex flex-col">
                    <div className="mb-3">
                        <label htmlFor="email" className="mb-1">Email</label>
                        <input type="email" id="email" name="email" placeholder="Email" />
                    </div>
                    <button type="submit" className="bg-green-800 text-white px-4 py-2 rounded-md mt-10">Send Reset Password Link</button>
                </form>
                <div className="flex justify-center mt-4">
                    <Link href={route("login")} className="text-green-800 hover:underline">
                        Login
                    </Link>
                    <span className="mx-2">|</span>
                    <Link href={route("register")} className="text-green-800 hover:underline">
                        Register
                    </Link>
                    <span className="mx-2">|</span>
                    <Link href={route("forgot-password")} className="text-green-800 hover:underline">Reset Password</Link>
                </div>
            </div>
        </div>
    </GuestLayout>
}