import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  Laptop,
  Smartphone,
  Clock,
  CheckCircle2,
  Eye,
  EyeOff,
  Headphones,
  Lightbulb,
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore.js';

interface SecurityLoginTabProps {
  onNavigateToSupport?: () => void;
}

export const SecurityLoginTab: React.FC<SecurityLoginTabProps> = ({ onNavigateToSupport }) => {
  const { securityLogin, updateSecurityLogin, terminateSession } = useSettingsStore();
  const [formData, setFormData] = useState({ ...securityLogin });
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('••••••••••');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    updateSecurityLogin(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      {/* Middle Column (Form) */}
      <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
        {/* Section 1: Account Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Account Information</h2>
              <p className="text-xs text-slate-500">Manage your email and mobile number.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-3.5 pr-28 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <div className="absolute right-2 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                  <button
                    type="button"
                    className="text-xs font-bold text-blue-600 border border-blue-200 px-2.5 py-0.5 rounded-lg hover:bg-blue-50"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Mobile Number</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-3.5 pr-28 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <div className="absolute right-2 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                  <button
                    type="button"
                    className="text-xs font-bold text-blue-600 border border-blue-200 px-2.5 py-0.5 rounded-lg hover:bg-blue-50"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Login Password */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Login Password</h3>
              <p className="text-xs text-slate-500">Change your account password.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 tracking-wider focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              type="button"
              className="px-4 py-2 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-bold whitespace-nowrap transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Section 3: Active Sessions */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Active Sessions</h3>
              <p className="text-xs text-slate-500">Manage your active login sessions.</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {formData.sessions.map((sess) => (
              <div
                key={sess.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    {sess.device.includes('iPhone') ? (
                      <Smartphone className="w-4 h-4" />
                    ) : (
                      <Laptop className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{sess.device}</h4>
                      {sess.isCurrent && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                          Current Session
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {sess.location} · {sess.time}
                    </p>
                  </div>
                </div>

                {!sess.isCurrent && (
                  <button
                    type="button"
                    onClick={() => terminateSession(sess.id)}
                    className="text-xs font-bold text-rose-600 border border-rose-200 px-3 py-1 rounded-xl hover:bg-rose-50 transition-colors"
                  >
                    Logout
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Account Activity */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Account Activity</h3>
                <p className="text-xs text-slate-500">View your recent login activity.</p>
              </div>
            </div>
            <button
              type="button"
              className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1 rounded-xl hover:bg-blue-50 transition-colors"
            >
              View All Activity
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Date & Time</th>
                  <th className="py-2.5 px-3 font-semibold">Device</th>
                  <th className="py-2.5 px-3 font-semibold">Location</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {formData.activities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-slate-700 font-medium">{act.dateTime}</td>
                    <td className="py-2.5 px-3 text-slate-900 font-semibold">{act.device}</td>
                    <td className="py-2.5 px-3 text-slate-600">{act.location}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 mr-auto flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Security preferences saved!
            </span>
          )}
          <button
            type="button"
            onClick={() => setFormData({ ...securityLogin })}
            className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Right Column (Cards) */}
      <div className="xl:col-span-4 space-y-5">
        {/* Security Tips Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3.5">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
            <Lightbulb className="w-4 h-4" />
            <span>Security Tips</span>
          </div>

          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Use a strong and unique password.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Keep your email and mobile number updated.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Do not share your login credentials with anyone.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Log out from devices you no longer use.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Regularly check your account activity for any suspicious login attempts.</span>
            </li>
          </ul>
        </div>

        {/* Need Help Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Need Help?</h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            If you notice any suspicious activity or face issues with your account, please contact our
            support team.
          </p>

          <button
            type="button"
            onClick={onNavigateToSupport}
            className="w-full py-2.5 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-bold transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};
