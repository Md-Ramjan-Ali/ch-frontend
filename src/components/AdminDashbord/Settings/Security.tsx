/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import ToggleSwitch from "./ToggleSwitch";
import {
  useGetSecuritySettingsQuery,
  useUpdateSecuritySettingsMutation,
} from "@/redux/features/securitySettings/securitySettingsApi";
import toast from "react-hot-toast";

const Security: React.FC = () => {
  const { data, isLoading, isError } = useGetSecuritySettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateSecuritySettingsMutation();

  // Local State
  const [minLength, setMinLength] = useState(8);
  const [expiry, setExpiry] = useState(90);
  const [requireSpecial, setRequireSpecial] = useState(true);
  // const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(3);
  const [maxAttempts, setMaxAttempts] = useState(5);
  const [retentionPolicy, setRetentionPolicy] = useState(true);
  const [dataRetentionDays, setDataRetentionDays] = useState(365);
  const [gdpr, setGdpr] = useState(false);

  // Load backend values into state
  useEffect(() => {
    if (data?.data) {
      const s = data.data;
      setMinLength(s.minPasswordLength);
      setExpiry(s.passwordExpiryDays);
      setRequireSpecial(s.requireSpecialChars);
      setRequireUppercase(s.requireUppercaseLetters);
      setSessionTimeout(s.sessionTimeoutDays);
      setMaxAttempts(s.maxLoginAttempts);
      setRetentionPolicy(s.dataRetentionPolicy);
      setDataRetentionDays(s.dataRetentionDays);
      setGdpr(s.gdprComplianceMode);
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateSettings({
        minPasswordLength: minLength,
        passwordExpiryDays: expiry,
        requireSpecialChars: requireSpecial,
        requireUppercaseLetters: requireUppercase,
        sessionTimeoutDays: sessionTimeout,
        maxLoginAttempts: maxAttempts,
        dataRetentionPolicy: retentionPolicy,
        dataRetentionDays,
        gdprComplianceMode: gdpr,
      }).unwrap();

       toast.success("Security Settings Updated Successfully ✔️");
    } catch (error) {
      console.error(error);
       toast.error("Failed to update settings ❌");
    }
  };

  if (isLoading) return <p className="text-gray-500">Loading settings...</p>;
  if (isError) return <p className="text-red-500">Failed to load settings ❌</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Security Settings
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Manage password and session rules
      </p>

      <form className="mt-6 space-y-8 divide-y divide-gray-200 dark:divide-gray-700">
        
        {/* Password Policy */}
        <section className="space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Password Policy</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Minimum Password Length" value={minLength} setter={setMinLength} />
            <InputField label="Password Expiry (days)" value={expiry} setter={setExpiry} />
          </div>

          <Toggle label="Require Special Characters" checked={requireSpecial} setChecked={setRequireSpecial} />
          {/* <Toggle label="Require Numbers" checked={requireNumbers} setChecked={setRequireNumbers} /> */}
          <Toggle label="Require Uppercase Letters" checked={requireUppercase} setChecked={setRequireUppercase} />
        </section>

        {/* Session Management */}
        <section className="pt-6 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Session Management</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Session Timeout (days)" value={sessionTimeout} setter={setSessionTimeout} />
            <InputField label="Max Login Attempts" value={maxAttempts} setter={setMaxAttempts} />
          </div>
        </section>

        {/* Privacy */}
        <section className="pt-6 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Data Privacy</h3>

          <Toggle label="Data Retention Policy" checked={retentionPolicy} setChecked={setRetentionPolicy} />

          <InputField
            label="Data Retention (days)"
            value={dataRetentionDays}
            setter={setDataRetentionDays}
            disabled={!retentionPolicy}
          />

         </section>

        {/* Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isUpdating}
          className="inline-flex items-center cursor-pointer px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Security;

/* Reusable Sub Components */
const InputField = ({ label, value, setter, disabled }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      type="number"
      disabled={disabled}
      value={value}
      onChange={(e) => setter(Number(e.target.value))}
      className="mt-1 block w-full px-3 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 disabled:opacity-50"
    />
  </div>
);

const Toggle = ({ label, checked, setChecked }: any) => (
  <div className="flex items-center justify-between text-gray-700 dark:text-gray-200">
    {label}
    <ToggleSwitch checked={checked} onChange={setChecked} />
  </div>
);











 