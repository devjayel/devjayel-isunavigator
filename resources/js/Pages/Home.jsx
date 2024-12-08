import { Head } from "@inertiajs/react";
export default function Home() {
    return <div className="h-srceen">
        <Head title="Home" />
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-3xl font-bold">Hello World</h1>
        </div>
    </div>
}