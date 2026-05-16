"use client";

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
  const [readyToDeploy, setReadyToDeploy] = useState(false)
  const [isWebsiteLive, setIsWebsiteLive] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("teal-white");
  const router = useRouter();
  
  const checkDomain = async(slug:string) => {

    try {
      const response = await axiosClient.get(API_ENDPOINTS.GET_DOMAIN, {
        params: {
          domain:slug
        }
      });
      console.log(response?.data)
      console.log("pehle",response?.data?.success)

      setIsDomainAvailable(response.data.success);

    } catch (error:any) {
      console.log(error.response?.data);
      setIsDomainAvailable(false);
    }
  }

  const deployWebsite = async () => {
   

    try {
      const response = await axiosClient.post(API_ENDPOINTS.DEPLOY_WEBSITE, {
        slug:domain,
        userId:user?.userId,
      });
      console.log(response?.data)
      toast.success("your website has been deployed successfully.")
      setReadyToDeploy(false)
      checkDomain(domain);
      isTenantLive()
    } catch (error:any) {
      console.log(error.response.data);
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
      console.log(res?.data?.data);
      if(res?.data?.success){
        setIsWebsiteLive(res.data.data?.isWebsiteLive)
        setDomain(res?.data.data?.slug)
        if (res?.data?.data?.isWebsiteLive) {
         setSellerDomain(res?.data.data?.slug) 
        }
      }
    } catch (error:any) {
      console.log(error.response.data);
      
    }
   
  }


  // on load always check is the the tenat already exists with the domain ?
  useEffect(() => {
   isTenantLive()
  },[user?.userId])

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
        <button className="mt-4 md:mt-0 px-5 py-2.5 bg-teal-600 text-white rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-sm font-medium text-sm">
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
                    defaultValue="Elevation Estates"
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
                      defaultValue={"https://"+domain+".amancodes.in"}
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
                    defaultValue="Experience Exceptional Living"
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
                    <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                      <img src="https://agentsweb.s3.us-east-2.amazonaws.com/public/MzA5/websitesettings/general/1774935048605_Logo.png" alt="Favicon" className="w-full h-full object-contain p-1" />
                    </div>
                    <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium">
                      <FiUpload className="w-4 h-4" /> Upload
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Footer Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-32 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-400">
                      No Logo
                    </div>
                    <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium">
                      <FiUpload className="w-4 h-4" /> Upload
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Logo Light</label>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-32 bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                      <img src="https://agentsweb.s3.us-east-2.amazonaws.com/public/MzA5/websitesettings/general/1774935048591_Logo.png" alt="Logo Light" className="w-full h-full object-contain p-2" />
                    </div>
                    <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium">
                      <FiUpload className="w-4 h-4" /> Upload
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Logo Dark</label>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-32 bg-gray-800 rounded border border-gray-700 flex items-center justify-center overflow-hidden">
                      <img src="https://agentsweb.s3.us-east-2.amazonaws.com/public/MzA5/websitesettings/general/1774935048599_Logo.png" alt="Logo Dark" className="w-full h-full object-contain p-2" />
                    </div>
                    <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium">
                      <FiUpload className="w-4 h-4" /> Upload
                    </button>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 border-t border-gray-100 pt-6 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Banner Type</label>
                      <select defaultValue="videobackground" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm bg-white">
                        <option value="image">Image</option>
                        <option value="videobackground">Video Background</option>
                        <option value="slider">Slider</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Video Background Link</label>
                      <input type="text" placeholder="Optional video URL" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Banner Image</label>
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-32 bg-gray-100 rounded border border-gray-200 overflow-hidden">
                          <img src="https://agentsweb.s3.us-east-2.amazonaws.com/public/MzA5/websitesettings/general/1774935048610_Banner_Image_2.jpg" alt="Banner" className="w-full h-full object-cover" />
                        </div>
                        <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 font-medium text-gray-700 flex items-center gap-2">
                          <FiUpload className="w-4 h-4" /> Upload Image
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Video Background</label>
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-32 bg-gray-100 rounded border border-gray-200 overflow-hidden flex items-center justify-center text-xs text-gray-500 font-medium">
                          .mp4 Video
                        </div>
                        <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 font-medium text-gray-700 flex items-center gap-2">
                          <FiUpload className="w-4 h-4" /> Upload Video
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Navbar Background Image</label>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-full bg-gray-100 rounded border border-gray-200 overflow-hidden">
                          <img src="https://agentsweb.s3.us-east-2.amazonaws.com/public/MzA5/websitesettings/general/1775114654015_dbb60ab5e13978cd4606f47240b7a53900c226e2da5fd66bcf5afe9b9f9dab1667916bab6b17e.jpg" alt="Navbar" className="w-full h-full object-cover" />
                        </div>
                        <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 whitespace-nowrap font-medium text-gray-700">Upload</button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Footer Background Image</label>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-full bg-gray-100 rounded border border-gray-200 overflow-hidden">
                          <img src="https://agentsweb.s3.us-east-2.amazonaws.com/public/MzA5/websitesettings/general/1775114653994_dbb60ab5e13978cd4606f47240b7a53900c226e2da5fd66bcf5afe9b9f9dab1667916bab6b17e.jpg" alt="Footer" className="w-full h-full object-cover" />
                        </div>
                        <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 whitespace-nowrap font-medium text-gray-700">Upload</button>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Slider Images</label>
                      <button className="px-4 py-2.5 text-sm border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 text-gray-600 flex items-center justify-center w-full gap-2 font-medium transition-colors">
                        <FiUpload className="w-4 h-4" /> Upload Multiple Images
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <div className="flex items-center gap-2 text-gray-700 mb-6 pb-2 border-b border-gray-100">
                <FiPhone className="w-5 h-5" />
                <h2 className="text-base font-semibold">Contact Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    defaultValue="hardik@peregrine-it.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select className="w-28 px-3 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-gray-700">
                      <option>CA (+1)</option>
                      <option>US (+1)</option>
                    </select>
                    <input 
                      type="text" 
                      defaultValue="(416) 739-8398"
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    City
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Search & select city..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business Address <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    defaultValue="New Business Address"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Office Location Coordinates */}
            <div>
              <div className="flex items-center gap-2 text-gray-700 mb-6 pb-2 border-b border-gray-100">
                <FiMapPin className="w-5 h-5" />
                <h2 className="text-base font-semibold">Office Location Coordinates</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Google Address / Street Search
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Search for your office address..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Latitude
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter latitude"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-sm"
                  />
                  <p className="mt-1.5 text-xs text-gray-400">Decimal degrees format (e.g., 34.0522)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Longitude
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter longitude"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-sm"
                  />
                  <p className="mt-1.5 text-xs text-gray-400">Decimal degrees format (e.g., -118.2437)</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <div className="flex items-center gap-2 text-gray-700 mb-6 pb-2 border-b border-gray-100">
                <FiShare2 className="w-5 h-5" />
                <h2 className="text-base font-semibold">Social Media Links</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Facebook Link</label>
                  <input type="url" placeholder="https://facebook.com/..." className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram Link</label>
                  <input type="url" placeholder="https://instagram.com/..." className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Twitter Link</label>
                  <input type="url" placeholder="https://twitter.com/..." className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn Link</label>
                  <input type="url" placeholder="https://linkedin.com/..." className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">YouTube Link</label>
                  <input type="url" placeholder="https://youtube.com/..." className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm" />
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
                <div>
                  <div className="flex items-center mb-4 mt-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                    <label className="ml-2 text-sm font-medium text-gray-700">Enable Cookie Consent Banner</label>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cookie Position</label>
                  <select defaultValue="bottom" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm bg-white">
                    <option value="bottom">Bottom</option>
                    <option value="top">Top</option>
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cookie Text</label>
                  <textarea 
                    rows={3} 
                    defaultValue="We use cookies to improve your experience, analyze site traffic, and support personalized advertising. By continuing to browse, you consent to the use of essential, analytics, and marketing cookies in accordance with our Privacy Policy."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm resize-none"
                  ></textarea>
                </div>

               
              </div>
            </div>
          </div>
        )}
        {
          activeTab === "navbar" && (
            <div className="p-4 min-h-[400px] flex items-start justify-start flex-col">
              {/* <div className="text-center text-gray-500">
                <p className="text-lg font-medium">Navbar Settings</p>
                <p className="text-sm mt-2">Content for this section is coming soon.</p>
              </div> */}
              <p className="font-semibold text-lg">Headers</p>
              <div>

              </div>
              <p className="font-semibold text-lg">Navbars</p>
              <div>
                
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
                  onClick={() => setSelectedTheme(theme.id)}
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

        {activeTab !== "general" && activeTab !== "navbar" && activeTab !== "theme" && (
          <div className="p-8 min-h-[400px] flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium">{tabs.find(t => t.id === activeTab)?.label} Settings</p>
              <p className="text-sm mt-2">Content for this section is coming soon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




