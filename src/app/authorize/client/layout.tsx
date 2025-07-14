
'use client';
import Sidebar from '../components/clientsidebar';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  
  
return (
    <div className="min-h-screen">
      
      <Sidebar/>
      <main>{children}</main>
    </div>
  );
}