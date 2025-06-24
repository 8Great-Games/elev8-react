import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import NewGames from "./pages/MarketResearch/NewGames";
import Bookmarks from "./pages/MarketResearch/Bookmarks";
import PublisherTracking from "./pages/MarketResearch/PublisherTracking";
import Admin from "./pages/Admin";
import FolderDetail from "./pages/MarketResearch/FolderDetail"; // 👈 ekle
import PrivateRoute from "./components/routing/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Protected routes */}
          <Route
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route index path="/" element={<NewGames />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/bookmarks/:folderName" element={<FolderDetail />} />
            <Route path="/publisher-tracking" element={<PublisherTracking />} />
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* Public route */}
          <Route path="/signin" element={<SignIn />} />

          {/* Not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
