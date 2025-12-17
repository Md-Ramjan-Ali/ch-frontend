/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useState } from "react";
import { ROLE_PERMISSIONS } from "../constants";
import { AdminUser, Role } from "../types";
import {
  useCreatePlatformUserMutation,
  useDeletePlatformUserMutation,
  useGetPlatformUsersQuery,
} from "@/redux/features/userManagement/usermanagementApi";
import CreateUserModal from "./CreateUserModal";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const { data, isLoading, refetch } = useGetPlatformUsersQuery({});
  const [createUser] = useCreatePlatformUserMutation();
  const [deleteUser] = useDeletePlatformUserMutation();
  const [showModal, setShowModal] = useState(false);

  const handleCreateUser = async (userData: { name: string; email: string; role: Role ,password:string|number}) => {
    await createUser(userData).unwrap();
    refetch();
    toast.success("User created successfully");
    setShowModal(false);
  };

  const handleDeleteUser = async (id :any) => {
    await deleteUser(id).unwrap();
    refetch();
    toast.success("User deleted successfully");
  };

  return (
    <>
      <CreateUserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateUser}
      />

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white">Admin Users</h2>
          <button className="px-4 py-2 cursor-pointer rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all" onClick={() => setShowModal(true)}>
            + Add User
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-400">Loading...</p>
        ) : data?.data?.data?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-3 border dark:border-gray-600 text-left">Name</th>
                  <th className="p-3 border dark:border-gray-600 text-left">Email</th>
                  <th className="p-3 border dark:border-gray-600 text-left">Role</th>
                  <th className="p-3 border dark:border-gray-600 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.data.map((user: AdminUser) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 border dark:border-gray-600">{user.name}</td>
                    <td className="p-3 border dark:border-gray-600">{user.email}</td>
                    <td className="p-3 border dark:border-gray-600">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 border dark:border-gray-600 text-center">
                      <button
                        className="text-red-600 cursor-pointer hover:underline"
                        onClick={() => handleDeleteUser(user?.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No users found.</p>
        )}
      </div>

      {/* Role Permission Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold dark:text-white mb-4">Role Permissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ROLE_PERMISSIONS.map((role) => (
            <div key={role.name} className="p-4 border rounded dark:bg-gray-900">
              <h3 className="font-semibold dark:text-white">{role.name}</h3>
              <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {role.permissions.map((p) => (
                  <li key={p}>✔ {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminUsers;
