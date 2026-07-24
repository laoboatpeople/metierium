'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Mail,
  Globe,
  Clock,
  FileText,
  Shuffle,
  Bell,
  MailCheck,
  BellRing,
  Shield,
  Key,
  Timer,
  Loader2,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface SettingsData {
  orgName: string;
  orgEmail: string;
  timezone: string;
  passingScore: number;
  timeLimit: number;
  questionsPerSimulation: number;
  randomizeOrder: boolean;
  emailNotifications: boolean;
  welcomeEmail: boolean;
  reminderEmails: boolean;
  adminNewUserAlert: boolean;
  adminNotificationEmail: string;
  sessionTimeout: number;
  requireEmailVerification: boolean;
}

const TIMEZONES = [
  'America/Toronto',
  'America/Vancouver',
  'America/Edmonton',
  'America/Winnipeg',
  'America/Halifax',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
  'Pacific/Auckland',
];

function Toggle({ checked, onChange, disabled = false }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E1A] ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${checked ? 'bg-[#3B82F6]' : 'bg-[#2D3A52]'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [orgName, setOrgName] = useState('Metierium');
  const [orgEmail, setOrgEmail] = useState('info@metierium.com');
  const [timezone, setTimezone] = useState('America/Toronto');
  const [passingScore, setPassingScore] = useState(70);
  const [timeLimit, setTimeLimit] = useState(60);
  const [questionsPerSimulation, setQuestionsPerSimulation] = useState(50);
  const [randomizeOrder, setRandomizeOrder] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [welcomeEmail, setWelcomeEmail] = useState(true);
  const [reminderEmails, setReminderEmails] = useState(true);
  const [adminNewUserAlert, setAdminNewUserAlert] = useState(true);
  const [adminNotificationEmail, setAdminNotificationEmail] = useState('chuck.onekeo@gmail.com');
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [requireEmailVerification, setRequireEmailVerification] = useState(false);

  const fetchSettings = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/login');
        return;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const data = json.data || json;

      if (data.orgName !== undefined) setOrgName(data.orgName);
      if (data.orgEmail !== undefined) setOrgEmail(data.orgEmail);
      if (data.timezone !== undefined) setTimezone(data.timezone);
      if (data.passingScore !== undefined) setPassingScore(data.passingScore);
      if (data.timeLimit !== undefined) setTimeLimit(data.timeLimit);
      if (data.questionsPerSimulation !== undefined) setQuestionsPerSimulation(data.questionsPerSimulation);
      if (data.randomizeOrder !== undefined) setRandomizeOrder(data.randomizeOrder);
      if (data.emailNotifications !== undefined) setEmailNotifications(data.emailNotifications);
      if (data.welcomeEmail !== undefined) setWelcomeEmail(data.welcomeEmail);
      if (data.reminderEmails !== undefined) setReminderEmails(data.reminderEmails);
      if (data.adminNewUserAlert !== undefined) setAdminNewUserAlert(data.adminNewUserAlert);
      if (data.adminNotificationEmail !== undefined) setAdminNotificationEmail(data.adminNotificationEmail);
      if (data.sessionTimeout !== undefined) setSessionTimeout(data.sessionTimeout);
      if (data.requireEmailVerification !== undefined) setRequireEmailVerification(data.requireEmailVerification);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orgName, orgEmail, timezone,
          passingScore, timeLimit, questionsPerSimulation, randomizeOrder,
          emailNotifications, welcomeEmail, reminderEmails,
          adminNewUserAlert, adminNotificationEmail,
          sessionTimeout, requireEmailVerification,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <LayoutDashboard size={24} className="text-[#3B82F6]" />
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Settings</h1>
        </div>
        <p className="text-sm text-[#94A3B8]">Manage platform configuration and preferences</p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg text-sm text-[#EF4444]">
          <AlertTriangle size={15} />
          {error}
        </div>
      )}

      {saveSuccess && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg text-sm text-[#10B981]">
          <Check size={15} />
          Settings saved successfully
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Building2 size={16} className="text-[#3B82F6]" />
            <h2 className="text-base font-semibold text-[#F8FAFC]">Organization</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">
                Organization Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Mail size={12} />
                  Contact Email
                </span>
              </label>
              <input
                type="email"
                value={orgEmail}
                onChange={(e) => setOrgEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Globe size={12} />
                  Timezone
                </span>
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz} className="bg-[#0A0E1A]">{tz}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Exam Defaults */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <FileText size={16} className="text-[#06B6D4]" />
            <h2 className="text-base font-semibold text-[#F8FAFC]">Exam Defaults</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">
                Default Passing Score (%)
              </label>
              <input
                type="number"
                min={50}
                max={100}
                value={passingScore}
                onChange={(e) => setPassingScore(parseInt(e.target.value) || 70)}
                className="w-full px-4 py-2.5 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  Default Time Limit (minutes)
                </span>
              </label>
              <input
                type="number"
                min={15}
                max={300}
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value) || 60)}
                className="w-full px-4 py-2.5 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">
                Questions Per Simulation
              </label>
              <input
                type="number"
                min={10}
                max={200}
                value={questionsPerSimulation}
                onChange={(e) => setQuestionsPerSimulation(parseInt(e.target.value) || 50)}
                className="w-full px-4 py-2.5 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div className="flex items-center justify-between py-2.5">
              <div>
                <p className="text-sm font-medium text-[#94A3B8]">
                  <span className="flex items-center gap-1.5">
                    <Shuffle size={12} />
                    Randomize Order
                  </span>
                </p>
                <p className="text-xs text-[#64748B] mt-0.5">Shuffle questions on each attempt</p>
              </div>
              <Toggle
                checked={randomizeOrder}
                onChange={(v) => setRandomizeOrder(v)}
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={16} className="text-[#F59E0B]" />
            <h2 className="text-base font-semibold text-[#F8FAFC]">Notification Settings</h2>
          </div>

          <div className="space-y-4">
            {/* Admin Notification Email */}
            <div className="pb-4 border-b border-[#2D3A52]">
              <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">
                Admin Notification Email
              </label>
              <input
                type="email"
                value={adminNotificationEmail}
                onChange={(e) => setAdminNotificationEmail(e.target.value)}
                className="w-full max-w-md px-4 py-2.5 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-[#94A3B8]">Email Notifications</p>
                <p className="text-xs text-[#64748B] mt-0.5">Enable or disable all email notifications</p>
              </div>
              <Toggle
                checked={emailNotifications}
                onChange={(v) => setEmailNotifications(v)}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-[#94A3B8]">
                  <span className="flex items-center gap-1.5">
                    <MailCheck size={12} />
                    Welcome Email on Registration
                  </span>
                </p>
                <p className="text-xs text-[#64748B] mt-0.5">Send welcome email on registration</p>
              </div>
              <Toggle
                checked={welcomeEmail}
                onChange={(v) => setWelcomeEmail(v)}
                disabled={!emailNotifications}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-[#94A3B8]">
                  <span className="flex items-center gap-1.5">
                    <BellRing size={12} />
                    Reminder Emails
                  </span>
                </p>
                <p className="text-xs text-[#64748B] mt-0.5">Send reminder emails for exams/subscriptions</p>
              </div>
              <Toggle
                checked={reminderEmails}
                onChange={(v) => setReminderEmails(v)}
                disabled={!emailNotifications}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-[#94A3B8]">
                  <span className="flex items-center gap-1.5">
                    <BellRing size={12} />
                    New User Alert
                  </span>
                </p>
                <p className="text-xs text-[#64748B] mt-0.5">Notify admin when a new user registers</p>
              </div>
              <Toggle
                checked={adminNewUserAlert}
                onChange={(v) => setAdminNewUserAlert(v)}
                disabled={!emailNotifications}
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-[#1A2035] border border-[#2D3A52] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={16} className="text-[#EF4444]" />
            <h2 className="text-base font-semibold text-[#F8FAFC]">Security</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Timer size={12} />
                  Session Timeout (minutes)
                </span>
              </label>
              <input
                type="number"
                min={5}
                max={480}
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(parseInt(e.target.value) || 60)}
                className="w-full px-4 py-2.5 bg-[#0A0E1A] border border-[#2D3A52] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div className="flex items-center justify-between py-2.5">
              <div>
                <p className="text-sm font-medium text-[#94A3B8]">
                  <span className="flex items-center gap-1.5">
                    <Key size={12} />
                    Require Email Verification
                  </span>
                </p>
                <p className="text-xs text-[#64748B] mt-0.5">Require users to verify their email address</p>
              </div>
              <Toggle
                checked={requireEmailVerification}
                onChange={(v) => setRequireEmailVerification(v)}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#3B82F6] hover:bg-[#3B82F6]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              'Save All Settings'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
