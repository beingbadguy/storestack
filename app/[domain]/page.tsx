import { connectToDatabase } from "@/config/databaseConnection";
import Tenant from "@/models/tenant.model";
import WebSettings from "@/models/webSettings.model";
import NewsletterModal from "@/components/NewsletterModal";
import Hydrator from "@/components/Hydator";
import Faq from "@/components/Faq";
import HeroSection from "@/components/HeroSection";
import Categories from "@/components/Categories";
import Products from "@/components/Products";
import TrustStrip from "@/components/TrustStrip";
import Testimonials from "@/components/Testimonials";

export default async function DomainHomePage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;

  await connectToDatabase();
  const tenant = await Tenant.findOne({ slug: domain });
  let settings = null;
  // console.log("tenant",tenant)

  if (tenant) {
    settings = await WebSettings.findOne({ tenantId: tenant._id }).lean();
    if (!settings) {
      const createdSettings = await WebSettings.create({
        tenantId: tenant._id,
      });
      settings = createdSettings.toObject();
    }
    // console.log("settings",settings);
  }

  const theme = settings?.theme || "teal-white";
  const settingsData = settings ? JSON.parse(JSON.stringify(settings)) : null;

  return (
    <div className={`flex flex-col theme-${theme}`}>
      <Hydrator settings={settingsData} />

      {/* hero section  */}
      <HeroSection />
      <Categories />

      {settings?.isTrustStripEnabled && <TrustStrip settings={settings} />}
      <Products />
      <Testimonials />

      {/* faq */}
      <Faq />

      {/* newsletter  */}
      {settings?.enableNewsletter && (
        <NewsletterModal
          theme={theme}
          title={settings?.newsletterTitle}
          text={settings?.newsletterText}
        />
      )}
    </div>
  );
}
