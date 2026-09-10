'use client';

import { useQuery, useMutation } from '@apollo/client';
import {
  FaRecycle,
  FaUsers,
  FaUserShield,
  FaUser,
  FaSearch,
} from 'react-icons/fa';
import {
  get_users,
  update_user_role,
  delete_user,
} from '@/app/graphql/user';
import Reactdatatable from '../../components/datatable';
import Searchdatatable from '../../components/searchdatatable';
import { useState } from 'react';

export default function UserManagement() {
  const { data, loading, refetch } = useQuery(get_users);

  const [updateRole] = useMutation(update_user_role, {
    onCompleted: () => refetch(),
  });

  const [deleteUser] = useMutation(delete_user, {
    onCompleted: () => refetch(),
  });

  const [search, setSearch] = useState('');

  const users = data?.users?.user || [];

  const handleRoleChange = (id: string, newRole: string) => {
    updateRole({
      variables: {
        id,
        role: newRole,
      },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser({
        variables: { id },
      });
    }
  };

  const filteredUsers = users.filter((user: any) => {
    const value = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value) ||
      user.role?.toLowerCase().includes(value)
    );
  });

  const adminCount = users.filter(
    (user: any) => user.role === 'ADMIN'
  ).length;

  const customerCount = users.filter(
    (user: any) => user.role === 'CUSTOMER'
  ).length;

  const columns = [
    {
      name: 'User',
      selector: (row: any) => row.name || 'N/A',
      sortable: true,
      cell: (row: any) => (
        <div className="flex items-center gap-3 py-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-amber-400">
            {row.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900">
              {row.name || 'N/A'}
            </p>
            <p className="text-xs text-gray-400">Customer account</p>
          </div>
        </div>
      ),
    },

    {
      name: 'Email',
      selector: (row: any) => row.email,
      sortable: true,
      cell: (row: any) => (
        <span className="text-sm text-gray-600">
          {row.email}
        </span>
      ),
    },

    {
      name: 'Role',
      cell: (row: any) => (
        <div className="relative">
          <select
            value={row.role}
            onChange={(e) =>
              handleRoleChange(row.id, e.target.value)
            }
            className="
              cursor-pointer appearance-none rounded-xl
              border border-gray-200
              bg-gray-50
              px-4 py-2 pr-9
              text-xs font-bold
              text-gray-700
              outline-none
              transition
              hover:border-amber-400
              focus:border-amber-500
              focus:ring-4 focus:ring-amber-500/10
            "
          >
            {['ADMIN', 'CUSTOMER'].map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      ),
      sortable: true,
    },

    {
      name: 'Actions',
      cell: (row: any) => (
        <button
          type="button"
          onClick={() => handleDelete(row.id)}
          className="
            flex h-9 w-9 items-center justify-center
            rounded-xl
            border border-red-100
            bg-red-50
            text-red-500
            transition-all
            hover:bg-red-500
            hover:text-white
            hover:shadow-lg
            hover:shadow-red-500/20
          "
          title="Delete user"
        >
          <FaRecycle size={14} />
        </button>
      ),
    },
  ];

  return (
    <div className="mt-20 min-h-screen bg-[#f7f7f5] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
              <FaUsers />
              Administration
            </div>

            <h1 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              User Management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage customer accounts, roles and access.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
            <FaUsers className="text-amber-500" />
            <span className="text-sm font-bold text-gray-800">
              {users.length} Users
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Total Users
                </p>
                <p className="mt-2 text-3xl font-black text-gray-950">
                  {users.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-amber-400">
                <FaUsers size={19} />
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Administrators
                </p>
                <p className="mt-2 text-3xl font-black text-gray-950">
                  {adminCount}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <FaUserShield size={19} />
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Customers
                </p>
                <p className="mt-2 text-3xl font-black text-gray-950">
                  {customerCount}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-700">
                <FaUser size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-5">
          <Searchdatatable search={setSearch} />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-gray-950">
                All Users
              </h2>
              <p className="mt-0.5 text-xs text-gray-400">
                {filteredUsers.length} matching users
              </p>
            </div>

            {search && (
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                <FaSearch />
                Searching: {search}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <Reactdatatable
              columns={columns}
              filterproducts={filteredUsers}
            />
          </div>
        </div>

      </div>
    </div>
  );
}