export default async function DomainHomePage({ params }: { params: Promise<{ domain: string }> }) {
    const { domain } = await params;
    return (
        <div className="flex min-h-screen flex-col items-center p-16 bg-gray-50">
            <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 mb-6">Welcome to {domain}</h1>
            <p className="text-2xl text-gray-600 max-w-2xl text-center leading-relaxed">
                This is the custom frontend for your amazing website. It is served dynamically based on your registered domain slug.
            </p>
            <div className="mt-10 flex gap-4">
                <a href={`/login`} className="rounded-lg bg-black px-8 py-3 font-semibold text-white transition hover:bg-gray-800">
                    Go to Login
                </a>
            </div>
        </div>
    );
}
