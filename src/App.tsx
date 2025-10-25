import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Inventory } from './pages/Inventory'
import { Orders } from './pages/Orders'
import { Suppliers } from './pages/Suppliers'
import { Branches } from './pages/Branches'
import { Reports } from './pages/Reports'
import { AIInsights } from './pages/AIInsights'
import { DataImport } from './pages/DataImport'
import { ForecastedSales } from './pages/ForecastedSales'
import { Analysis } from './pages/Analysis'
import { Chat } from './pages/Chat'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Layout>
                <Inventory />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Layout>
                <Orders />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <Layout>
                <Suppliers />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/branches"
          element={
            <ProtectedRoute>
              <Layout>
                <Branches />
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
          path="/ai-insights"
          element={
            <ProtectedRoute>
              <Layout>
                <AIInsights />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/data-import"
          element={
            <ProtectedRoute>
              <Layout>
                <DataImport />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/forecasted-sales"
          element={
            <ProtectedRoute>
              <Layout>
                <ForecastedSales />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <Layout>
                <Analysis />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Layout>
                <Chat />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
