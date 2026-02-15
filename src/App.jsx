import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Announcement from './components/Announcement';
import Home from './pages/Home';
import Events from './pages/Events';
import BeginnerEnrollment from './pages/BeginnerEnrollment';
import ArcheryRounds from './pages/ArcheryRounds';
import Results from './pages/Results';
import Gallery from './pages/Gallery';
import UsefulLinks from './pages/UsefulLinks';
import CompetitionDetails from './pages/CompetitionDetails';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import EventsManager from './pages/admin/EventsManager';
import CompetitionsManager from './pages/admin/CompetitionsManager';
import ResultsManager from './pages/admin/ResultsManager';
import AnnouncementsManager from './pages/admin/AnnouncementsManager';
import LinksManager from './pages/admin/LinksManager';
import RoundsManager from './pages/admin/RoundsManager';
import GalleryManager from './pages/admin/GalleryManager';
import UpdatePassword from './pages/admin/UpdatePassword';

function App() {
    return (
        <Router basename={import.meta.env.BASE_URL}>
            <AuthProvider>
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <div className="pt-16 md:pt-20">
                        <Announcement />
                        <main className="flex-1">
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/events" element={<Events />} />
                                <Route path="/beginners" element={<BeginnerEnrollment />} />
                                <Route path="/rounds" element={<ArcheryRounds />} />
                                <Route path="/results" element={<Results />} />
                                <Route path="/gallery" element={<Gallery />} />
                                <Route path="/links" element={<UsefulLinks />} />
                                <Route path="/competitions/:competitionId" element={<CompetitionDetails />} />
                                <Route path="/login" element={<Login />} />

                                {/* Admin Routes */}
                                <Route
                                    path="/admin"
                                    element={
                                        <ProtectedRoute requireAdmin={true}>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/dashboard"
                                    element={
                                        <ProtectedRoute requireAdmin={true}>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/events"
                                    element={
                                        <ProtectedRoute requireAdmin={true}>
                                            <EventsManager />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/competitions"
                                    element={
                                        <ProtectedRoute requireAdmin={true}>
                                            <CompetitionsManager />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/results"
                                    element={
                                        <ProtectedRoute requireAdmin={true}>
                                            <ResultsManager />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/announcements"
                                    element={
                                        <ProtectedRoute requireAdmin={true}>
                                            <AnnouncementsManager />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/links"
                                    element={
                                        <ProtectedRoute requireAdmin={true}>
                                            <LinksManager />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/rounds"
                                    element={
                                        <ProtectedRoute requireAdmin={true}>
                                            <RoundsManager />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/gallery"
                                    element={
                                        <ProtectedRoute requireAdmin={true}>
                                            <GalleryManager />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/update-password"
                                    element={
                                        <ProtectedRoute>
                                            <UpdatePassword />
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>
                        </main>
                    </div>
                    <Footer />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;

