import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import Layout from "@/components/Layout";
import SettingsForm from "@/components/SettingsForm";
import { Settings as SettingsIcon } from "lucide-react";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-6 w-6 text-indigo-200" />
            <h2 className="text-2xl font-semibold text-white">Settings</h2>
          </div>
          <p className="mt-1 text-sm text-zinc-300">Manage your account settings and preferences</p>
        </div>

        <SettingsForm user={user} />
      </div>
    </Layout>
  );
}

