'use client';

import DataTable from 'react-data-table-component';
import { DatatableProps } from '@/app/types/layouttype';


const Datatable: React.FC<DatatableProps> = ({ filterproducts, columns }) => {
  return (
    <div className='block w-[90%] m-auto p-3 overflow-x-auto'>
      <DataTable
        columns={columns}
        data={filterproducts}
        pagination
        highlightOnHover
        responsive
       
      />
    </div>
  );
};

export default Datatable;
