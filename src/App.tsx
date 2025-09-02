import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import NewGames from "./pages/MarketResearch/NewGames";
import Bookmarks from "./pages/MarketResearch/Bookmarks";
import PublisherTracking from "./pages/MarketResearch/PublisherTracking";
import Admin from "./pages/Admin";
import FolderDetail from "./pages/MarketResearch/FolderDetail";
import PrivateRoute from "./components/routing/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Activation from "./pages/Activation";
import { useAuth } from "./context/AuthContext";

export default function App() {

  const isTool = window.location.hostname.startsWith("tool.")
  if (!isTool) {
    return (<LandingPage />)
  }
  return (

    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Root redirect: decide destination based on user's plan */}
          <Route path="/" element={<RootRedirect />} />
          {/* Activation should render inside AppLayout but remain accessible without authentication (PlanGate blocks it for users with a plan) */}
          <Route element={<AppLayout />}> 
            <Route path="/activation" element={<PlanGate requirePlan={false}><Activation /></PlanGate>} />
          </Route>

          {/* Protected routes */}
          <Route
            element={
              <PrivateRoute>
                <PlanGate requirePlan>
                  <AppLayout />
                </PlanGate>
              </PrivateRoute>
            }
          >
            <Route path="/new-games" element={<NewGames />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/bookmarks/:folderName" element={<FolderDetail />} />
            <Route path="/publisher-tracking" element={<PublisherTracking />} />

          </Route>
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="admin">
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Admin />} />
          </Route>
          {/* Public route */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function RootRedirect() {
  const { hasPlan, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  // If user has a plan => activation, otherwise go to new-games
  return <Navigate to={!hasPlan ? "/activation" : "/new-games"} replace />;
}

function PlanGate({ children, requirePlan = true }: { children: React.ReactNode; requirePlan?: boolean }) {
  const { hasPlan, loading } = useAuth();
  // while auth is loading, don't render anything to avoid redirect flashes
  if (loading) return null;

  if (requirePlan) {
    // route requires the user to HAVE a plan
    if (!hasPlan) return <Navigate to="/activation" replace />;
    return <>{children}</>;
  }

  // route requires the user to NOT have a plan
  if (hasPlan) return <Navigate to="/new-games" replace />;
  return <>{children}</>;
}
