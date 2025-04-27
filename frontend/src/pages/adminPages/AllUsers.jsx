import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { extractTime } from "../../utils/extractTime";

const AllUsers = () => {
  const { users } = useContext(AppContext);

  //   const handleDelete = (id) => {
  //     if (window.confirm("Are you sure you want to delete this user?")) {
  //       deleteUser(id);
  //     }
  //   };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">All Users</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Number of Bookings
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Created Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                    <img
                      className="w-14 h-14 rounded-full object-cover shadow-sm"
                      src={user.avatar}
                      alt={user.name}
                    />
                    <div>
                      <p className="text-base font-semibold text-gray-800">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500">{user.role}</p>{" "}
                      {/* optional subtitle */}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap items-center flex ">
                  <span className="px-2 inline-flex  text-xs leading-5  font-semibold rounded-full bg-red-100 text-red-800">
                    {user.bookings?.length || 0}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {extractTime(user.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;

// adding the avatar image to the users table
