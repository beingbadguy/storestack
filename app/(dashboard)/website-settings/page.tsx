"use client";

import CenteredNavbar from "@/components/navigation_bars/CenteredNavbar";
import DarkNavbar from "@/components/navigation_bars/DarkNavbar";
import DoubleNavbar from "@/components/navigation_bars/DoubleNavbar";
import FloatingNavbar from "@/components/navigation_bars/FloatingNavbar";
import MinimalNavbar from "@/components/navigation_bars/MinimalNavbar";
import MultiColumnFooter from "@/components/footers/MultiColumnFooter";
import MinimalContactFooter from "@/components/footers/MinimalContactFooter";
import CenteredFooter from "@/components/footers/CenteredFooter";
import NewsletterFooter from "@/components/footers/NewsletterFooter";
import { axiosClient } from "@/config/axiosClient";
import { API_ENDPOINTS } from "@/config/endpoint";
import { useAuthStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FiSettings,
  FiMail,
  FiNavigation,
  FiLayout,
  FiShoppingCart,
  FiLayers,
  FiGlobe,
  FiPhone,
  FiMapPin,
  FiSave,
  FiCheckCircle,
  FiSearch,
  FiRefreshCcw,
  FiImage,
  FiShare2,
  FiShield,
  FiUpload,
  FiPlusCircle,
  FiXCircle,
  FiTrash2,
  FiEdit,
} from "react-icons/fi";
import {
  BiCross,
  BiImage,
  BiImageAdd,
  BiSearch,
  BiUpload,
  BiX,
} from "react-icons/bi";
import { PiImageSquareThin, PiUploadSimpleThin } from "react-icons/pi";
import { div } from "framer-motion/client";
import Image from "next/image";
import { AiOutlineDelete } from "react-icons/ai";
import { LiaCloudUploadAltSolid } from "react-icons/lia";
import { singlePhotoUpload } from "@/common/singlePhotoUpload";
import Loader from "@/components/Loader";

type TabId =
  | "general"
  | "newsletter"
  | "navbar"
  | "footer"
  | "seller"
  | "theme"
  | "faq"
  | "design";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  {
    id: "general",
    label: "General",
    icon: <FiGlobe className="w-4 h-4 mr-2" />,
  },
  {
    id: "design",
    label: "Design",
    icon: <FiSearch className="w-4 h-4 mr-2" />,
  },
  {
    id: "navbar",
    label: "Navbar",
    icon: <FiNavigation className="w-4 h-4 mr-2" />,
  },
  {
    id: "footer",
    label: "Footer",
    icon: <FiLayout className="w-4 h-4 mr-2" />,
  },
  // { id: "seller", label: "Seller", icon: <FiShoppingCart className="w-4 h-4 mr-2" /> },
  { id: "theme", label: "Theme", icon: <FiImage className="w-4 h-4 mr-2" /> },
  { id: "faq", label: "FAQ", icon: <FiSearch className="w-4 h-4 mr-2" /> },
  {
    id: "newsletter",
    label: "Newsletter",
    icon: <FiMail className="w-4 h-4 mr-2" />,
  },
];

export type FAQ = {
  question: string;
  answer: string;
  _id: string;
};

export default function WebsiteSettingsPage() {
  const { user, setSellerDomain } = useAuthStore();

  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [isDomainAvailable, setIsDomainAvailable] = useState<boolean>(false);
  const [domain, setDomain] = useState("");
  const [tenantId, setTenantId] = useState<string>("");
  const [readyToDeploy, setReadyToDeploy] = useState(false);
  const [isWebsiteLive, setIsWebsiteLive] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("teal-white");
  const [previewModal, setPreviewModal] = useState<{
    type: "navbar" | "footer" | null;
    layout: string;
  }>({ type: null, layout: "" });
  const [cookieError, setCookieError] = useState("");

  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [singleBannerImage, setSingleBannerImage] = useState<File | null>(null);
  const [singleBannerPreview, setSingleBannerPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBannerImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && file?.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB.");
      return;
    }
    setSingleBannerImage(file as File);
  };

  useEffect(() => {
    if (!singleBannerImage) return;
    const objectUrl = URL.createObjectURL(singleBannerImage);
    setSingleBannerPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [singleBannerImage]);

  const singleBannerUpload = async () => {
    try {
      setIsLoading(true);
      if (!singleBannerImage) {
        toast.error("Please Select an image to upload");
        return;
      }
      const imageLink = await singlePhotoUpload(singleBannerImage);
      if (imageLink) {
        console.log(imageLink);
        const newSettings = { ...settings, bannerImage: imageLink };
        setSettings(newSettings);
        saveWebSettings(newSettings);
        setSingleBannerPreview("");
        setSingleBannerImage(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFaq = async () => {
    console.log("Saving FAQ:", { question, answer });
    if (!question || !answer) {
      toast.error("Please fill in both the question and answer fields.");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axiosClient.post(API_ENDPOINTS.ADD_FAQ, {
        tenantId: tenantId,
        question,
        answer,
      });
      console.log(response?.data);
      if (response?.data?.success) {
        toast.success("FAQ added successfully.");
        setQuestion("");
        setAnswer("");
      }
      getWebSettings(tenantId);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFaq = async (faqId: string) => {
    if (!faqId) {
      toast.error("Invalid FAQ ID.");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axiosClient.delete(API_ENDPOINTS.DELETE_FAQ, {
        data: {
          tenantId,
          faqId,
        },
      });
      console.log(response?.data);
      if (response?.data?.success) {
        toast.success("FAQ deleted successfully.");
      }
      getWebSettings(tenantId);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete FAQ.");
    } finally {
      setIsLoading(false);
    }
  };

  const router = useRouter();

  const [settings, setSettings] = useState({
    brandName: "",
    websiteTitle: "",
    websiteDescription: "",
    siteFavicon: "",
    footerLogo: "",
    siteLogoLight: "",
    siteLogoDark: "",
    isBannerEnabled: false,
    bannerType: "image",
    videoBackgroundLink: "",
    bannerImage: "",
    videoBackground: "",
    navbarBackgroundImage: "",
    footerBackgroundImage: "",
    sliderImages: [],
    contactEmail: "",
    phoneNumber: "",
    city: "",
    businessAddress: "",
    latitude: "",
    longitude: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: "",
    },
    enableCookieConsent: false,
    cookiePosition: "bottom",
    cookieText:
      "We use cookies to improve your experience, analyze site traffic, and support personalized advertising. By continuing to browse, you consent to the use of essential, analytics, and marketing cookies in accordance with our Privacy Policy.",
    enableNewsletter: false,
    newsletterTitle: "",
    newsletterText: "",
    theme: "teal-white",
    navbarLayout: "minimal",
    footerLayout: "multicolumn",
  });

  const checkDomain = async (slug: string) => {
    try {
      setIsLoading(true);
      const response = await axiosClient.get(API_ENDPOINTS.GET_DOMAIN, {
        params: {
          domain: slug,
        },
      });
      setIsDomainAvailable(response.data.success);
    } catch (error: any) {
      setIsDomainAvailable(false);
    } finally {
      setIsLoading(false);
    }
  };

  const deployWebsite = async () => {
    try {
      setIsLoading(true);
      const response = await axiosClient.post(API_ENDPOINTS.DEPLOY_WEBSITE, {
        slug: domain,
        userId: user?.userId,
      });
      toast.success("your website has been deployed successfully.");
      setReadyToDeploy(false);
      checkDomain(domain);
      isTenantLive();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to deploy website");
    } finally {
      setIsLoading(false);
    }
  };

  const getWebSettings = async (tId: string) => {
    try {
      setIsLoading(true);
      const response = await axiosClient.get(API_ENDPOINTS.GET_WEBSETTINGS, {
        params: {
          tenantId: tId,
        },
      });

      if (!settings?.cookieText) {
        setCookieError("Please add cookie text.");
      }

      if (response?.data?.data) {
        setSettings((prev) => ({
          ...prev,
          ...response.data.data,
          socialLinks: {
            ...prev.socialLinks,
            ...(response.data.data.socialLinks || {}),
          },
        }));

        setFaqs(response?.data?.data?.faqs || []);

        if (response.data.data.theme) {
          setSelectedTheme(response.data.data.theme);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isTenantLive = async () => {
    if (!user?.userId) {
      router.push("/login");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axiosClient.get(API_ENDPOINTS.GET_TENANT_DETAIL, {
        params: {
          sellerId: user?.userId,
        },
      });
      if (res?.data?.success) {
        setIsWebsiteLive(res.data.data?.isWebsiteLive);
        setDomain(res?.data.data?.slug);
        const tId = res?.data?.data?._id;
        setTenantId(tId);
        if (res?.data?.data?.isWebsiteLive) {
          setSellerDomain(res?.data.data?.slug);
        }
        if (tId) {
          getWebSettings(tId);
        }
      }
    } catch (error: any) {
      console.log(error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWebSettings = async (customSettings = settings) => {
    if (!tenantId) {
      toast.error("Please deploy a website domain first.");
      return;
    }
    if (!customSettings?.cookieText) {
      setCookieError("Please add cookie text.");
      return;
    }
    setCookieError("");
    setIsLoading(true);
    const updatePromise = axiosClient.post(API_ENDPOINTS.UPDATE_WEBSETTINGS, {
      tenantId: tenantId,
      sellerId: user?.userId,
      ...customSettings,

      theme: selectedTheme,
    });

    toast.promise(updatePromise, {
      loading: "Saving changes...",
      success: "Settings updated successfully!",
      error: "Failed to update settings.",
    });

    try {
      await updatePromise;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isTenantLive();
  }, [user?.userId]);

  const handleSocialChange = (
    platform: keyof typeof settings.socialLinks,
    value: string,
  ) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  return (
    <div className="w-full pb-10">
      <Loader isLoading={isLoading} />
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-sm">
            <FiSettings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Website Settings
            </h1>
            <p className="text-sm text-gray-500">
              Configure your website's global settings and preferences
            </p>
          </div>
        </div>
        <button
          className="mt-4 md:mt-0 px-5 py-2.5 bg-teal-600 text-white rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-sm font-medium text-sm cursor-pointer text-center self-start lg:self-end"
          onClick={() => saveWebSettings(settings)}
        >
          <FiSave className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-full border border-gray-200 p-1.5 mb-6 flex overflow-x-auto hide-scrollbar shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center py-2 px-6 text-sm font-medium transition-all whitespace-nowrap outline-none rounded-full flex-1 cursor-pointer ${
              activeTab === tab.id
                ? "bg-teal-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {activeTab === "general" && (
          <div className="p-8 space-y-10">
            {/* Basic Information */}
            <div>
              <div className="flex items-center gap-2 text-gray-700 mb-6 pb-2 border-b border-gray-200">
                <FiGlobe className="w-5 h-5" />
                <h2 className="text-base font-semibold">Basic Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Brand Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.brandName}
                    onChange={(e) =>
                      setSettings({ ...settings, brandName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-sm"
                  />
                </div>

                {!isWebsiteLive && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                      Website Domain <span className="text-red-500">*</span>
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-400 text-gray-400 flex items-center justify-center text-[9px] font-bold">
                        i
                      </span>
                    </label>
                    <div className="flex items-center justify-start">
                      <input
                        type="text"
                        placeholder="Enter Domain"
                        value={domain}
                        className="w-full px-4 py-2.5 rounded-lg border-l border-gray-200 bg-gray-50 text-gray-500 focus:outline-none text-sm pr-10"
                        onChange={(e) => {
                          setDomain(e.target.value);
                          checkDomain(e.target.value);
                        }}
                      />
                      <span className=" px-4 py-2.5 rounded-lg border-r border-gray-200 bg-gray-50 text-gray-500 focus:outline-none text-sm pr-10 bg-teal-50 font-bold">
                        .amancodes.in
                      </span>
                      <FiCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    </div>
                    <div className="flex flex-col justify-between gap-2 items-start mt-2">
                      <div className="w-auto">
                        {domain?.length === 0 && (
                          <p className="text-xs text-gray-500 font-medium flex items-center justify-center">
                            Enter Domain Name
                          </p>
                        )}
                        {domain?.length > 0 &&
                          (isDomainAvailable ? (
                            <p className="text-xs text-teal-500 font-medium flex items-center justify-center">
                              {" "}
                              <FiCheckCircle className="w-3 h-3 mr-1" />
                              Domain is available -- ({" "}
                              {domain + ".amancodes.in"} )
                            </p>
                          ) : (
                            <p className="text-xs text-red-500 font-medium flex items-center justify-center">
                              {" "}
                              <FiXCircle className="w-3 h-3 mr-1" />
                              Domain is not available -- ({" "}
                              {domain + ".amancodes.in"} )
                            </p>
                          ))}
                      </div>

                      {isDomainAvailable && domain?.length > 0 && (
                        <button
                          className="px-3 py-3 border border-gray-200 text-gray-700 rounded-md text-xs font-semibold hover:bg-teal-100 flex items-center gap-1.5 cursor-pointer bg-teal-50 text-teal-500 "
                          onClick={() => setReadyToDeploy(true)}
                        >
                          <FiPlusCircle className="w-3 h-3 font-bold" />
                          Deploy Website
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {readyToDeploy && (
                  <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
                    <div className="w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-xl">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Confirm Deployment
                      </h2>

                      <p className="mt-2 text-sm text-gray-600">
                        Are you sure you want to deploy your website?
                      </p>

                      <div className="mt-6 flex justify-end gap-3">
                        <button
                          onClick={() => setReadyToDeploy(false)}
                          className="rounded-lg border border-gray-300 cursor-pointer px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={deployWebsite}
                          className="rounded-lg bg-teal-500 cursor-pointer px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-600"
                        >
                          Deploy
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {isWebsiteLive && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                      Website Domain <span className="text-red-500">*</span>
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-400 text-gray-400 flex items-center justify-center text-[9px] font-bold">
                        i
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={"https://" + domain + ".amancodes.in"}
                        readOnly
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 focus:outline-none text-sm pr-10"
                      />
                      <FiCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 w-4 h-4" />
                    </div>
                    <div className="flex justify-between items-start mt-2">
                      <p className="text-xs text-gray-400">
                        Your website domain is set and cannot be changed
                      </p>
                      <button className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-50 flex items-center gap-1.5">
                        <FiRefreshCcw className="w-3 h-3" />
                        Request Change
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Website Title
                  </label>
                  <input
                    type="text"
                    value={settings.websiteTitle}
                    onChange={(e) =>
                      setSettings({ ...settings, websiteTitle: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-sm"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Website Description
                  </label>
                  <textarea
                    rows={3}
                    value={settings.websiteDescription}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        websiteDescription: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-sm resize-none"
                    placeholder="Enter website description used in footers..."
                  />
                </div>
              </div>
            </div>

            {/* Media & Branding */}
            {/* <div> */}
            {/* <div className="flex items-center gap-2 text-gray-700 mb-6 pb-2 border-b border-gray-200">
                <FiImage className="w-5 h-5" />
                <h2 className="text-base font-semibold">Media & Branding</h2>
              </div>
               */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"> */}
            {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Favicon</label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                      <img src={settings.siteFavicon || "https://agentsweb.s3.us-east-2.amazonaws.com/public/MzA5/websitesettings/general/1774935048605_Logo.png"} alt="Favicon" className="w-full h-full object-contain p-1.5" />
                    </div>
                    <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium transition-colors">
                      <FiUpload className="w-4 h-4" /> Upload
                    </button>
                  </div>
                </div> */}
            {/* 
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Footer Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-32 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                      {settings.footerLogo ? (
                        <img src={settings.footerLogo} alt="Footer Logo" className="w-full h-full object-contain p-2" />
                      ) : (
                        <span className="text-xs text-gray-400 font-medium flex items-center gap-1"><FiImage className="w-3 h-3" /> No Logo</span>
                      )}
                    </div>
                    <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium transition-colors">
                      <FiUpload className="w-4 h-4" /> Upload
                    </button>
                  </div>
                </div> */}

            {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Logo Light</label>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-32 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                      <img src={settings.siteLogoLight || "https://agentsweb.s3.us-east-2.amazonaws.com/public/MzA5/websitesettings/general/1774935048591_Logo.png"} alt="Logo Light" className="w-full h-full object-contain p-2" />
                    </div>
                    <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium transition-colors">
                      <FiUpload className="w-4 h-4" /> Upload
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Logo Dark</label>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-32 bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center overflow-hidden shadow-inner">
                      <img src={settings.siteLogoDark || "https://agentsweb.s3.us-east-2.amazonaws.com/public/MzA5/websitesettings/general/1774935048599_Logo.png"} alt="Logo Dark" className="w-full h-full object-contain p-2" />
                    </div>
                    <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium transition-colors">
                      <FiUpload className="w-4 h-4" /> Upload
                    </button>
                  </div>
                </div> */}

            {/* <div className="col-span-1 md:col-span-2 border-t border-gray-100 pt-6 mt-2 flex flex-col gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Banner Type</label>
                    <select 
                      value={settings.bannerType} 
                      onChange={(e) => setSettings({...settings, bannerType: e.target.value})}
                      className="w-full md:w-1/2 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm bg-white"
                    >
                      <option value="image">Image Background</option>
                      <option value="videobackground">Video Background</option>
                      <option value="slider">Image Slider</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-700">Show Copyright in Footer</span>
                    </label> 
                  </div>
                </div> */}
            {/* </div>
            </div> */}

            {/* Banner & Media  */}
            <div>
              <div className="flex items-center gap-2 text-gray-700 mb-6 pb-2 border-b border-gray-200">
                <FiImage className="w-5 h-5" />
                <h2 className="text-base font-semibold">Banner & Media</h2>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold   uppercase tracking-wider text-gray-500">
                  Enable Banner
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.isBannerEnabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        isBannerEnabled: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {settings.isBannerEnabled && (
                <div className="my-2 flex-1 md:max-w-md">
                  <label className=" block text-xs font-bold   uppercase tracking-wider text-gray-500 mb-1.5 ">
                    Banner Type
                  </label>
                  <select
                    name=""
                    id=""
                    value={settings.bannerType}
                    onChange={(e) =>
                      setSettings({ ...settings, bannerType: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm bg-white cursor-pointer"
                  >
                    <option value="image">Image</option>
                    <option value="slider">Slider</option>
                    <option value="video">Video</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              )}

              {settings.isBannerEnabled && settings.bannerType === "image" && (
                <div className="my-2 ">
                  <label className=" block text-xs font-bold   uppercase tracking-wider text-gray-500 mb-1.5">
                    Banner Image
                  </label>

                  {settings?.bannerImage && !singleBannerImage ? (
                    <div className="relative">
                      <Image
                        src={settings.bannerImage}
                        alt="Single Banner Image"
                        width={600}
                        height={200}
                        className="mt-4 rounded-lg object-cover border w-full h-[300px]"
                      />
                      <div className="flex items-center gap-3 my-3 ">
                        <button
                          onClick={() => {
                            setSettings({ ...settings, bannerImage: "" });
                          }}
                          className="p-3  border border-red-200 bg-red-50 text-red-500 text-lg font-medium hover:bg-red-100 transition absolute -top-2 -right-3 rounded-full cursor-pointer"
                        >
                          <AiOutlineDelete />
                        </button>
                      </div>
                    </div>
                  ) : (
                    settings?.bannerType === "image" &&
                    !singleBannerImage && (
                      <div className="relative h-32 w-full overflow-hidden rounded-xl border border-dashed border-gray-300 cursor-pointer hover:border-teal-400 transition-all bg-gray-50">
                        {/* Hidden Native Input Layer */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBannerImageChange}
                          className="absolute inset-0 z-10 opacity-0 cursor-pointer"
                        />

                        {/* UI Layer */}
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 pointer-events-none">
                          <BiImageAdd className="text-gray-300 size-8" />

                          <p className="text-xs font-medium text-gray-400">
                            Click to upload banner
                          </p>
                        </div>
                      </div>
                    )
                  )}

                  {settings.bannerType === "image" && singleBannerImage && (
                    <div className="relative">
                      <Image
                        src={singleBannerPreview}
                        alt="Banner Preview"
                        width={600}
                        height={200}
                        className="mt-4 rounded-lg object-cover border w-full h-[300px]"
                      />
                      <div className="flex items-center gap-3 my-3 ">
                        <button
                          className="px-4 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600 transition  flex items-center gap-1 justify-center cursor-pointer text-md"
                          onClick={singleBannerUpload}
                        >
                          <LiaCloudUploadAltSolid className="" /> Upload
                        </button>

                        <button
                          onClick={() => {
                            setSingleBannerImage(null);
                            setSingleBannerPreview("");
                          }}
                          className="p-3  border border-red-200 bg-red-50 text-red-500 text-lg font-medium hover:bg-red-100 transition absolute -top-2 -right-3 rounded-full cursor-pointer"
                        >
                          <AiOutlineDelete />
                        </button>
                      </div>
                    </div>
                  )}
                  {/* <div className="flex items-center gap-4">
                    <div className="w-32 h-16 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                      {settings.bannerImage ? (
                        <img
                          src={settings.bannerImage}
                          alt="Banner"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                          <FiImage className="w-3 h-3" /> No Image
                        </span>
                      )}
                    </div>
                    <button
                      className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium transition-colors"
                      // onClick={() => setOpen(true)}
                    >
                      <FiUpload className="w-4 h-4" /> Upload
                    </button>
                  </div> */}
                </div>
              )}
            </div>

            {/* Legal & Compliance */}
            <div>
              <div className="flex items-center gap-2 text-gray-700 mb-6 pb-2 border-b border-gray-200">
                <FiShield className="w-5 h-5" />
                <h2 className="text-base font-semibold">
                  Legal & Cookie Compliance
                </h2>
              </div>
              <div className="flex justify-between items-center my-3 ">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Enable Cookie Consent Banner
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableCookieConsent}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enableCookieConsent: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
              {settings?.enableCookieConsent && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-6 md:items-end">
                    <div className="flex-1 md:max-w-md">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Cookie Position
                      </label>
                      <select
                        value={settings.cookiePosition}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            cookiePosition: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm bg-white"
                      >
                        <option value="bottom">Bottom Bar</option>
                        <option value="top">Top Bar</option>
                        <option value="center">Center Modal</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Cookie Text
                    </label>
                    <textarea
                      rows={3}
                      value={settings.cookieText}
                      onChange={(e) =>
                        setSettings({ ...settings, cookieText: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm resize-none"
                    ></textarea>
                    {cookieError && (
                      <p className="text-red-500 text-sm">{cookieError}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* newsletter tab  */}
        {activeTab === "newsletter" && (
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Enable Newsletter
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNewsletter}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enableNewsletter: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
            {settings.enableNewsletter && (
              <div className="mt-4 flex w-full flex-col lg:flex-row">
                <div className=" flex items-center justify-center p-4">
                  <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
                    {/* Close Button */}
                    <button
                      // onClick={() => setOpen(false)}
                      className="absolute right-5 top-5 z-20 rounded-full bg-white/90 p-2 text-gray-500 transition hover:bg-gray-100"
                    >
                      <BiX size={18} />
                    </button>

                    {/* Top Background */}
                    <div className="relative h-[280px] overflow-hidden bg-gradient-to-b from-teal-400 via-teal-300 tealto-orange-100">
                      {/* Curved Lines */}
                      <div className="absolute inset-0 opacity-30">
                        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full border border-white/60"></div>
                        <div className="absolute left-1/2 top-8 h-[450px] w-[450px] -translate-x-1/2 rounded-full border border-white/50"></div>
                        <div className="absolute left-1/2 top-16 h-[400px] w-[400px] -translate-x-1/2 rounded-full border border-white/40"></div>
                      </div>

                      {/* Envelope */}
                      <div className="absolute bottom-[-30px] left-1/2 flex -translate-x-1/2 justify-center">
                        <div className="relative h-[180px] w-[240px]">
                          {/* Letter */}
                          <div className="absolute left-1/2 top-0 h-[110px] w-[170px] -translate-x-1/2 rounded-md bg-gray-100 shadow-md">
                            <div className="mt-5 space-y-2 px-4">
                              <div className="h-2 rounded bg-gray-300"></div>
                              <div className="h-2 rounded bg-gray-200"></div>
                              <div className="h-2 w-3/4 rounded bg-gray-200"></div>
                            </div>
                          </div>

                          {/* Envelope Body */}
                          <div className="absolute bottom-0 h-[140px] w-full rounded-b-2xl bg-white shadow-xl"></div>

                          {/* Left Fold */}
                          <div className="absolute bottom-0 left-0 h-0 w-0 border-b-[70px] border-l-[120px] border-b-gray-100 border-l-transparent"></div>

                          {/* Right Fold */}
                          <div className="absolute bottom-0 right-0 h-0 w-0 border-b-[70px] border-r-[120px] border-b-gray-100 border-r-transparent"></div>

                          {/* Top Fold */}
                          <div className="absolute top-[40px] h-0 w-0 border-l-[120px] border-r-[120px] border-t-[80px] border-l-transparent border-r-transparent border-t-white"></div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-8 pb-10 pt-20 text-center">
                      <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                        {settings.newsletterTitle ||
                          "Sign Up For Our Newsletter"}
                      </h2>

                      <p className="mt-5 text-lg leading-relaxed text-gray-500">
                        {settings.newsletterText ||
                          "Receive new updates delivered to your inbox"}
                      </p>

                      {/* Input */}
                      <div className="mt-8">
                        <input
                          type="email"
                          placeholder="Your Email"
                          className="h-14 w-full rounded-2xl border border-gray-200 px-5 text-base outline-none transition focus:border-teal-400"
                        />
                      </div>

                      {/* Button */}
                      <button className="mt-5 h-14 w-full rounded-2xl bg-teal-500 text-lg font-medium text-white shadow-lg transition hover:bg-teal-600">
                        Sign up
                      </button>

                      {/* Footer Text */}
                      <p className="mt-6 text-sm text-gray-400">
                        Don’t worry, we won’t send you spam or sell your data.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-[60%] lg:mt-0 mt-4 ">
                  {/* newsletter title  */}
                  <label
                    htmlFor="newsletterTitle"
                    className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2"
                  >
                    Newsletter Title
                  </label>
                  <input
                    id="newsletterTitle"
                    value={settings.newsletterTitle}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        newsletterTitle: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm "
                  />
                  {/* newsletter text  */}
                  <label
                    htmlFor="newsletterText"
                    className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 my-2"
                  >
                    Newsletter Text
                  </label>
                  <textarea
                    id="newsletterText"
                    rows={3}
                    value={settings.newsletterText}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        newsletterText: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm resize-none"
                  ></textarea>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "navbar" && (
          <div className="p-8">
            <div className="flex items-center gap-2 text-gray-700 mb-2 pb-2 border-b border-gray-100">
              <FiNavigation className="w-5 h-5" />
              <h2 className="text-base font-semibold">Navbar Templates</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Select the perfect navigation structure for your storefront.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  id: "minimal",
                  name: "Minimal Navbar",
                  desc: "A clean, standard navigation bar.",
                  wireframe: (
                    <div className="w-full h-full bg-gray-50 flex items-start pt-4 px-4">
                      <div className="w-full bg-white shadow-sm border border-gray-100 rounded flex justify-between items-center p-2">
                        <div className="w-16 h-2.5 bg-gray-300 rounded-sm"></div>
                        <div className="flex gap-2">
                          <div className="w-6 h-1.5 bg-gray-200 rounded-sm"></div>
                          <div className="w-6 h-1.5 bg-gray-200 rounded-sm"></div>
                          <div className="w-6 h-1.5 bg-gray-200 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "centered",
                  name: "Centered Navbar",
                  desc: "Logo centered with links below.",
                  wireframe: (
                    <div className="w-full h-full bg-gray-50 flex items-start pt-4 px-4">
                      <div className="w-full bg-white shadow-sm border border-gray-100 rounded flex flex-col items-center p-2 gap-2">
                        <div className="w-16 h-2.5 bg-gray-300 rounded-sm"></div>
                        <div className="flex gap-2">
                          <div className="w-6 h-1.5 bg-gray-200 rounded-sm"></div>
                          <div className="w-6 h-1.5 bg-gray-200 rounded-sm"></div>
                          <div className="w-6 h-1.5 bg-gray-200 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "floating",
                  name: "Floating Navbar",
                  desc: "A floating pill-shaped navigation.",
                  wireframe: (
                    <div className="w-full h-full bg-gray-50 flex items-start justify-center pt-6 px-4">
                      <div className="w-3/4 bg-white shadow-md border border-gray-100 rounded-full flex justify-between items-center p-2 px-4">
                        <div className="w-12 h-2 bg-gray-300 rounded-sm"></div>
                        <div className="flex gap-2">
                          <div className="w-4 h-1.5 bg-gray-200 rounded-sm"></div>
                          <div className="w-4 h-1.5 bg-gray-200 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "dark",
                  name: "Dark Navbar",
                  desc: "A sleek dark-themed navigation.",
                  wireframe: (
                    <div className="w-full h-full bg-gray-50 flex items-start pt-4 px-4">
                      <div className="w-full bg-gray-900 shadow-sm rounded flex justify-between items-center p-2">
                        <div className="w-16 h-2.5 bg-gray-400 rounded-sm"></div>
                        <div className="flex gap-2">
                          <div className="w-6 h-1.5 bg-gray-600 rounded-sm"></div>
                          <div className="w-6 h-1.5 bg-gray-600 rounded-sm"></div>
                          <div className="w-6 h-1.5 bg-gray-600 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "double",
                  name: "Double Navbar",
                  desc: "Two-tiered navigation bar.",
                  wireframe: (
                    <div className="w-full h-full bg-gray-50 flex items-start pt-4 px-4">
                      <div className="w-full bg-white shadow-sm border border-gray-100 rounded flex flex-col">
                        <div className="w-full bg-gray-900 h-3 flex justify-end items-center px-2 rounded-t">
                          <div className="w-12 h-1 bg-gray-500 rounded-sm"></div>
                        </div>
                        <div className="w-full flex justify-between items-center p-2">
                          <div className="w-16 h-2.5 bg-gray-300 rounded-sm"></div>
                          <div className="flex gap-2">
                            <div className="w-6 h-1.5 bg-gray-200 rounded-sm"></div>
                            <div className="w-6 h-1.5 bg-gray-200 rounded-sm"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                },
              ].map((layout) => (
                <div
                  key={layout.id}
                  onClick={() =>
                    setSettings({ ...settings, navbarLayout: layout.id })
                  }
                  className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all bg-white flex flex-col group ${settings.navbarLayout === layout.id ? "border-teal-500 shadow-md ring-1 ring-teal-500" : "border-gray-200 hover:border-gray-300 hover:shadow-sm"}`}
                >
                  <div className="w-full aspect-[4/3] bg-gray-50 relative border-b border-gray-100">
                    {layout.wireframe}

                    <div
                      className={`absolute inset-0 bg-white/40 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] ${settings.navbarLayout === layout.id ? "opacity-100" : ""}`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewModal({
                            type: "navbar",
                            layout: layout.id,
                          });
                        }}
                        className="px-4 py-1.5 rounded-full font-medium text-sm bg-white text-gray-800 border border-gray-200 shadow-sm hover:bg-gray-50 flex items-center justify-center w-28"
                      >
                        Preview
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSettings({ ...settings, navbarLayout: layout.id });
                        }}
                        className={`px-4 py-1.5 rounded-full font-medium text-sm flex items-center justify-center w-28 shadow-sm ${settings.navbarLayout === layout.id ? "bg-teal-600 text-white" : "bg-gray-800 text-white hover:bg-gray-900"}`}
                      >
                        {settings.navbarLayout === layout.id ? (
                          <>
                            <FiCheckCircle className="w-4 h-4 mr-1.5" />{" "}
                            Selected
                          </>
                        ) : (
                          "Select"
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {layout.name}
                    </h3>
                    <p className="text-sm text-gray-500">{layout.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "footer" && (
          <div className="p-8">
            <div className="flex items-center gap-2 text-gray-700 mb-2 pb-2 border-b border-gray-100">
              <FiLayout className="w-5 h-5" />
              <h2 className="text-base font-semibold">Footer Templates</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Select the perfect footer structure for your storefront.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  id: "multicolumn",
                  name: "Multi Column Footer",
                  desc: "Classic multi-column layout with brand info.",
                  wireframe: (
                    <div className="w-full h-full bg-gray-50 flex items-end pb-4 px-4">
                      <div className="w-full bg-white shadow-sm border border-gray-100 rounded flex flex-col p-3 gap-3">
                        <div className="flex justify-between gap-4">
                          <div className="w-1/3 h-10 bg-gray-200 rounded-sm"></div>
                          <div className="flex gap-2 flex-1 justify-end">
                            <div className="w-1/4 h-12 bg-gray-100 border border-gray-200 rounded-sm"></div>
                            <div className="w-1/4 h-12 bg-gray-100 border border-gray-200 rounded-sm"></div>
                            <div className="w-1/4 h-12 bg-gray-100 border border-gray-200 rounded-sm"></div>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-teal-500 rounded-sm opacity-50"></div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "minimalcontact",
                  name: "Minimal Contact Footer",
                  desc: "Clean layout focusing on contact info & CTA.",
                  wireframe: (
                    <div className="w-full h-full bg-gray-50 flex items-end pb-4 px-4">
                      <div className="w-full bg-white shadow-sm border border-gray-100 rounded flex flex-col p-3 gap-4">
                        <div className="flex justify-between items-center">
                          <div className="w-1/3 h-6 bg-gray-200 rounded-sm"></div>
                          <div className="w-1/4 h-6 bg-gray-800 rounded-full"></div>
                        </div>
                        <div className="w-full h-px bg-gray-100"></div>
                        <div className="flex gap-1">
                          <div className="w-8 h-4 bg-gray-100 border border-gray-200 rounded-sm"></div>
                          <div className="w-8 h-4 bg-gray-100 border border-gray-200 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "centered",
                  name: "Centered Footer",
                  desc: "Everything centered beautifully.",
                  wireframe: (
                    <div className="w-full h-full bg-gray-50 flex items-end pb-4 px-4">
                      <div className="w-full bg-white shadow-sm border border-gray-100 rounded flex flex-col items-center p-3 gap-2">
                        <div className="w-1/4 h-3 bg-gray-300 rounded-sm"></div>
                        <div className="w-1/2 h-6 bg-gray-100 border border-gray-200 rounded-full mt-1"></div>
                        <div className="flex gap-2 mt-2">
                          <div className="w-6 h-1 bg-gray-200 rounded-sm"></div>
                          <div className="w-6 h-1 bg-gray-200 rounded-sm"></div>
                          <div className="w-6 h-1 bg-gray-200 rounded-sm"></div>
                        </div>
                        <div className="w-full h-1 bg-teal-500 rounded-sm opacity-50 mt-1"></div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "newsletter",
                  name: "Newsletter Footer",
                  desc: "Prominent newsletter sign up on top.",
                  wireframe: (
                    <div className="w-full h-full bg-gray-50 flex items-end pb-4 px-4">
                      <div className="w-full bg-white shadow-sm border border-gray-100 rounded flex flex-col p-3 gap-3">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <div className="w-1/3 h-4 bg-gray-300 rounded-sm"></div>
                          <div className="w-1/3 h-6 bg-gray-100 border border-gray-200 rounded-full"></div>
                        </div>
                        <div className="flex justify-between gap-4 pt-1">
                          <div className="w-1/3 h-8 bg-gray-200 rounded-sm"></div>
                          <div className="flex gap-2 flex-1 justify-end">
                            <div className="w-1/4 h-8 bg-gray-100 border border-gray-200 rounded-sm"></div>
                            <div className="w-1/4 h-8 bg-gray-100 border border-gray-200 rounded-sm"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                },
              ].map((layout) => (
                <div
                  key={layout.id}
                  onClick={() =>
                    setSettings({ ...settings, footerLayout: layout.id })
                  }
                  className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all bg-white flex flex-col group ${settings.footerLayout === layout.id ? "border-teal-500 shadow-md ring-1 ring-teal-500" : "border-gray-200 hover:border-gray-300 hover:shadow-sm"}`}
                >
                  <div className="w-full aspect-[4/3] bg-gray-50 relative border-b border-gray-100">
                    {layout.wireframe}

                    <div
                      className={`absolute inset-0 bg-white/40 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] ${settings.footerLayout === layout.id ? "opacity-100" : ""}`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewModal({
                            type: "footer",
                            layout: layout.id,
                          });
                        }}
                        className="px-4 py-1.5 rounded-full font-medium text-sm bg-white text-gray-800 border border-gray-200 shadow-sm hover:bg-gray-50 flex items-center justify-center w-28"
                      >
                        Preview
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSettings({ ...settings, footerLayout: layout.id });
                        }}
                        className={`px-4 py-1.5 rounded-full font-medium text-sm flex items-center justify-center w-28 shadow-sm ${settings.footerLayout === layout.id ? "bg-teal-600 text-white" : "bg-gray-800 text-white hover:bg-gray-900"}`}
                      >
                        {settings.footerLayout === layout.id ? (
                          <>
                            <FiCheckCircle className="w-4 h-4 mr-1.5" />{" "}
                            Selected
                          </>
                        ) : (
                          "Select"
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {layout.name}
                    </h3>
                    <p className="text-sm text-gray-500">{layout.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Tabs content placeholders */}
        {activeTab === "theme" && (
          <div className="p-8">
            <div className="flex items-center gap-2 text-gray-700 mb-6 pb-2 border-b border-gray-100">
              <FiImage className="w-5 h-5" />
              <h2 className="text-base font-semibold">Theme & Colors</h2>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Select a primary color combination for your website's buttons,
              accents, and backgrounds.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {[
                {
                  id: "teal-white",
                  name: "Teal & White",
                  primary: "bg-teal-600",
                  bg: "bg-white",
                  border: "border-gray-200",
                },
                {
                  id: "black-white",
                  name: "Black & White",
                  primary: "bg-black",
                  bg: "bg-white",
                  border: "border-gray-200",
                },
                {
                  id: "yellow-white",
                  name: "Yellow & White",
                  primary: "bg-yellow-400",
                  bg: "bg-white",
                  border: "border-gray-200",
                },
                {
                  id: "indigo-slate",
                  name: "Indigo & Slate",
                  primary: "bg-indigo-600",
                  bg: "bg-slate-50",
                  border: "border-slate-200",
                },
                {
                  id: "rose-stone",
                  name: "Rose & Stone",
                  primary: "bg-rose-600",
                  bg: "bg-stone-50",
                  border: "border-stone-200",
                },
                {
                  id: "emerald-gray",
                  name: "Emerald & Gray",
                  primary: "bg-emerald-600",
                  bg: "bg-gray-50",
                  border: "border-gray-200",
                },
              ].map((theme) => (
                <div
                  key={theme.id}
                  onClick={() => {
                    setSelectedTheme(theme.id);
                    setSettings({ ...settings, theme: theme.id });
                  }}
                  className={`cursor-pointer rounded-xl border-2 transition-all p-3 flex flex-col items-center gap-3 relative ${selectedTheme === theme.id ? "border-teal-500 shadow-md scale-105" : "border-gray-100 hover:border-gray-300 hover:shadow-sm"}`}
                >
                  {/* Color Preview Box */}
                  <div
                    className={`w-full aspect-video rounded-lg border ${theme.border} ${theme.bg} overflow-hidden flex flex-col`}
                  >
                    <div className="h-1/3 bg-gray-100 border-b border-gray-200 flex flex-row items-center px-2 gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <div className="w-6 h-1 rounded-full bg-gray-300"></div>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-2">
                      <div
                        className={`w-full h-4 rounded ${theme.primary}`}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {theme.name}
                  </span>
                  {selectedTheme === theme.id && (
                    <div className="absolute -top-2 -right-2 bg-teal-500 text-white rounded-full p-1 shadow-sm">
                      <FiCheckCircle className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "faq" && (
          <div className="p-8">
            <div className="flex items-center gap-2 text-gray-700 mb-6 pb-2 border-b border-gray-100">
              <BiSearch className="w-5 h-5" />
              <h2 className="text-base font-semibold">
                Frequenty Asked Questions
              </h2>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Manage your FAQ items by adding, editing, or removing questions
              and answers that appear on your website.
            </p>

            {faqs.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Existing FAQs
                </h3>
                <div className="space-y-4 mb-6">
                  {faqs &&
                    faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/70 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-[2px]"
                      >
                        {/* Top Accent Line */}
                        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-teal-500 via-teal-500 to-teal-500"></div>

                        <div className="p-5 md:p-6">
                          <div className="flex items-start justify-between gap-4">
                            {/* Left Content */}
                            <div className="flex-1">
                              {/* Question */}
                              <div className="flex items-center gap-3 mb-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 font-semibold text-sm border border-teal-100">
                                  {index + 1}
                                </div>

                                <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-snug">
                                  {faq.question}
                                </h3>
                              </div>

                              {/* Answer */}
                              <div className="pl-12">
                                <p className="text-sm md:text-[15px] leading-7 text-gray-600">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2  transition-all duration-300 ">
                              <button
                                // onClick={() => updateFaq(faq?._id)}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all duration-200 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600 cursor-pointer"
                              >
                                <FiEdit className="h-4 w-4" />
                              </button>

                              <button
                                onClick={() => deleteFaq(faq?._id)}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-500 transition-all duration-200 hover:bg-red-100 hover:text-red-600 cursor-pointer"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className=" space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Question
                  </label>
                  <input
                    type="text"
                    className="mt-1 block border w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 focus:ring-1  focus:outline-none"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Answer
                  </label>
                  <textarea
                    cols={3}
                    className="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 focus:ring-1  focus:outline-none"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="px-4 py-2 cursor-pointer bg-teal-500 text-white rounded-md hover:bg-teal-600"
                onClick={saveFaq}
              >
                Add FAQ
              </button>
            </div>
          </div>
        )}

        {activeTab !== "general" &&
          activeTab !== "navbar" &&
          activeTab !== "footer" &&
          activeTab !== "theme" &&
          activeTab !== "newsletter" &&
          activeTab !== "faq" && (
            <div className="p-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-lg font-medium">
                  {tabs.find((t) => t.id === activeTab)?.label} Settings
                </p>
                <p className="text-sm mt-2">
                  Content for this section is coming soon.
                </p>
              </div>
            </div>
          )}
      </div>

      {previewModal.type && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-10 theme-${settings.theme}`}
          onClick={() => setPreviewModal({ type: null, layout: "" })}
        >
          <div
            className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-800 capitalize">
                {previewModal.type} Preview: {previewModal.layout}
              </h3>
              <button
                onClick={() => setPreviewModal({ type: null, layout: "" })}
                className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"
              >
                <FiXCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 bg-gray-200 p-4 md:p-8 flex items-start justify-center">
              <div className="w-full border border-gray-200 shadow-lg bg-white min-h-[500px] flex flex-col relative rounded overflow-hidden">
                {previewModal.type === "navbar" && (
                  <div className="w-full flex-1 flex flex-col">
                    <div className="w-full relative z-10">
                      {previewModal.layout === "minimal" && (
                        <MinimalNavbar
                          brandName={
                            settings.brandName || domain || "BrandName"
                          }
                        />
                      )}
                      {previewModal.layout === "centered" && (
                        <CenteredNavbar
                          brandName={
                            settings.brandName || domain || "BrandName"
                          }
                        />
                      )}
                      {previewModal.layout === "floating" && (
                        <FloatingNavbar
                          brandName={
                            settings.brandName || domain || "BrandName"
                          }
                        />
                      )}
                      {previewModal.layout === "dark" && (
                        <DarkNavbar
                          brandName={
                            settings.brandName || domain || "BrandName"
                          }
                        />
                      )}
                      {previewModal.layout === "double" && (
                        <DoubleNavbar
                          brandName={
                            settings.brandName || domain || "BrandName"
                          }
                        />
                      )}
                    </div>
                    <div className="w-full flex-1 bg-gray-50 flex items-center justify-center text-gray-400 border-t border-gray-100">
                      <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-300 mb-2">
                          Hero Section
                        </h2>
                        <p>Scroll down to see navbar behavior</p>
                      </div>
                    </div>
                  </div>
                )}

                {previewModal.type === "footer" && (
                  <div className="w-full flex-1 flex flex-col">
                    <div className="w-full flex-1 bg-gray-50 flex items-center justify-center text-gray-400 border-b border-gray-100 min-h-[300px]">
                      <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-300 mb-2">
                          Page Content
                        </h2>
                        <p>Footer is displayed below</p>
                      </div>
                    </div>
                    <div className="w-full relative z-10">
                      {previewModal.layout === "multicolumn" && (
                        <MultiColumnFooter
                          brandName={
                            settings.brandName || domain || "BrandName"
                          }
                        />
                      )}
                      {previewModal.layout === "minimalcontact" && (
                        <MinimalContactFooter
                          brandName={
                            settings.brandName || domain || "BrandName"
                          }
                        />
                      )}
                      {previewModal.layout === "centered" && (
                        <CenteredFooter
                          brandName={
                            settings.brandName || domain || "BrandName"
                          }
                        />
                      )}
                      {previewModal.layout === "newsletter" && (
                        <NewsletterFooter
                          brandName={
                            settings.brandName || domain || "BrandName"
                          }
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
