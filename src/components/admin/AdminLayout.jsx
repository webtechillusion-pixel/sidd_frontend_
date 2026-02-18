// // frontend/src/components/admin/AdminLayout.jsx
// import React, { useState } from 'react';
// import { Outlet, Link, useLocation } from 'react-router-dom';
// import {
//   LayoutDashboard,
//   Users,
//   Car,
//   Calendar,
//   CreditCard,
//   Settings,
//   FileText,
//   TrendingUp,
//   Menu,
//   X,
//   Shield,
//   LogOut,
//   Bell,
//   Search,
//   Home
// } from 'lucide-react';
// import { useAdmin } from '../../context/AdminContext';

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const location = useLocation();
//   const { admin, logout } = useAdmin();

//   const navigation = [
//     { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
//     { name: 'Riders', href: '/admin/riders', icon: Users },
//     { name: 'Cabs', href: '/admin/cabs', icon: Car },
//     { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
//     { name: 'Users', href: '/admin/users', icon: Shield },
//     { name: 'Pricing', href: '/admin/pricing', icon: CreditCard },
//     { name: 'Payouts', href: '/admin/payouts', icon: FileText },
//     { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
//     { name: 'Settings', href: '/admin/settings', icon: Settings },
//     { name: 'Go to Home', href: '/', icon: Home }
//   ];

//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Mobile overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black/50 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`
//           fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 lg:translate-x-0
//           ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//         `}
//       >
//         <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
//           <div className="flex items-center gap-2">
//             <Car className="h-7 w-7 text-blue-400" />
//             <span className="text-lg font-bold">Admin Panel</span>
//           </div>
//           <button
//             className="lg:hidden text-gray-400 hover:text-white"
//             onClick={() => setSidebarOpen(false)}
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-auto">
//           {/* User info */}
//           <div className="border-b border-gray-800 p-4">
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
//                 {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
//               </div>
//               <div className="truncate">
//                 <p className="font-medium truncate">{admin?.name || 'Admin'}</p>
//                 <p className="text-xs text-gray-400">Administrator</p>
//               </div>
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 space-y-1 p-3">
//             {navigation.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   className={`
//                     flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
//                     ${isActive(item.href)
//                       ? 'bg-blue-600 text-white'
//                       : 'text-gray-300 hover:bg-gray-800 hover:text-white'
//                     }
//                   `}
//                   onClick={() => setSidebarOpen(false)}
//                 >
//                   <Icon className="h-5 w-5 flex-shrink-0" />
//                   <span className="truncate">{item.name}</span>
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* Logout */}
//           <div className="border-t border-gray-800 p-3">
//             <button
//               onClick={logout}
//               className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
//             >
//               <LogOut className="h-5 w-5" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* Main content wrapper */}
//       <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
//         {/* Top bar */}
//         <header className="sticky top-0 z-10 border-b bg-white">
//           <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
//             <button
//               className="lg:hidden text-gray-600 hover:text-gray-900"
//               onClick={() => setSidebarOpen(true)}
//             >
//               <Menu className="h-6 w-6" />
//             </button>

//             <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
//               {/* Search - hidden on small screens, visible on medium+ */}
//               <div className="hidden md:block w-80 max-w-full">
//                 <div className="relative">
//                   <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="search"
//                     placeholder="Search..."
//                     className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               <button className="relative p-1">
//                 <Bell className="h-6 w-6 text-gray-600 hover:text-gray-900" />
//                 <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
//               </button>

//               <div className="hidden sm:flex items-center gap-3">
//                 <div className="text-right">
//                   <p className="text-sm font-medium truncate max-w-[150px]">{admin?.name || 'Admin'}</p>
//                   <p className="text-xs text-gray-500">Administrator</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;