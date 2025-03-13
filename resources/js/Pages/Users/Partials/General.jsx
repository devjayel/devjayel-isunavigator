import { useForm } from "@inertiajs/react";

export default function General({user}) {
    const { data, setData, post, processing, errors } = useForm({
        name: user.name,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('update.general'));
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">Profile</h2>
            <p className="mt-1 text-sm text-gray-600">
                Update your account's name.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                    {errors.name && (
                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
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