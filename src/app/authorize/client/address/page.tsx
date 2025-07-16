'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation } from '@apollo/client';
import { get_address, update_address } from '@/app/graphql/orders';
export default function AddressPage() {
  const [editMode, setEditMode] = useState(false);
  const { data: session, status } = useSession()
  const { data } = useQuery(get_address, { variables: { email: session?.user.email }, skip: !session?.user.email })
  const [updateAddress, { loading: saving, error: saveError }] = useMutation(update_address,{refetchQueries:[{query:get_address}]});
  const [validation, setValid] = useState('')

  const [address, setAddress] = useState({
    userid: '',
    name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  useEffect(() => {
    if (data?.address) {
      const addr = data.address;

      setAddress((prev) => ({
        ...prev,
        userid: session?.user.id as string,
        name: addr.name,
        email: addr.email,
        street: addr.street,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country
      }));
    }
  }, [data]);





  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleEdit = () => {
    setEditMode((prev) => !prev);
    setValid('')
  };

  const handleSave = async () => {

    if (!session) return
    try {
      const { data } = await updateAddress({
        variables: {
          input: address,
        },
      });
      console.log(data)
      setValid(data.updateAddress)
      setEditMode(false);

    } catch (err) {
      console.error('Update failed:', err);

    }
  };


  return (
    <div className="min-h-screen w-[80%] m-auto bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 sm:p-10">
        <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Shipping Address</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={address.name}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            ) : (
              <p className="mt-1 text-gray-900">{address.name}</p>
            )}
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{address.email}</p>
          </div>


          <div>
            <label className="text-sm font-medium text-gray-700">City</label>
            {editMode ? (
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            ) : (
              <p className="mt-1 text-gray-900">{address?.city}</p>
            )}
          </div>


          <div>
            <label className="text-sm font-medium text-gray-700">Postal Code</label>
            {editMode ? (
              <input
                type="text"
                name="postalCode"
                value={address.postalCode}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            ) : (
              <p className="mt-1 text-gray-900">{address.postalCode}</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Full Address</label>
            {editMode ? (
              <>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
                <input
                  type="text"
                  name="country"
                  value={address.country}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </>
            ) : (
              <p className="mt-1 text-gray-900">{address.street},{address.state},{address.country}</p>
            )}
          </div>
        </div>
        {validation ? <div className='text-center text-red-600'>{validation}</div> : ""}
        
        <div className="mt-6 flex justify-end gap-4">

          {editMode ? (
            <>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={handleToggleEdit}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleToggleEdit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Edit Address
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
