import { ReactNode } from "react";
import { connectToDatabase } from "@/config/databaseConnection";
import Tenant from "@/models/tenant.model";
import { FiAlertTriangle } from "react-icons/fi";

export default async function DomainLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ domain: string }>;
}) {
    const { domain } = await params;
    
    await connectToDatabase();
    
    const tenant = await Tenant.findOne({ slug: domain });
    
    if (!tenant) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] p-4 py-12">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-teal-500 to-teal-400 p-8 flex flex-col items-center justify-center text-white">
                        <div className="bg-white p-3.5 rounded-2xl mb-4 shadow-sm">
                            <FiAlertTriangle className="text-orange-500 text-3xl" />
                        </div>
                        <h1 className="text-lg font-medium mb-1">Website Not Registered</h1>
                        <p className="text-orange-50 text-sm">This domain is not properly configured</p>
                    </div>

                    {/* Body Section */}
                    <div className="p-10 md:px-12">
                        <h2 className="text-2xl font-serif text-[#1e293b] mb-3">What does this mean?</h2>
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                            The website you're trying to access hasn't been registered with our platform yet. This could happen for several reasons:
                        </p>

                        {/* Bulleted List */}
                        <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-6 mb-8">
                            <ul className="space-y-3.5">
                                {[
                                    "The domain name is not yet registered with this hosting platform",
                                    "DNS settings are still propagating (this can take 24-48 hours)",
                                    "The website configuration is incomplete or pending activation",
                                    "The domain subscription may have expired"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-slate-600 text-sm">
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Numbered List Section */}
                        <h3 className="text-slate-800 font-semibold text-base mb-4">What should I do?</h3>
                        <div className="space-y-4">
                            {[
                                "If you're the website owner, please check your domain configuration and ensure it's properly registered with your hosting provider.",
                                "If you recently made DNS changes, please wait 24-48 hours for propagation to complete.",
                                "If you're a visitor, please contact the website owner or try again later."
                            ].map((item, i) => (
                                <div key={i} className="flex items-start">
                                    <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xs font-semibold mr-4 flex-shrink-0 mt-0.5">
                                        {i + 1}
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {children}
        </div>
    );
}
