import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between">
        <h1 className="text-lg font-semibold">Online Event Ticketing System</h1>
        <nav className="space-x-4">
          <Link to="/"> Home_ </Link>
          <Link to="/events"> Events_ </Link>
          {user?.role === "organizer" && <Link to="/my-events"> My Events_</Link>}
          {user?.role === "organizer" && <Link to="/my-events/new"> Create Events_</Link>}
          {user?.role === "admin" && <Link to="/admin/events"> Admin Events_ </Link>}
          {user?.role === "admin" && <Link to="/admin/users"> User  Management_ </Link>}
          {user?.role === "user" && <Link to="/bookings">My Bookings_</Link>}
          


          <Link to="/logout" className="underline hover:text-red-200">-Logout-</Link>
          
        </nav>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      
    </div>
  );
}



// import { Link, Outlet } from "react-router-dom";
// import { useAuth } from "../auth/AuthContext";

// export default function Layout() {
//   const { user, logout } = useAuth();

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
//       {/* HEADER */}
//       <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//           <h1 className="text-xl font-bold"> Event Ticketing</h1>
          
//           <nav className="flex flex-wrap items-center gap-6 text-sm font-medium">
//             <Link to="/" className="hover:underline hover:text-blue-100 transition">Home</Link>
//             <Link to="/events" className="hover:underline hover:text-blue-100 transition">Events</Link>
//             {user?.role === "organizer" && (
//               <Link to="/my-events" className="hover:underline hover:text-blue-100 transition">My Events</Link>
//             )}
//             {user?.role === "admin" && (
//               <>
//                 <Link to="/admin/events" className="hover:underline hover:text-blue-100 transition">Admin Events</Link>
//                 <Link to="/admin/users" className="hover:underline hover:text-blue-100 transition">User Management</Link>
//               </>
//             )}
//             <button
//               onClick={logout}
//               className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition"
//             >
//               Logout
//             </button>
//           </nav>
//         </div>
//       </header>

//       {/* MAIN CONTENT */}
//       <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
//         <Outlet />
//       </main>
//     </div>
//   );
// }
