import { connectToDatabase } from "@/config/databaseConnection";
import Tenant from "@/models/tenant.model";
import WebSettings from "@/models/webSettings.model";
import NewsletterModal from "@/components/NewsletterModal";
import Hydrator from "@/components/Hydator";
import Faq from "@/components/Faq";

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
    <div className={`flex flex-col  bg-gray-50 theme-${theme}`}>
      <Hydrator settings={settingsData} />

      <div className="flex-grow">
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {settings?.websiteTitle || "Experience Exceptional Shopping"}
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg">
            {settings?.siteDescription ||
              "Browse premium products and make confident shopping decisions."}
          </p>
        </div>
      </div>
      <Faq />

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
