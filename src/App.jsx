import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import Navbar from './components/navbar/Navbar';
import Hero from './components/Hero/Hero';
import Services from './components/NuestrosServicios/NuestrosServicios';
import Stats from './components/stats/Stats';
import WhyUs from './components/whyus/WhyUs';
import Process from './components/Process/Process';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Conditions from './components/Conditions/Conditions';
import Reseñas from './components/Resenhas/Resenhas';
import CotizadorForm from './components/Form/CotizadorForm';

import NuestroEquipo from './components/NuestroEquipo/NuestroEquipo';
import BottomNav from './components/BottomNav/BottomNav';
import WhatsappFloat from './components/WhatsappFloat/WhatsappFloat';

// Component to handle scroll behavior
const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo(0, 0);
        } else {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [pathname, hash]);

    return null;
};

const PageWrapper = ({ children }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
    >
        {children}
    </motion.div>
);

const HomePage = () => {
    return (
        <PageWrapper>
            <Hero />
            <Stats />
            <Services />
            <Process />
            <WhyUs />
            <NuestroEquipo />
            <Reseñas />
            <Contact />
        </PageWrapper>
    );
};

const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/condiciones" element={<Conditions />} />
                <Route path="/cotizador" element={<PageWrapper><CotizadorForm /></PageWrapper>} />
            </Routes>
        </AnimatePresence>
    );
};

const App = () => {
    return (
        <Router>
            <ScrollToTop />
            <div id="app-container">
                <Navbar />
                <main>
                    <AnimatedRoutes />
                </main>
                <Footer />
                <BottomNav />
                <WhatsappFloat />
            </div>
        </Router>
    );
};

export default App;
