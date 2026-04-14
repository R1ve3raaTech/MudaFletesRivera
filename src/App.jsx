import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Hero from './components/Hero/Hero';
import Services from './components/NuestrosServicios/NuestrosServicios';
import Stats from './components/stats/Stats';
import WhyUs from './components/whyus/WhyUs';
import Process from './components/Process/Process';

import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import BottomNav from './components/BottomNav/BottomNav';
import Conditions from './components/Conditions/Conditions';
import { useEffect } from 'react';

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // Al montar la app (fresco o recarga), si hay un hash, lo limpiamos después de un breve momento
        // para asegurar que no persista en futuras recargas si el usuario ya bajó.
        if (window.location.hash) {
            setTimeout(() => {
                window.history.replaceState(null, null, window.location.pathname);
            }, 500); // 500ms es suficiente para que el scroll empiece y luego limpiamos
        }
    }, []);

    useEffect(() => {
        if (!hash) {
            window.scrollTo(0, 0);
        } else {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                // Limpiar el hash para que no se quede pegado en la barra de navegación
                setTimeout(() => {
                    window.history.replaceState(null, null, window.location.pathname);
                }, 1000);
            }
        }
    }, [pathname, hash]);

    return null;
};

const HomePage = () => {
    return (
        <>
            <Hero />
            <Stats />
            <Services />
            <Process />
            <WhyUs />
            <Contact />
        </>
    );
};

const App = () => {
    return (
        <Router>
            <ScrollToTop />
            <div id="app-container">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/condiciones" element={<Conditions />} />
                    </Routes>
                </main>
                <Footer />
                <BottomNav />
            </div>
        </Router>
    );
};

export default App;
