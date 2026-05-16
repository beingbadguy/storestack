"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FiHome,
  FiBox,
  FiShoppingCart,
  FiUsers,
  FiStar,
  FiSettings,
  FiTruck,
  FiTag,
  FiBarChart2,
  FiMessageCircle,
  FiLayers,
} from "react-icons/fi";

import {
  MdInventory2,
  MdOutlinePayments,
  MdCampaign,
  MdDisplaySettings,
} from "react-icons/md";

import { BiCategoryAlt, BiLogOut } from "react-icons/bi";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      section: "MAIN",
      items: [
        {
          name: "Dashboard",
          icon: <FiHome />,
          link: "/dashboard",
        },
        {
          name: "Analytics",
          icon: <FiBarChart2 />,
          link: "/analytics",
        },
      ],
    },

    {
      section: "CATALOG",
      items: [
        {
          name: "Products",
          icon: <FiBox />,
          link: "/products",
        },
        {
          name: "Categories",
          icon: <BiCategoryAlt />,
          link: "/categories",
        },
        {
          name: "Inventory",
          icon: <MdInventory2 />,
          link: "/inventory",
        },
      ],
    },

    {
      section: "SALES",
      items: [
        {
          name: "Orders",
          icon: <FiShoppingCart />,
          link: "/orders",
        },
        {
          name: "Payments",
          icon: <MdOutlinePayments />,
          link: "/payments",
        },
        {
          name: "Shipping",
          icon: <FiTruck />,
          link: "/shipping",
        },
        {
          name: "Coupons",
          icon: <FiTag />,
          link: "/coupons",
        },
      ],
    },

    {
      section: "CUSTOMERS",
      items: [
        {
          name: "Customers",
          icon: <FiUsers />,
          link: "/customers",
        },
        {
          name: "Reviews",
          icon: <FiStar />,
          link: "/reviews",
        },
        {
          name: "Support",
          icon: <FiMessageCircle />,
          link: "/support",
        },
      ],
    },
    {
      section: "SYSTEM",
      items: [
        {
          name: "Website Settings",
          icon: <MdDisplaySettings />,
          link: "/website-settings",
        },
      ],
    },
  ];

  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto overscroll-contain">
      {/* LOGO */}
      <div className="flex items-center justify-center border-b border-gray-200 p-5">
        <Image
          src="https://logobook.com/wp-content/uploads/2016/10/Real_Typographers_logo.svg"
          alt="logo"
          width={20}
          height={20}
          priority
        />
      </div>

      {/* MENU */}
      <div className="py-4">
        {menuItems.map((section) => (
          <div key={section.section} className="mb-6">
            <p className="px-6 mb-2 text-xs font-semibold text-gray-400 tracking-widest">
              {section.section}
            </p>

            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = pathname === item.link;

                return (
                  <Link
                    key={item.name}
                    href={item.link}
                    className={`mx-3 flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                   
                      ${
                        isActive
                          ? "bg-teal-700 text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <span className="text-xl">{item.icon}</span>

                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
