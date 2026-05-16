import AuthLeft from "@/components/AuthLeft";

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex">
      <AuthLeft />
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <h1 className="text-2xl font-bold mb-4">Verify Your Account</h1>
        <p className="text-lg text-gray-600">
          We sent a verification link to your email address. Please click the
          link to verify your account.
        </p>
      </div>
    </div>
  );
}
