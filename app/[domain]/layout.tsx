import { ReactNode } from "react";
import { connectToDatabase } from "@/config/databaseConnection";
import Tenant from "@/models/tenant.model";

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
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Domain Not Registered</h1>
                    <p className="text-gray-600">The subdomain <span className="font-semibold">{domain}</span> is not yet registered or is not live.</p>
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
