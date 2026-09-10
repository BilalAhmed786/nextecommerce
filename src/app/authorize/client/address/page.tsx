'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation } from '@apollo/client';
import { get_address, update_address } from '@/app/graphql/orders';
import {
FaMapMarkerAlt,
FaEnvelope,
FaUser,
FaCity,
FaGlobe,
FaEdit,
FaSave,
FaTimes,
FaMapPin,
FaCheckCircle,
} from 'react-icons/fa';

export default function AddressPage() {
const [editMode, setEditMode] = useState(false);
const { data: session } = useSession();

const { data } = useQuery(get_address, {
variables: { email: session?.user.email },
skip: !session?.user.email,
});

const [updateAddress, { loading: saving }] = useMutation(update_address, {
refetchQueries: [{ query: get_address }],
});

const [validation, setValid] = useState('');

const [address, setAddress] = useState({
userid: '',
name: '',
email: '',
street: '',
city: '',
state: '',
postalCode: '',
country: '',
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
    country: addr.country,
  }));
}


}, [data, session?.user.id]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const { name, value } = e.target;


setAddress((prev) => ({
  ...prev,
  [name]: value,
}));


};

const handleToggleEdit = () => {
setEditMode((prev) => !prev);
setValid('');
};

const handleSave = async () => {
if (!session) return;


try {
  const { data } = await updateAddress({
    variables: {
      input: address,
    },
  });

  setValid(data.updateAddress);
  setEditMode(false);
} catch (err) {
  console.error('Update failed:', err);
}


};

const fields = [
{
name: 'name',
label: 'Full Name',
value: address.name,
icon: <FaUser />,
},
{
name: 'city',
label: 'City',
value: address.city,
icon: <FaCity />,
},
{
name: 'postalCode',
label: 'Postal Code',
value: address.postalCode,
icon: <FaMapPin />,
},
{
name: 'state',
label: 'State',
value: address.state,
icon: <FaMapMarkerAlt />,
},
{
name: 'country',
label: 'Country',
value: address.country,
icon: <FaGlobe />,
},
];

return ( <div className="min-h-screen bg-[#f7f7f5] px-4 py-10 mt-16 sm:px-6 lg:px-8"> <div className="mx-auto max-w-5xl">


    {/* Header */}
    <div className="mb-8">
      <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
        <FaMapMarkerAlt />
        Delivery Details
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
            Shipping Address
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage the address used for your deliveries.
          </p>
        </div>

        {!editMode && (
          <button
            onClick={handleToggleEdit}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-500 hover:text-black"
          >
            <FaEdit />
            Edit Address
          </button>
        )}
      </div>
    </div>

    {/* Main Content */}
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

      {/* Top Banner */}
      <div className="relative overflow-hidden bg-[#0a0a0a] px-6 py-7 text-white sm:px-8">
        <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute -bottom-20 left-20 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-2xl text-black">
            <FaMapMarkerAlt />
          </div>

          <div>
            <p className="text-lg font-black">
              {editMode ? 'Update your address' : 'Your delivery address'}
            </p>

            <p className="mt-1 text-sm text-gray-400">
              {editMode
                ? 'Make sure your delivery information is correct.'
                : 'This address will be used during checkout.'}
            </p>
          </div>
        </div>
      </div>

      {/* Address Content */}
      <div className="p-6 sm:p-8">

        {/* Contact Information */}
        <div className="mb-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
              Contact Information
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">

            {/* Name */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                Full Name
              </label>

              {editMode ? (
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    name="name"
                    value={address.name}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                  <FaUser className="text-amber-600" />
                  <span className="text-sm font-semibold text-gray-900">
                    {address.name || 'Not provided'}
                  </span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                Email Address
              </label>

              <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                <FaEnvelope className="text-amber-600" />

                <span className="truncate text-sm font-semibold text-gray-700">
                  {address.email || 'Not provided'}
                </span>

                <span className="ml-auto hidden rounded-md bg-gray-200 px-2 py-1 text-[10px] font-bold uppercase text-gray-500 sm:block">
                  Account
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
              Location
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fields
              .filter(
                (field) =>
                  field.name !== 'name' &&
                  field.name !== 'state' &&
                  field.name !== 'country'
              )
              .map((field) => (
                <div key={field.name}>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                    {field.label}
                  </label>

                  {editMode ? (
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {field.icon}
                      </span>

                      <input
                        type="text"
                        name={field.name}
                        value={field.value}
                        onChange={handleChange}
                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                      <span className="text-amber-600">
                        {field.icon}
                      </span>

                      <span className="text-sm font-semibold text-gray-900">
                        {field.value || 'Not provided'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Full Address */}
        <div>
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
              Full Address
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">

            {/* Street */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                Street Address
              </label>

              {editMode ? (
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-400" />

                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleChange}
                    className="h-14 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                  />
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                  <FaMapMarkerAlt className="mt-1 shrink-0 text-amber-600" />

                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {address.street || 'Not provided'}
                  </p>
                </div>
              )}
            </div>

            {/* State */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                State / Province
              </label>

              {editMode ? (
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                />
              ) : (
                <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900">
                  {address.state || 'Not provided'}
                </p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                Country
              </label>

              {editMode ? (
                <input
                  type="text"
                  name="country"
                  value={address.country}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                />
              ) : (
                <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900">
                  {address.country || 'Not provided'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {validation && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <FaCheckCircle />
            {validation}
          </div>
        )}

        {/* Actions */}
        {editMode && (
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <button
              onClick={handleToggleEdit}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <FaTimes />
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-3 text-sm font-bold text-white transition hover:bg-amber-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaSave />
              {saving ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Bottom Info */}
    <div className="mt-5 flex items-center gap-3 px-2 text-xs text-gray-400">
      <FaCheckCircle className="text-emerald-500" />
      Your address information is securely stored with your account.
    </div>
  </div>
</div>


);
}
