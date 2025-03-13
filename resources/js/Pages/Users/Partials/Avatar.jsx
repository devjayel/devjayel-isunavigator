import { useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Avatar({ user, storage }) {
    const [preview, setPreview] = useState(null);
    const { data, setData, post, processing, errors, progress } = useForm({
        avatar: null,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('avatar', file);

        // Create preview URL
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('update.avatar'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">Profile Photo</h2>
            <p className="mt-1 text-sm text-gray-600">
                Update your account's profile photo.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="flex items-center gap-6">
                    {/* Current or Preview Image */}
                    <div className="relative size-24">
                        <img
                            src={preview || storage + "/" +  user.avatar || storage + '/default.jpg'}
                            alt="Avatar Preview"
                            className="size-24 rounded-full object-cover border-2 border-gray-200"
                        />
                        {processing && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <label className="block">
                            <span className="sr-only">Choose profile photo</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-green-50 file:text-green-700
                                    hover:file:bg-green-100"
                            />
                        </label>
                        {errors.avatar && (
                            <p className="mt-2 text-sm text-red-600">{errors.avatar}</p>
                        )}
                    </div>
                </div>

                {/* Upload Progress Bar */}
                {progress && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-green-600 h-2.5 rounded-full transition-all duration-150"
                            style={{ width: `${progress.percentage}%` }}
                        ></div>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-green-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        disabled={processing || !data.avatar}
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}