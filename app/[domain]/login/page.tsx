export default async function DomainLoginPage({ params }: { params: Promise<{ domain: string }> }) {
    const { domain } = await params;
    return (
        <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md  rounded-2xl  md:p-10 border border-gray-100">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-500 mt-2 text-sm font-medium">Sign in to your <span className="text-black font-semibold uppercase">{domain}</span> account</p>
                </div>
                <form className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                        <input type="email" placeholder="you@example.com" className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                        <input type="password" placeholder="••••••••" className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition" />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black w-4 h-4 cursor-pointer" />
                            <span className="ml-2 text-sm text-gray-600 font-medium">Remember me</span>
                        </label>
                        <a href="#" className="text-sm font-semibold text-black hover:underline">Forgot password?</a>
                    </div>
                    <button type="button" className="w-full bg-black hover:bg-gray-900 text-white rounded-lg py-3.5 font-semibold transition mt-6 shadow-md hover:shadow-lg active:scale-[0.98]">
                        Sign In
                    </button>
                </form>
                <div className="mt-8 text-center text-sm text-gray-600">
                    Don't have an account? <a href="#" className="font-semibold text-black hover:underline">Sign up</a>
                </div>
            </div>
        </div>
    );
}
