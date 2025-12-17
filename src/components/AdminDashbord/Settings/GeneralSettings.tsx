
import React, { useEffect, useState } from "react";
import ToggleSwitch from "./ToggleSwitch";
import { LANGUAGES, TIMEZONES } from "./constants";
import { useGetPlatformSettingsQuery, useUpdatePlatformSettingsMutation } from "@/redux/features/platformSettings/platformSettingsApi";
import toast from "react-hot-toast";
 

const GeneralSettings: React.FC = () => {
  const { data, isLoading, isFetching } = useGetPlatformSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] =
    useUpdatePlatformSettingsMutation();

  // Local State (form fields)
  const [platformName, setPlatformName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [platformDescription, setPlatformDescription] = useState("");
  const [defaultLanguage, setDefaultLanguage] = useState("");
  const [timezone, setTimezone] = useState("");
  const [allowUserRegistration, setAllowUserRegistration] = useState(true);
  const [freeTrialPeriod, setFreeTrialPeriod] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Populate state when API returns data
  useEffect(() => {
    if (data?.data) {
      setPlatformName(data.data.platformName);
      setSupportEmail(data.data.platformTitle || ""); // (Optional: server field not provided)
      setPlatformDescription(data.data.platformDescription);
      setDefaultLanguage(data.data.defaultLanguage);
      setTimezone(data.data.defaultTimezone);
      setAllowUserRegistration(data.data.allowNewRegistration);
      setFreeTrialPeriod(data.data.freeTrialEnabled);
      setMaintenanceMode(data.data.maintenanceMode);
    }
  }, [data]);

  // Handle Submit
  const handleSave = async () => {
    const payload = {
      platformName,
      platformTitle: supportEmail || platformName, // adjust mapping if needed
      platformDescription,
      defaultLanguage,
      defaultTimezone: timezone,
      allowNewRegistration: allowUserRegistration,
      freeTrialEnabled: freeTrialPeriod,
      freeTrialPeriodDays: 7, // backend needs this (from your example payload)
      maintenanceMode,
    };

    try {
      await updateSettings(payload).unwrap();
 toast.success("Settings updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update settings.");
}
  };

  if (isLoading || isFetching)
    return (
      <div className="p-6 text-gray-500 dark:text-gray-300">
        Loading settings...
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700 transition-colors">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-100">
        Platform Settings
      </h2>
      <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm">
        General configuration for your Italian learning platform
      </p>

      <form className="mt-8 space-y-8" onSubmit={(e) => e.preventDefault()}>
        {/* Platform Name & Support Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="platformName"
              className="block text-sm font-medium text-slate-700 dark:text-gray-200"
            >
              Platform Name
            </label>
            <input
              type="text"
              id="platformName"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="supportEmail"
              className="block text-sm font-medium text-slate-700 dark:text-gray-200"
            >
              Support Email
            </label>
            <input
              type="email"
              id="supportEmail"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder="Enter support email"
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="platformDescription"
            className="block text-sm font-medium text-slate-700 dark:text-gray-200"
          >
            Platform Description
          </label>
          <textarea
            id="platformDescription"
            rows={4}
            value={platformDescription}
            onChange={(e) => setPlatformDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
          ></textarea>
        </div>

        {/* Language & Timezone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="defaultLanguage"
              className="block text-sm font-medium text-slate-700 dark:text-gray-200"
            >
              Default Language
            </label>
            <select
              id="defaultLanguage"
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="timezone"
              className="block text-sm font-medium text-slate-700 dark:text-gray-200"
            >
              Timezone
            </label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="border-t border-slate-200 dark:border-gray-600 pt-8 transition-colors">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100">
            Feature Toggles
          </h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-slate-800 dark:text-gray-200">
                  Allow User Registration
                </h4>
                <p className="text-sm text-slate-500 dark:text-gray-400">
                  Enable new users to register for accounts
                </p>
              </div>
              <ToggleSwitch
                checked={allowUserRegistration}
                onChange={setAllowUserRegistration}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-slate-800 dark:text-gray-200">
                  Free Trial Period
                </h4>
                <p className="text-sm text-slate-500 dark:text-gray-400">
                  Offer 7-day free trial for Pro features
                </p>
              </div>
              <ToggleSwitch
                checked={freeTrialPeriod}
                onChange={setFreeTrialPeriod}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-slate-800 dark:text-gray-200">
                  Maintenance Mode
                </h4>
                <p className="text-sm text-slate-500 dark:text-gray-400">
                  Temporarily disable platform access
                </p>
              </div>
              <ToggleSwitch
                checked={maintenanceMode}
                onChange={setMaintenanceMode}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-start pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex cursor-pointer justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;













// import React, { useState } from 'react';
// import ToggleSwitch from './ToggleSwitch';
// import { LANGUAGES, TIMEZONES } from './constants';

// const GeneralSettings: React.FC = () => {
//   const [platformName, setPlatformName] = useState('');
//   const [supportEmail, setSupportEmail] = useState('');
//   const [platformDescription, setPlatformDescription] = useState(
//     ''
//   );
//   const [defaultLanguage, setDefaultLanguage] = useState('English');
//   const [timezone, setTimezone] = useState('Europe/Rome');
//   const [allowUserRegistration, setAllowUserRegistration] = useState(true);
//   const [freeTrialPeriod, setFreeTrialPeriod] = useState(true);
//   const [maintenanceMode, setMaintenanceMode] = useState(false);

//   return (
//     <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700 transition-colors">
//       <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-100">Platform Settings</h2>
//       <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm">
//         General configuration for your Italian learning platform
//       </p>
      
//       <form className="mt-8 space-y-8">
//         {/* Platform Name & Support Email */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label htmlFor="platformName" className="block text-sm font-medium text-slate-700 dark:text-gray-200">Platform Name</label>
//             <input
//               type="text"
//               id="platformName"
//               value={platformName}
//               onChange={(e) => setPlatformName(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
//             />
//           </div>
//           <div>
//             <label htmlFor="supportEmail" className="block text-sm font-medium text-slate-700 dark:text-gray-200">Support Email</label>
//             <input
//               type="email"
//               id="supportEmail"
//               value={supportEmail}
//               onChange={(e) => setSupportEmail(e.target.value)}
//               placeholder="Enter support email"
//               className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
//             />
//           </div>
//         </div>

//         {/* Platform Description */}
//         <div>
//           <label htmlFor="platformDescription" className="block text-sm font-medium text-slate-700 dark:text-gray-200">Platform Description</label>
//           <textarea
//             id="platformDescription"
//             rows={4}
//             value={platformDescription}
//             onChange={(e) => setPlatformDescription(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
//           ></textarea>
//         </div>

//         {/* Default Language & Timezone */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label htmlFor="defaultLanguage" className="block text-sm font-medium text-slate-700 dark:text-gray-200">Default Language</label>
//             <select
//               id="defaultLanguage"
//               value={defaultLanguage}
//               onChange={(e) => setDefaultLanguage(e.target.value)}
//               className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
//             >
//               {LANGUAGES.map(lang => <option key={lang}>{lang}</option>)}
//             </select>
//           </div>
//           <div>
//             <label htmlFor="timezone" className="block text-sm font-medium text-slate-700 dark:text-gray-200">Timezone</label>
//             <select
//               id="timezone"
//               value={timezone}
//               onChange={(e) => setTimezone(e.target.value)}
//               className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
//             >
//               {TIMEZONES.map(tz => <option key={tz}>{tz}</option>)}
//             </select>
//           </div>
//         </div>

//         {/* Feature Toggles */}
//         <div className="border-t border-slate-200 dark:border-gray-600 pt-8 transition-colors">
//           <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100">Feature Toggles</h3>
//           <div className="mt-4 space-y-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h4 className="text-sm font-medium text-slate-800 dark:text-gray-200">Allow User Registration</h4>
//                 <p className="text-sm text-slate-500 dark:text-gray-400">Enable new users to register for accounts</p>
//               </div>
//               <ToggleSwitch checked={allowUserRegistration} onChange={setAllowUserRegistration} />
//             </div>
//             <div className="flex items-center justify-between">
//               <div>
//                 <h4 className="text-sm font-medium text-slate-800 dark:text-gray-200">Free Trial Period</h4>
//                 <p className="text-sm text-slate-500 dark:text-gray-400">Offer 7-day free trial for Pro features</p>
//               </div>
//               <ToggleSwitch checked={freeTrialPeriod} onChange={setFreeTrialPeriod} />
//             </div>
//             <div className="flex items-center justify-between">
//               <div>
//                 <h4 className="text-sm font-medium text-slate-800 dark:text-gray-200">Maintenance Mode</h4>
//                 <p className="text-sm text-slate-500 dark:text-gray-400">Temporarily disable platform access</p>
//               </div>
//               <ToggleSwitch checked={maintenanceMode} onChange={setMaintenanceMode} />
//             </div>
//           </div>
//         </div>

//         {/* Save Button */}
//         <div className="flex justify-start pt-2">
//           <button
//             type="button"
//             className="inline-flex cursor-pointer justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//           >
//             Save Changes
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default GeneralSettings;
