import React, { useState } from "react";
import { Role } from "../types";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // react-icons for eye icons

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: {
    name: string;
    email: string;
    role: Role;
    password: string | number;
  }) => void;
}

const CreateUserModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: Role.ContentManager,
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all required fields.");
      return;
    }

    onSubmit(form);
    setForm({ name: "", email: "", role: Role.ContentManager, password: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-full max-w-md shadow-2xl animate-fadeIn">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Create Admin User
        </h2>

        <div className="space-y-4">
          {/* NAME */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all"
              placeholder="Enter full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all"
              placeholder="example@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all pr-10"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2/3 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          {/* ROLE */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
            >
              {Object.values(Role).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded-lg border cursor-pointer border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 cursor-pointer rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;








// import React, { useState } from "react";
// import { Role } from "../types";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (user: { name: string; email: string; role: Role ,password:string|number }) => void;
// }

// const CreateUserModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
//   const [form, setForm] = useState({ name: "", email: "", role: Role.ContentManager ,password:"" });

//   if (!isOpen) return null;

//   const handleSubmit = () => {
//     if (!form.name.trim() || !form.email.trim() || !form.role|| !form.password) {
//       alert("Name and Email are required");
//       return;
//     }

//     onSubmit(form);
//     setForm({ name: "", email: "", role: Role.ContentManager ,password:" " });
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-xl">
//         <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Admin User</h2>

//         <div className="space-y-3">
//           <input
//             className="input w-full"
//             placeholder="Full Name"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />

//           <input
//             type="email"
//             className="input w-full"
//             placeholder="Email"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//           />
//           <input
//             type="password"
//             className="input w-full"
//             placeholder="password"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//           />

//           <select
//             className="input w-full"
//             value={form.role}
//             onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
//           >
//             {Object.values(Role).map((r) => (
//               <option key={r} value={r}>
//                 {r}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex justify-end gap-3 mt-6">
//           <button onClick={onClose} className="btn-secondary">Cancel</button>
//           <button onClick={handleSubmit} className="btn-primary">Create</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateUserModal;
