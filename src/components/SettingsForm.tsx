"use client";

import { useState, FormEvent } from "react";
import { Loader2, Save, Moon, Sun, Bell, Lock, User } from "lucide-react";
import { useTheme } from "next-themes";

interface SettingsFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    college: string | null;
    department: string | null;
    year: number | null;
    bio: string | null;
  };
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      college: formData.get("college") as string,
      department: formData.get("department") as string,
      year: formData.get("year") ? parseInt(formData.get("year") as string) : null,
      bio: formData.get("bio") as string,
    };

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Failed to update profile");
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-indigo-200" />
          <h3 className="text-lg font-semibold text-white">Profile Information</h3>
        </div>

        <div className="space-y-4">
          <label className="block space-y-1">
            <span className="text-sm text-zinc-200">Name</span>
            <input
              name="name"
              type="text"
              defaultValue={user.name}
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-2 ring-transparent transition focus:ring-indigo-500"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm text-zinc-200">Email</span>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-zinc-400 cursor-not-allowed"
            />
            <p className="text-xs text-zinc-400">Email cannot be changed</p>
          </label>

          <label className="block space-y-1">
            <span className="text-sm text-zinc-200">College</span>
            <input
              name="college"
              type="text"
              defaultValue={user.college || ""}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-2 ring-transparent transition focus:ring-indigo-500"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm text-zinc-200">Department</span>
            <input
              name="department"
              type="text"
              defaultValue={user.department || ""}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-2 ring-transparent transition focus:ring-indigo-500"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm text-zinc-200">Year</span>
            <input
              name="year"
              type="number"
              min="1"
              max="5"
              defaultValue={user.year || ""}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-2 ring-transparent transition focus:ring-indigo-500"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm text-zinc-200">Bio</span>
            <textarea
              name="bio"
              rows={4}
              defaultValue={user.bio || ""}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none ring-2 ring-transparent transition focus:ring-indigo-500 resize-none"
              placeholder="Tell us about yourself..."
            />
          </label>
        </div>

        {error && <p className="text-sm text-amber-200">{error}</p>}
        {success && <p className="text-sm text-emerald-200">Profile updated successfully!</p>}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-400 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:shadow-glass disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </form>

      {/* Appearance Settings */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          {theme === "dark" ? (
            <Moon className="h-5 w-5 text-indigo-200" />
          ) : (
            <Sun className="h-5 w-5 text-indigo-200" />
          )}
          <h3 className="text-lg font-semibold text-white">Appearance</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-200">Theme</p>
            <p className="text-xs text-zinc-400 mt-1">Choose your preferred theme</p>
          </div>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none ring-2 ring-transparent transition focus:ring-indigo-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-indigo-200" />
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
        </div>
        <p className="text-sm text-zinc-300">Notification preferences coming soon</p>
      </div>

      {/* Privacy Settings */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-5 w-5 text-indigo-200" />
          <h3 className="text-lg font-semibold text-white">Privacy</h3>
        </div>
        <p className="text-sm text-zinc-300">Privacy settings coming soon</p>
      </div>
    </div>
  );
}

