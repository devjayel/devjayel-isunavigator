import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import Logo from "../../../public/favicon.png";
export default function Home() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('post.login'),{
            onError: (errors) => {
                console.log(data);
                console.log(errors);
            }
        });
    };
    return <GuestLayout>
        <Head title="Home" />
        <div className="bg-white shadow-sm rounded-sm  w-[500px]">
            <div className="flex flex-col items-center justify-center border-b p-4">
                <img src={Logo} alt="Logo" className="w-52 h-52 mx-auto" />
                <h1 className="text-center text-3xl font-bold text-gray-800 mt-5 mb-3">Login</h1>
            </div>
            <div className="p-5">
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                        />
                        {errors.email && <div className="text-red-500 mt-1">{errors.email}</div>}
                    </div>
                    <div>
                        <label htmlFor="password" className="mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                        />
                        {errors.password && <div className="text-red-500 mt-1">{errors.password}</div>}
                    </div>
                    <button type="submit" className="bg-green-800 text-white px-4 py-2 rounded-md mt-10">Login</button>
                </form>
                <div className="flex justify-center mt-4">
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