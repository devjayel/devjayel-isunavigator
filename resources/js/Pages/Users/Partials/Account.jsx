import { useForm } from "@inertiajs/react";

export default function Account({ user }) {
    const { data, setData, post, processing, errors } = useForm({
        is_anonymous: user.is_anonymous || false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('update.account'));
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">Privacy Settings</h2>
            <p className="mt-1 text-sm text-gray-600">
                Manage your location visibility and privacy preferences.
            </p>

            <form onSubmit={submit} className="mt-6">
                <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                        <input
                            id="anonymous"
                            type="checkbox"
                            checked={data.is_anonymous}
                            onChange={e => setData('is_anonymous', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-green-800 focus:ring-green-600 cursor-pointer"
                        />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                        <label htmlFor="anonymous" className="font-medium text-gray-900 cursor-pointer">
                            Enable Private Mode
                        </label>
                        <p className="text-gray-500">
                            When enabled, your location will be hidden from other users. This helps maintain your privacy while using the navigation system. You can toggle this setting at any time.
                        </p>
                        {errors.is_anonymous && (
                            <p className="mt-1 text-sm text-red-600">{errors.is_anonymous}</p>
                        )}
                    </div>
                </div>

                <div className="mt-6">
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