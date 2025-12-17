import React, { useEffect, useState } from "react";
import { FONTS } from "./constants";
import { useGetBrandingSettingsQuery, useUpdateBrandingSettingsMutation } from "@/redux/features/brandingSettings/brandingSettingApi";
import toast from "react-hot-toast";

interface FileUploadProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  currentImageUrl?: string | null;
  onFileChange: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ title, subtitle, icon, currentImageUrl, onFileChange }) => {
  const [preview, setPreview] = useState<string | null>(currentImageUrl ?? null);

  const handleChange = (file: File | null) => {
    onFileChange(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    setPreview(currentImageUrl ?? null);
  }, [currentImageUrl]);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-1">{title}</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-gray-600 border-dashed rounded-md bg-white dark:bg-gray-700 transition-colors">
        <div className="space-y-2 flex flex-col gap-2 text-center">
          {preview ? (
            <img src={preview} alt={title} className="mx-auto h-20 w-20 object-contain" />
          ) : (
            icon
          )}
          <p className="text-sm text-slate-600 dark:text-gray-300">Upload {title.toLowerCase()}</p>
          <label
            htmlFor={`file-upload-${title.replace(/\s+/g, "-")}`}
            className="cursor-pointer font-medium text-slate-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-600 border border-slate-300 dark:border-gray-600 rounded-md px-3 py-1.5 transition"
          >
            <span>Choose File</span>
            <input
              id={`file-upload-${title.replace(/\s+/g, "-")}`}
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={(e) => handleChange(e.target.files?.[0] ?? null)}
            />
          </label>
          <p className="text-xs text-slate-500 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

const Branding: React.FC = () => {
  const { data, isLoading } = useGetBrandingSettingsQuery();
  const [updateBranding, { isLoading: isSaving }] = useUpdateBrandingSettingsMutation();

  // Form state
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [secondaryColor, setSecondaryColor] = useState("#0f172a");
  const [accentColor, setAccentColor] = useState("#93c5fd");
  const [headingFont, setHeadingFont] = useState("Inter");
  const [bodyFont, setBodyFont] = useState("Inter");
  const [platformLogo, setPlatformLogo] = useState<File | null>(null);
  const [favicon, setFavicon] = useState<File | null>(null);

  // Preview URLs
  const [platformLogoUrl, setPlatformLogoUrl] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  // Load API data
  useEffect(() => {
    if (data?.data) {
      setPrimaryColor(data.data.primaryColor || "#2563eb");
      setSecondaryColor(data.data.secondaryColor || "#0f172a");
      setAccentColor(data.data.accentColor || "#93c5fd");
      setHeadingFont(data.data.headingFont || "Inter");
      setBodyFont(data.data.bodyFont || "Inter");
      setPlatformLogoUrl(data.data.platformLogoUrl || null);
      setFaviconUrl(data.data.faviconUrl || null);
    }
  }, [data]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("primaryColor", primaryColor);
    formData.append("secondaryColor", secondaryColor);
    formData.append("accentColor", accentColor);
    formData.append("headingFont", headingFont);
    formData.append("bodyFont", bodyFont);
    if (platformLogo) formData.append("logo", platformLogo);
    if (favicon) formData.append("favicon", favicon);

    try {
      const result = await updateBranding(formData).unwrap();
      toast.success("Branding updated successfully!");
      // Update previews
      setPlatformLogoUrl(result.data.platformLogoUrl);
      setFaviconUrl(result.data.faviconUrl);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update branding.");
    }
  };

  if (isLoading) return <p className="text-gray-400">Loading branding settings...</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700 transition-colors">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-100">Branding & Appearance</h2>
      <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm">Customize the look and feel of your platform</p>

      <form className="mt-8 space-y-8">
        {/* Logo Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUpload
            title="Platform Logo"
            subtitle="(max 2MB)"
            icon={
              <svg className="mx-auto h-10 w-10 text-slate-400 dark:text-gray-300" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" />
              </svg>
            }
            currentImageUrl={platformLogoUrl}
            onFileChange={setPlatformLogo}
          />

          <FileUpload
            title="Favicon"
            subtitle="(32x32 px)"
            icon={
              <svg className="mx-auto h-10 w-10 text-slate-400 dark:text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 9a9 9 0 01-9 9" />
              </svg>
            }
            currentImageUrl={faviconUrl}
            onFileChange={setFavicon}
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "Primary Color", value: primaryColor, setter: setPrimaryColor },
            { label: "Secondary Color", value: secondaryColor, setter: setSecondaryColor },
            { label: "Accent Color", value: accentColor, setter: setAccentColor },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <label className="text-sm text-black dark:text-gray-200">{label}</label>
              <input
                type="color"
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full h-10 rounded-md cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Fonts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <select className="input" value={headingFont} onChange={(e) => setHeadingFont(e.target.value)}>
            {FONTS.map((font) => (
              <option key={font}>{font}</option>
            ))}
          </select>

          <select className="input" value={bodyFont} onChange={(e) => setBodyFont(e.target.value)}>
            {FONTS.map((font) => (
              <option key={font}>{font}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Branding Changes"}
        </button>
      </form>
    </div>
  );
};

export default Branding;









// import React, { useEffect, useState } from "react";
// import { FONTS } from "./constants";
// import { useGetBrandingSettingsQuery, useUpdateBrandingSettingsMutation } from "@/redux/features/brandingSettings/brandingSettingApi";
 

// const FileUpload = ({
//   title,
//   subtitle,
//   icon,
//   onFileChange,
// }: {
//   title: string;
//   subtitle: string;
//   icon: React.ReactNode;
//   onFileChange: (file: File | null) => void;
// }) => (
//   <div>
//     <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-1">{title}</label>

//     <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-gray-600 border-dashed rounded-md bg-white dark:bg-gray-700 transition-colors">
//       <div className="space-y-2 flex flex-col gap-2 text-center">
//         {icon}
//         <p className="text-sm text-slate-600 dark:text-gray-300">Upload {title.toLowerCase()}</p>

//         <label
//           htmlFor={`file-upload-${title.replace(/\s+/g, "-")}`}
//           className="cursor-pointer font-medium text-slate-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-600 border border-slate-300 dark:border-gray-600 rounded-md px-3 py-1.5 transition"
//         >
//           <span>Choose File</span>
//           <input
//             id={`file-upload-${title.replace(/\s+/g, "-")}`}
//             type="file"
//             className="sr-only"
//             onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
//           />
//         </label>

//         <p className="text-xs text-slate-500 dark:text-gray-400">{subtitle}</p>
//       </div>
//     </div>
//   </div>
// );

// const Branding: React.FC = () => {
//   // API hooks
//   const { data, isLoading } = useGetBrandingSettingsQuery();
//   const [updateBranding, { isLoading: isSaving }] = useUpdateBrandingSettingsMutation();

//   // Form States
//   const [primaryColor, setPrimaryColor] = useState("#2563eb");
//   const [secondaryColor, setSecondaryColor] = useState("#0f172a");
//   const [accentColor, setAccentColor] = useState("#93c5fd");
//   const [headingFont, setHeadingFont] = useState("Inter");
//   const [bodyFont, setBodyFont] = useState("Inter");

//   const [platformLogo, setPlatformLogo] = useState<File | null>(null);
//   const [favicon, setFavicon] = useState<File | null>(null);

//   // Load API data into UI when fetched
//   useEffect(() => {
//     if (data?.data) {
//       setPrimaryColor(data.data.primaryColor);
//       setSecondaryColor(data.data.secondaryColor);
//       setAccentColor(data.data.accentColor);
//       setHeadingFont(data.data.headingFont);
//       setBodyFont(data.data.bodyFont);
//     }
//   }, [data]);

//   const handleSubmit = async () => {
//     await updateBranding({
//       primaryColor,
//       secondaryColor,
//       accentColor,
//       headingFont,
//       bodyFont,
//       platformLogo,
//       favicon,
//     });

//     alert("Branding updated successfully!");
//   };

//   if (isLoading) return <p className="text-gray-400">Loading branding settings...</p>;

//   return (
//     <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700 transition-colors">
//       <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-100">Branding & Appearance</h2>
//       <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm">
//         Customize the look and feel of your platform
//       </p>

//       <form className="mt-8 space-y-8">

//         {/* Logo Upload */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <FileUpload 
//             title="Platform Logo" 
//             subtitle="(max 2MB)" 
//             icon={<svg className="mx-auto h-10 w-10 text-slate-400 dark:text-gray-300" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" /></svg>}
//             onFileChange={setPlatformLogo}
//           />

//           <FileUpload 
//             title="Favicon" 
//             subtitle="(32x32 px)" 
//             icon={<svg className="mx-auto h-10 w-10 text-slate-400 dark:text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 9a9 9 0 01-9 9" /></svg>}
//             onFileChange={setFavicon}
//           />
//         </div>

//         {/* Colors */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//           {[ 
//             { label: "Primary Color", value: primaryColor, setter: setPrimaryColor },
//             { label: "Secondary Color", value: secondaryColor, setter: setSecondaryColor },
//             { label: "Accent Color", value: accentColor, setter: setAccentColor },
//           ].map(({ label, value, setter }) => (
//             <div key={label}>
//               <label className="text-sm text-black dark:text-gray-200">{label}</label>
//               <input type="color" value={value} onChange={(e) => setter(e.target.value)} className="w-full h-10 rounded-md cursor-pointer" />
//             </div>
//           ))}
//         </div>

//         {/* Fonts */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <select className="input" value={headingFont} onChange={(e) => setHeadingFont(e.target.value)}>
//             {FONTS.map((font) => <option key={font}>{font}</option>)}
//           </select>

//           <select className="input" value={bodyFont} onChange={(e) => setBodyFont(e.target.value)}>
//             {FONTS.map((font) => <option key={font}>{font}</option>)}
//           </select>
//         </div>

//         <button 
//           type="button" 
//           onClick={handleSubmit} 
//           disabled={isSaving}
//           className="inline-flex cursor-pointer justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isSaving ? "Saving..." : "Save Branding Changes"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Branding;









 