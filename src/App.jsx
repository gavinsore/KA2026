import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import BeginnerEnrollment from './pages/BeginnerEnrollment';
import ArcheryRounds from './pages/ArcheryRounds';
import Results from './pages/Results';
import Gallery from './pages/Gallery';
import UsefulLinks from './pages/UsefulLinks';
import CompetitionDetails from './pages/CompetitionDetails';

function App() {
    return (
        <Router basename={import.meta.env.BASE_URL}>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 pt-16 md:pt-20">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/beginners" element={<BeginnerEnrollment />} />
                        <Route path="/rounds" element={<ArcheryRounds />} />
                        <Route path="/results" element={<Results />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/links" element={<UsefulLinks />} />
                        <Route path="/competitions/:competitionId" element={<CompetitionDetails />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;

