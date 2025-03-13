export default function GuestLayout({ children }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
            {children}
        </div>
    );
};