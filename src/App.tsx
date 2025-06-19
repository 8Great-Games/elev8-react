// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import NewGames from "./pages/MarketResearch/NewGames";
import Bookmarks from "./pages/MarketResearch/Bookmarks";
import PrivateRoute from "./components/routing/PrivateRoute";
import { AuthProvider } from "./context/AuthContext"; // <-- eklendi

export default function App() {
  return (
    <AuthProvider> {/* merkezi auth sağlayıcı */}
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
