import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import VehicleList from './pages/VehicleList.jsx';
import AddVehicle from './pages/AddVehicle.jsx';
import InspectionList from './pages/InspectionList.jsx';
import NewInspection from './pages/NewInspection.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <VehicleList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles/add"
          element={
            <ProtectedRoute>
              <AddVehicle />
            </ProtectedRoute>
          }
            />
            <Route
      path="/inspections"
      element={
        <ProtectedRoute>
          <InspectionList />
        </ProtectedRoute>
      }
    />
    <Route
  path="/inspections/new"
  element={
    <ProtectedRoute>
      <NewInspection />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;