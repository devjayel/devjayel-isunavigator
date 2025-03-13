import { useForm } from "@inertiajs/react";

export default function Password() {
    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('update.password'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">Password</h2>
            <p className="mt-1 text-sm text-gray-600">
                Ensure your account is using a long, random password to stay secure.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                        Current Password
                    </label>
                    <input
                        id="current_password"
                        type="password"
                        value={data.current_password}
                        onChange={e => setData('current_password', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                    {errors.current_password && (
                        <p className="mt-2 text-sm text-red-600">{errors.current_password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                    {errors.password_confirmation && (
                        <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-green-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        disabled={processing}
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}