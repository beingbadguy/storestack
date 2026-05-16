import Image from "next/image";

export default function AuthLeft() {
  return (
    <div className="hidden lg:flex w-1/2 relative bg-teal-800 text-white">
      <Image
        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa"
        alt="real estate"
        fill
        className="object-cover opacity-40"
      />

      <div className="relative z-10 flex flex-col justify-center px-16">
        <h1 className="text-4xl font-bold mb-4">Find Your Dream Property</h1>
        <p className="text-lg text-gray-200">
          Smart investments start with smart decisions. Join us and unlock
          premium real estate opportunities.
        </p>
      </div>
    </div>
  );
}
