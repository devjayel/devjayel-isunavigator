import { useForm } from "@inertiajs/react";

export default function Email({email}) {
	const { data, setData, post, processing, errors } = useForm({
		email: email,
	});

	const submit = (e) => {
		e.preventDefault();
		post(route('update.email'));
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow-sm">
			<h2 className="text-lg font-medium text-gray-900">Email</h2>
			<p className="mt-1 text-sm text-gray-600">
				Update your account's email address.
			</p>
			<form onSubmit={submit} className="mt-6 space-y-6">
				<div>
					<label htmlFor="email" className="block text-sm font-medium text-gray-700">
						Email
					</label>
					<input
						id="email"
						type="email"
						value={data.email}
						onChange={e => setData('email', e.target.value)}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
					/>
					{errors.email && (
						<p className="mt-2 text-sm text-red-600">{errors.email}</p>
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