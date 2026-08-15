import { Card } from "@/components/ui/card";

export const metadata = { title: "Account Settings" };

const notificationPrefs = [
  { id: "status-change", label: "Email me when a matter's status changes" },
  { id: "new-document", label: "Email me when a new document is shared" },
  { id: "new-message", label: "Email me when I receive a new message" },
];

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl">Account Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Profile, password, and MFA management are wired up in Milestone 3.
        </p>
      </div>

      <Card>
        <h2 className="font-display text-xl">Notification Preferences</h2>
        <div className="mt-4 space-y-3">
          {notificationPrefs.map((pref) => (
            <label key={pref.id} className="flex items-center gap-3 text-sm">
              <input type="checkbox" disabled defaultChecked className="h-4 w-4" />
              {pref.label}
            </label>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Wiring these to the `Notification` model happens in Milestone 8.
        </p>
      </Card>
    </div>
  );
}
