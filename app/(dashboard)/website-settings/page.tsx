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
import { useRouter } from "next/navigation"
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
  FiXCircle
} from "react-icons/fi";

type TabId = "general" | "newsletter" | "navbar" | "footer" | "seller"  | "theme";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: "general", label: "General", icon: <FiGlobe className="w-4 h-4 mr-2" /> },
  { id: "newsletter", label: "Newsletter", icon: <FiMail className="w-4 h-4 mr-2" /> },
  { id: "navbar", label: "Navbar", icon: <FiNavigation className="w-4 h-4 mr-2" /> },
  { id: "footer", label: "Footer", icon: <FiLayout className="w-4 h-4 mr-2" /> },
  { id: "seller", label: "Seller", icon: <FiShoppingCart className="w-4 h-4 mr-2" /> },
  { id: "theme", label: "Theme", icon: <FiImage className="w-4 h-4 mr-2" /> },
];

export default function WebsiteSettingsPage() {

  const {user,setSellerDomain} = useAuthStore()
  
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [isDomainAvailable, setIsDomainAvailable] = useState<boolean>(false);
  const [domain, setDomain] = useState("");
  const [tenantId, setTenantId] = useState<string>("");
  const [readyToDeploy, setReadyToDeploy] = useState(false)
  const [isWebsiteLive, setIsWebsiteLive] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("teal-white");
  const [previewModal, setPreviewModal] = useState<{ type: "navbar" | "footer" | null, layout: string }>({ type: null, layout: "" });
  const router = useRouter();

  const [settings, setSettings] = useState({
    brandName: "",
    websiteTitle: "",
    siteFavicon: "",
    footerLogo: "",
    siteLogoLight: "",
    siteLogoDark: "",
    bannerType: "videobackground",
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
      youtube: ""
    },
    enableCookieConsent: true,
    cookiePosition: "bottom",
    cookieText: "We use cookies to improve your experience, analyze site traffic, and support personalized advertising. By continuing to browse, you consent to the use of essential, analytics, and marketing cookies in accordance with our Privacy Policy.",
    theme: "teal-white",
    navbarLayout: "minimal",
    footerLayout: "multicolumn"
  });

  const checkDomain = async(slug:string) => {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.GET_DOMAIN, {
        params: {
          domain:slug
        }
      });
      setIsDomainAvailable(response.data.success);
    } catch (error:any) {
      setIsDomainAvailable(false);
    }
  }

  const deployWebsite = async () => {
    try {
      const response = await axiosClient.post(API_ENDPOINTS.DEPLOY_WEBSITE, {
        slug:domain,
        userId:user?.userId,
      });
      toast.success("your website has been deployed successfully.")
      setReadyToDeploy(false)
      checkDomain(domain);
      isTenantLive()
    } catch (error:any) {
      toast.error(error.response?.data?.message || "Failed to deploy website");
    }
  }

  const getWebSettings = async (tId: string) => {
      try {
        const response = await axiosClient.get(API_ENDPOINTS.GET_WEBSETTINGS, {
          params: {
            tenantId: tId,
          }
        })
        if (response?.data?.data) {
          setSettings(prev => ({
            ...prev,
            ...response.data.data,
            socialLinks: {
              ...prev.socialLinks,
              ...(response.data.data.socialLinks || {})
            }
          }));
          if (response.data.data.theme) {
            setSelectedTheme(response.data.data.theme);
          }
        }
      } catch (error) {
        console.log(error);
      }
  }

  const isTenantLive = async () => {
    if(!user?.userId){
      router.push('/login')
      return 
    }
    try {
       const res = await axiosClient.get(API_ENDPOINTS.GET_TENANT_DETAIL, {
         params: {
           sellerId:user?.userId,
         }
       })
      if(res?.data?.success){
        setIsWebsiteLive(res.data.data?.isWebsiteLive)
        setDomain(res?.data.data?.slug)
        const tId = res?.data?.data?._id;
        setTenantId(tId);
        if (res?.data?.data?.isWebsiteLive) {
         setSellerDomain(res?.data.data?.slug) 
        }
        if (tId) {
          getWebSettings(tId);
        }
      }
    } catch (error:any) {
      console.log(error.response?.data);
    }
  }

  const saveWebSettings = async () => {
    if (!tenantId) {
      toast.error("Please deploy a website domain first.");
      return;
    }
    const updatePromise = axiosClient.post(API_ENDPOINTS.UPDATE_WEBSETTINGS, {
      tenantId: tenantId,
      sellerId: user?.userId,
      ...settings,
      theme: selectedTheme
    });

    toast.promise(updatePromise, {
      loading: 'Saving changes...',
      success: 'Settings updated successfully!',
      error: 'Failed to update settings.'
    });

    try {
      await updatePromise;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
   isTenantLive()
  },[user?.userId])

  const handleSocialChange = (platform: keyof typeof settings.socialLinks, value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }))
  }

  return (
    <div className="w-full pb-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-sm">
            <FiSettings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Website Settings</h1>
            <p className="text-sm text-gray-500">
              Configure your website's global settings and preferences
            </p>
          </div>
        </div>
        <button className="mt-4 md:mt-0 px-5 py-2.5 bg-teal-600 text-white rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-sm font-medium text-sm cursor-pointer" onClick={saveWebSettings}>
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
              <div className="flex items-center gap-2 text-gray-700 mb-6 pb-2 border-b border-gray-100">
                <FiGlobe className="w-5 h-5" />
                <h2 className="text-base font-semibold">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Brand Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={settings.brandName}
                    onChange={(e) => setSettings({...settings, brandName: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-sm"
                  />
                </div>

                {
                  !isWebsiteLive && (
                      <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    Website Domain <span className="text-red-500">*</span>
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-400 text-gray-400 flex items-center justify-center text-[9px] font-bold">i</span>
                  </label>
                  <div className="flex items-center justify-start">
                    <input 
                      type="text" 
                      placeholder="Enter Domain"
                      value={domain}
                      className="w-full px-4 py-2.5 rounded-lg border-l border-gray-200 bg-gray-50 text-gray-500 focus:outline-none text-sm pr-10"
                      onChange={(e) => {
                        setDomain(e.target.value);
                        checkDomain(e.target.value)
                      }}
                    />
                    <span className=" px-4 py-2.5 rounded-lg border-r border-gray-200 bg-gray-50 text-gray-500 focus:outline-none text-sm pr-10 bg-teal-50 font-bold">.amancodes.in</span>
                    <FiCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  </div>
                  <div className="flex flex-col justify-between gap-2 items-start mt-2">
                    <div className="w-auto">
                      {
                        domain?.length === 0 && <p className="text-xs text-gray-500 font-medium flex items-center justify-center">Enter Domain Name</p>
                      }
                    {
                      domain?.length > 0 && (
                        isDomainAvailable ? (
                          <p className="text-xs text-teal-500 font-medium flex items-center justify-center">  <FiCheckCircle className="w-3 h-3 mr-1" />Domain is available -- ( { domain+ ".amancodes.in"} )</p>
                        ) : (
                          <p className="text-xs text-red-500 font-medium flex items-center justify-center"> <FiXCircle className="w-3 h-3 mr-1" />Domain is not available -- ( { domain+ ".amancodes.in"} )</p>
                        )
                      )
                      }
                    </div>

                    {
                      isDomainAvailable && domain?.length > 0 && (
                         <button className="px-3 py-3 border border-gray-200 text-gray-700 rounded-md text-xs font-semibold hover:bg-teal-100 flex items-center gap-1.5 cursor-pointer bg-teal-50 text-teal-500 " onClick={()=> setReadyToDeploy(true)}>
                      <FiPlusCircle className="w-3 h-3 font-bold" />
                      Deploy Website
                    </button>
                      )
                    }
                   
                  </div>
                </div>
                  )
               }
                {
                  readyToDeploy && (
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
                  )
                }

                {
                  isWebsiteLive && (
                     <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    Website Domain <span className="text-red-500">*</span>
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-400 text-gray-400 flex items-center justify-center text-[9px] font-bold">i</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={"https://"+domain+".amancodes.in"}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 focus:outline-none text-sm pr-10"
                    />
                    <FiCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  </div>
                  <div className="flex justify-between items-start mt-2">
                    <p className="text-xs text-gray-400">Your website domain is set and cannot be changed</p>
                    <button className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-50 flex items-center gap-1.5">
                      <FiRefreshCcw className="w-3 h-3" />
                      Request Change
                    </button>
                  </div>
                </div> 
                  )
                }

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Website Title
                  </label>
                  <input 
                    type="text" 
                    value={settings.websiteTitle}
                    onChange={(e) => setSettings({...settings, websiteTitle: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-sm"
                  />
                </div>

              </div>
            </div>

            {/* Media & Branding */}
            <div>
              <div className="flex items-center gap-2 text-gray-700 mb-6 pb-2 border-b border-gray-100">
                <FiImage className="w-5 h-5" />
                <h2 className="text-base font-semibold">Media & Branding</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Favicon</label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                      <img src={settings.siteFavicon || "https://agentsweb.s3.us-east-2.amazonaws.com/public/MzA5/websitesettings/general/1774935048605_Logo.png"} alt="Favicon" className="w-full h-full object-contain p-1.5" />
                    </div>
                    <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium transition-colors">
                      <FiUpload className="w-4 h-4" /> Upload
                    </button>
                  </div>
                </div>

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
                </div>

                <div>
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
                </div>

                <div className="col-span-1 md:col-span-2 border-t border-gray-100 pt-6 mt-2 flex flex-col gap-6">
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
                </div>
              </div>
            </div>

            {/* Legal & Compliance */}
            <div>
              <div className="flex items-center gap-2 text-gray-700 mb-6 pb-2 border-b border-gray-100">
                <FiShield className="w-5 h-5" />
                <h2 className="text-base font-semibold">Legal & Cookie Compliance</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-6 md:items-end">
                  <div className="flex-1 md:max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Cookie Position</label>
                    <select 
                      value={settings.cookiePosition}
                      onChange={(e) => setSettings({...settings, cookiePosition: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm bg-white"
                    >
                      <option value="bottom">Bottom Bar</option>
                      <option value="top">Top Bar</option>
                      <option value="center">Center Modal</option>
                    </select>
                  </div>

                  <div className="flex items-center mb-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.enableCookieConsent}
                        onChange={(e) => setSettings({...settings, enableCookieConsent: e.target.checked})}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-700">Enable Cookie Consent Banner</span>
                    </label>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cookie Text</label>
                  <textarea 
                    rows={3} 
                    value={settings.cookieText}
                    onChange={(e) => setSettings({...settings, cookieText: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm resize-none"
                  ></textarea>
                </div>

               
              </div>
            </div>
          </div>
        )}
        
        {
          activeTab === "navbar" && (
            <div className="p-8">
              <div className="flex items-center gap-2 text-gray-700 mb-2 pb-2 border-b border-gray-100">
                <FiNavigation className="w-5 h-5" />
                <h2 className="text-base font-semibold">Navbar Templates</h2>
              </div>
              <p className="text-sm text-gray-500 mb-6">Select the perfect navigation structure for your storefront.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { 
                    id: "minimal", name: "Minimal Navbar", desc: "A clean, standard navigation bar.",
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
                    )
                  },
                  { 
                    id: "centered", name: "Centered Navbar", desc: "Logo centered with links below.",
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
                    )
                  },
                  { 
                    id: "floating", name: "Floating Navbar", desc: "A floating pill-shaped navigation.",
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
                    )
                  },
                  { 
                    id: "dark", name: "Dark Navbar", desc: "A sleek dark-themed navigation.",
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
                    )
                  },
                  { 
                    id: "double", name: "Double Navbar", desc: "Two-tiered navigation bar.",
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
                    )
                  }
                ].map((layout) => (
                  <div 
                    key={layout.id}
                    onClick={() => setSettings({...settings, navbarLayout: layout.id})}
                    className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all bg-white flex flex-col group ${settings.navbarLayout === layout.id ? 'border-teal-500 shadow-md ring-1 ring-teal-500' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}
                  >
                    <div className="w-full aspect-[4/3] bg-gray-50 relative border-b border-gray-100">
                      {layout.wireframe}
                      
                      <div className={`absolute inset-0 bg-white/40 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] ${settings.navbarLayout === layout.id ? 'opacity-100' : ''}`}>
                         <button 
                           onClick={(e) => { e.stopPropagation(); setPreviewModal({ type: "navbar", layout: layout.id }) }}
                           className="px-4 py-1.5 rounded-full font-medium text-sm bg-white text-gray-800 border border-gray-200 shadow-sm hover:bg-gray-50 flex items-center justify-center w-28"
                         >
                           Preview
                         </button>
                         <button 
                           onClick={(e) => { e.stopPropagation(); setSettings({...settings, navbarLayout: layout.id}) }}
                           className={`px-4 py-1.5 rounded-full font-medium text-sm flex items-center justify-center w-28 shadow-sm ${settings.navbarLayout === layout.id ? 'bg-teal-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-900'}`}
                         >
                           {settings.navbarLayout === layout.id ? <><FiCheckCircle className="w-4 h-4 mr-1.5" /> Selected</> : 'Select'}
                         </button>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{layout.name}</h3>
                      <p className="text-sm text-gray-500">{layout.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        {
          activeTab === "footer" && (
            <div className="p-8">
              <div className="flex items-center gap-2 text-gray-700 mb-2 pb-2 border-b border-gray-100">
                <FiLayout className="w-5 h-5" />
                <h2 className="text-base font-semibold">Footer Templates</h2>
              </div>
              <p className="text-sm text-gray-500 mb-6">Select the perfect footer structure for your storefront.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { 
                    id: "multicolumn", name: "Multi Column Footer", desc: "Classic multi-column layout with brand info.",
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
                    )
                  },
                  { 
                    id: "minimalcontact", name: "Minimal Contact Footer", desc: "Clean layout focusing on contact info & CTA.",
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
                    )
                  },
                  { 
                    id: "centered", name: "Centered Footer", desc: "Everything centered beautifully.",
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
                    )
                  },
                  { 
                    id: "newsletter", name: "Newsletter Footer", desc: "Prominent newsletter sign up on top.",
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
                    )
                  }
                ].map((layout) => (
                  <div 
                    key={layout.id}
                    onClick={() => setSettings({...settings, footerLayout: layout.id})}
                    className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all bg-white flex flex-col group ${settings.footerLayout === layout.id ? 'border-teal-500 shadow-md ring-1 ring-teal-500' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}
                  >
                    <div className="w-full aspect-[4/3] bg-gray-50 relative border-b border-gray-100">
                      {layout.wireframe}
                      
                      <div className={`absolute inset-0 bg-white/40 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] ${settings.footerLayout === layout.id ? 'opacity-100' : ''}`}>
                         <button 
                           onClick={(e) => { e.stopPropagation(); setPreviewModal({ type: "footer", layout: layout.id }) }}
                           className="px-4 py-1.5 rounded-full font-medium text-sm bg-white text-gray-800 border border-gray-200 shadow-sm hover:bg-gray-50 flex items-center justify-center w-28"
                         >
                           Preview
                         </button>
                         <button 
                           onClick={(e) => { e.stopPropagation(); setSettings({...settings, footerLayout: layout.id}) }}
                           className={`px-4 py-1.5 rounded-full font-medium text-sm flex items-center justify-center w-28 shadow-sm ${settings.footerLayout === layout.id ? 'bg-teal-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-900'}`}
                         >
                           {settings.footerLayout === layout.id ? <><FiCheckCircle className="w-4 h-4 mr-1.5" /> Selected</> : 'Select'}
                         </button>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{layout.name}</h3>
                      <p className="text-sm text-gray-500">{layout.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        {/* Other Tabs content placeholders */}
        {activeTab === "theme" && (
          <div className="p-8">
            <div className="flex items-center gap-2 text-gray-700 mb-6 pb-2 border-b border-gray-100">
              <FiImage className="w-5 h-5" />
              <h2 className="text-base font-semibold">Theme & Colors</h2>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">Select a primary color combination for your website's buttons, accents, and backgrounds.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {[
                { id: "teal-white", name: "Teal & White", primary: "bg-teal-600", bg: "bg-white", border: "border-gray-200" },
                { id: "black-white", name: "Black & White", primary: "bg-black", bg: "bg-white", border: "border-gray-200" },
                { id: "yellow-white", name: "Yellow & White", primary: "bg-yellow-400", bg: "bg-white", border: "border-gray-200" },
                { id: "indigo-slate", name: "Indigo & Slate", primary: "bg-indigo-600", bg: "bg-slate-50", border: "border-slate-200" },
                { id: "rose-stone", name: "Rose & Stone", primary: "bg-rose-600", bg: "bg-stone-50", border: "border-stone-200" },
                { id: "emerald-gray", name: "Emerald & Gray", primary: "bg-emerald-600", bg: "bg-gray-50", border: "border-gray-200" },
              ].map((theme) => (
                <div 
                  key={theme.id}
                  onClick={() => {
                    setSelectedTheme(theme.id);
                    setSettings({...settings, theme: theme.id});
                  }}
                  className={`cursor-pointer rounded-xl border-2 transition-all p-3 flex flex-col items-center gap-3 relative ${selectedTheme === theme.id ? 'border-teal-500 shadow-md scale-105' : 'border-gray-100 hover:border-gray-300 hover:shadow-sm'}`}
                >
                  {/* Color Preview Box */}
                  <div className={`w-full aspect-video rounded-lg border ${theme.border} ${theme.bg} overflow-hidden flex flex-col`}>
                    <div className="h-1/3 bg-gray-100 border-b border-gray-200 flex flex-row items-center px-2 gap-1">
                       <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                       <div className="w-6 h-1 rounded-full bg-gray-300"></div>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-2">
                       <div className={`w-full h-4 rounded ${theme.primary}`}></div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{theme.name}</span>
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

        {activeTab !== "general" && activeTab !== "navbar" && activeTab !== "footer" && activeTab !== "theme" && (
          <div className="p-8 min-h-[400px] flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium">{tabs.find(t => t.id === activeTab)?.label} Settings</p>
              <p className="text-sm mt-2">Content for this section is coming soon.</p>
            </div>
          </div>
        )}
      </div>

      {previewModal.type && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-10 theme-${settings.theme}`} onClick={() => setPreviewModal({ type: null, layout: "" })}>
          <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-800 capitalize">{previewModal.type} Preview: {previewModal.layout}</h3>
              <button onClick={() => setPreviewModal({ type: null, layout: "" })} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors">
                <FiXCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 bg-gray-200 p-4 md:p-8 flex items-start justify-center">
               <div className="w-full border border-gray-200 shadow-lg bg-white min-h-[500px] flex flex-col relative rounded overflow-hidden">
                  {previewModal.type === "navbar" && (
                    <div className="w-full flex-1 flex flex-col">
                      <div className="w-full relative z-10">
                        {previewModal.layout === "minimal" && <MinimalNavbar brandName={settings.brandName || domain || "BrandName"} />}
                        {previewModal.layout === "centered" && <CenteredNavbar brandName={settings.brandName || domain || "BrandName"} />}
                        {previewModal.layout === "floating" && <FloatingNavbar brandName={settings.brandName || domain || "BrandName"} />}
                        {previewModal.layout === "dark" && <DarkNavbar brandName={settings.brandName || domain || "BrandName"} />}
                        {previewModal.layout === "double" && <DoubleNavbar brandName={settings.brandName || domain || "BrandName"} />}
                      </div>
                      <div className="w-full flex-1 bg-gray-50 flex items-center justify-center text-gray-400 border-t border-gray-100">
                        <div className="text-center">
                           <h2 className="text-3xl font-bold text-gray-300 mb-2">Hero Section</h2>
                           <p>Scroll down to see navbar behavior</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {previewModal.type === "footer" && (
                    <div className="w-full flex-1 flex flex-col">
                       <div className="w-full flex-1 bg-gray-50 flex items-center justify-center text-gray-400 border-b border-gray-100 min-h-[300px]">
                          <div className="text-center">
                             <h2 className="text-3xl font-bold text-gray-300 mb-2">Page Content</h2>
                             <p>Footer is displayed below</p>
                          </div>
                      </div>
                      <div className="w-full relative z-10">
                        {previewModal.layout === "multicolumn" && <MultiColumnFooter brandName={settings.brandName || domain || "BrandName"} />}
                        {previewModal.layout === "minimalcontact" && <MinimalContactFooter brandName={settings.brandName || domain || "BrandName"} />}
                        {previewModal.layout === "centered" && <CenteredFooter brandName={settings.brandName || domain || "BrandName"} />}
                        {previewModal.layout === "newsletter" && <NewsletterFooter brandName={settings.brandName || domain || "BrandName"} />}
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
