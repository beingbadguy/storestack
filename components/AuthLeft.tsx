import Image from "next/image";
import { PiStorefrontThin } from "react-icons/pi";

export default function AuthLeft() {
  return (
    <div className="hidden rounded-4xl overflow-hidden m-6 lg:flex w-1/2 relative bg-teal-800 text-white ">
      <div className="flex justify-center mb-4 absolute top-6 left-6">
        <PiStorefrontThin size={40} />
      </div>

      <Image
        src="https://images.unsplash.com/photo-1708778002531-5bb1c27c4ea3?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="ecommerce banner"
        fill
        className="object-cover rounded-4xl opacity-80"
      />

      <div className="relative z-10 flex flex-col justify-center px-16">
        <h1 className="text-4xl font-bold mb-4">Find Your Dream Storefront</h1>
        <p className="text-lg text-gray-200">
          Smart businesses start with smart platforms. Launch, manage, and scale
          your multi-tenant eCommerce empire with powerful tools built for
          modern brands.
        </p>
      </div>
    </div>
  );
}
