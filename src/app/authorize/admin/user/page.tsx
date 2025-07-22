'use client';

import { useQuery, useMutation } from '@apollo/client';
import { FaRecycle } from 'react-icons/fa';
import { get_users, update_user_role, delete_user } from '@/app/graphql/user';
import Reactdatatable from '../../components/datatable';
import Searchdatatable from '../../components/searchdatatable';
import { useState } from 'react';

export default function UserManagement() {
  const { data, loading, refetch } = useQuery(get_users);
  const [updateRole] = useMutation(update_user_role, { onCompleted: () => refetch() });
  const [deleteUser] = useMutation(delete_user, { onCompleted: () => refetch() });
  const [search, setSearch] = useState('');
  
 
  const handleRoleChange = (id: string, newRole: string) => {
    updateRole({ variables: { id, role: newRole } });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser({ variables: { id } });
    }
  };

  const filteredUsers = data?.users?.user.filter((user: any) => {
    const value = search.toLowerCase();
    return (
      user.name?.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.role.toLowerCase().includes(value)
    );
  });

  const columns = [
    {
      name: 'Name',
      selector: (row: any) => row.name || 'N/A',
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row: any) => row.email,
      sortable: true,
    },
    {
      name: 'Role',
      cell: (row: any) => (
        <select
          value={row.role}
          onChange={(e) => handleRoleChange(row.id, e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {['ADMIN','CUSTOMER'].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      ),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row: any) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700"
        >
          <FaRecycle/>
        </button>
      ),
    },
  ];

  return (
    <div className="p-4 mt-20">
      <h1 className="text-2xl text-center font-bold mb-4">User Management</h1>

      <Searchdatatable search={setSearch}/>

      <Reactdatatable columns ={columns} filterproducts={filteredUsers}/>
     

    </div>
  );
}
