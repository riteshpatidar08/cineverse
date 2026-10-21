import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Signup from './pages/Signup';
import Login from './pages/Login';
import OpenRoutes from './components/OpenRoutes';
import MovieDetails from './components/movies/MovieDetails';
import BookingPage from './pages/BookingPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import RoleRoute from './components/RoleRoute';
import CustomerLayout from './components/CustomerLayout';

// Platform Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMoviesPage from './pages/admin/AdminMoviesPage';
import AdminTheatersPage from './pages/admin/AdminTheatersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCitiesPage from './pages/admin/AdminCitiesPage';
import AdminFinancePage from './pages/admin/AdminFinancePage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';

// Theater Partner Pages
import TheaterAdminLayout from './pages/theaterAdmin/TheaterAdminLayout';
import TheaterDashboard from './pages/theaterAdmin/TheaterDashboard';
import ScreenManagerPage from './pages/theaterAdmin/ScreenManagerPage';
import ShowSchedulerPage from './pages/theaterAdmin/ShowSchedulerPage';
import SeatInventoryPage from './pages/theaterAdmin/SeatInventoryPage';
import TicketScannerPage from './pages/theaterAdmin/TicketScannerPage';
import TheaterReportsPage from './pages/theaterAdmin/TheaterReportsPage';
import TheaterProfilePage from './pages/theaterAdmin/TheaterProfilePage';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full">
        <Routes>
          {/* Customer Facing Public Routes */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:name/:id" element={<MovieDetails />} />
            <Route path="/booking/:name/:id" element={<BookingPage />} />
            <Route path="/checkout" element={<BookingDetailsPage />} />
            <Route path="/seat-select/:showId" element={<SeatSelectionPage />} />
            <Route path="/booking-details" element={<BookingDetailsPage />} />
            <Route path="/browse" element={<Movies />} />
          </Route>

          {/* Authentication Routes */}
          <Route element={<OpenRoutes />}>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Legacy /dashboard redirect based on role */}
          <Route
            path="/dashboard"
            element={<Navigate to="/admin/dashboard" replace />}
          />

          {/* ==================================================== */}
          {/* PLATFORM ADMIN CONSOLE (Super Admin - role: 'admin') */}
          {/* ==================================================== */}
          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/movies" element={<AdminMoviesPage />} />
              <Route path="/admin/theaters" element={<AdminTheatersPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/cities" element={<AdminCitiesPage />} />
              <Route path="/admin/finance" element={<AdminFinancePage />} />
              <Route path="/admin/coupons" element={<AdminCouponsPage />} />
            </Route>
          </Route>

          {/* ==================================================== */}
          {/* THEATER PARTNER CONSOLE (role: 'theatreAdmin', 'admin') */}
          {/* ==================================================== */}
          <Route element={<RoleRoute allowedRoles={['theatreAdmin', 'admin']} />}>
            <Route element={<TheaterAdminLayout />}>
              <Route
                path="/theater-admin"
                element={<Navigate to="/theater-admin/dashboard" replace />}
              />
              <Route
                path="/theater-admin/dashboard"
                element={<TheaterDashboard />}
              />
              <Route
                path="/theater-admin/screens"
                element={<ScreenManagerPage />}
              />
              <Route
                path="/theater-admin/shows"
                element={<ShowSchedulerPage />}
              />
              <Route
                path="/theater-admin/inventory"
                element={<SeatInventoryPage />}
              />
              <Route
                path="/theater-admin/scanner"
                element={<TicketScannerPage />}
              />
              <Route
                path="/theater-admin/reports"
                element={<TheaterReportsPage />}
              />
              <Route
                path="/theater-admin/profile"
                element={<TheaterProfilePage />}
              />
            </Route>
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
