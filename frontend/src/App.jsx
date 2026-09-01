import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import VehicleList from './pages/VehicleList.jsx';
import AddVehicle from './pages/AddVehicle.jsx';
import InspectionList from './pages/InspectionList.jsx';
import NewInspection from './pages/NewInspection.jsx';
import Reports from './pages/Reports.jsx';
import Layout from './components/Layout.jsx';
import ManageUsers from './pages/ManageUsers.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <Layout>
                <VehicleList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles/add"
          element={
            <ProtectedRoute>
              <Layout>
                <AddVehicle />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inspections"
          element={
            <ProtectedRoute>
              <Layout>
                <InspectionList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inspections/new"
          element={
            <ProtectedRoute>
              <Layout>
                <NewInspection />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
  path="/users"
  element={
    <ProtectedRoute>
      <Layout>
        <ManageUsers />
      </Layout>
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;