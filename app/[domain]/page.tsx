import CenteredNavbar from "@/components/navigation_bars/CenteredNavbar";
import DarkNavbar from "@/components/navigation_bars/DarkNavbar";
import DoubleNavbar from "@/components/navigation_bars/DoubleNavbar";
import FloatingNavbar from "@/components/navigation_bars/FloatingNavbar";
import MinimalNavbar from "@/components/navigation_bars/MinimalNavbar";

import MultiColumnFooter from "@/components/footers/MultiColumnFooter";
import MinimalContactFooter from "@/components/footers/MinimalContactFooter";
import CenteredFooter from "@/components/footers/CenteredFooter";
import NewsletterFooter from "@/components/footers/NewsletterFooter";
import CookieConsent from "@/components/CookieConsent";

import { connectToDatabase } from "@/config/databaseConnection";
import Tenant from "@/models/tenant.model";
import WebSettings from "@/models/webSettings.model";
import NewsletterModal from "@/components/NewsletterModal";
import Hydrator from "@/components/Hydator";

export default async function DomainHomePage({ params }: { params: Promise<{ domain: string }> }) {
    const { domain } = await params;

    await connectToDatabase();
    const tenant = await Tenant.findOne({ slug: domain });
    let settings = null;
    console.log("tenant",tenant)
    
    if (tenant) {
        settings = await WebSettings.findOne({ tenantId: tenant._id });
        if (!settings) {
            settings = await WebSettings.create({ tenantId: tenant._id });
        }
        console.log("settings",settings);
    }

    const navbarLayout = settings?.navbarLayout || "minimal";
    const footerLayout = settings?.footerLayout || "multicolumn";
    let brandName = settings?.brandName || domain;
    if (brandName.length > 14) {
        brandName = brandName.substring(0, 14);
    }
    const theme = settings?.theme || "teal-white";

    return (
        <div className={`flex flex-col min-h-screen bg-gray-50 theme-${theme}`}>
             <Hydrator settings={settings} />
            <div className="flex-grow">
                {navbarLayout === "minimal" && <MinimalNavbar brandName={brandName} />}
                {navbarLayout === "centered" && <CenteredNavbar brandName={brandName} />}
                {navbarLayout === "floating" && <FloatingNavbar brandName={brandName} />}
                {navbarLayout === "dark" && <DarkNavbar brandName={brandName} />}
                {navbarLayout === "double" && <DoubleNavbar brandName={brandName} />}
                
                {/* Dynamic Content Area */}
                <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {settings?.websiteTitle || "Experience Exceptional Shopping"}
                    </h1>
                    <p className="text-gray-500 max-w-2xl text-lg">
                        {settings?.siteDescription || "Browse premium products and make confident shopping decisions."}
                    </p>
                </div>
            </div>

            {footerLayout === "multicolumn" && <MultiColumnFooter brandName={brandName} description={settings?.websiteDescription} />}
            {footerLayout === "minimalcontact" && <MinimalContactFooter brandName={brandName} />}
            {footerLayout === "centered" && <CenteredFooter brandName={brandName} />}
            {footerLayout === "newsletter" && <NewsletterFooter brandName={brandName} description={settings?.websiteDescription} />}

            {
                settings?.enableNewsletter && <NewsletterModal theme={theme} title={settings?.newsletterTitle} text={settings?.newsletterText}  />
            }

            <CookieConsent settings={settings ? JSON.parse(JSON.stringify(settings)) : null} />
        </div>
    );
}
