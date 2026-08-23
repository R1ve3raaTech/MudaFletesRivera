import React, { useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Navbar from './components/navbar/Navbar';
import Hero from './components/Hero/Hero';
import Stats from './components/stats/Stats';
import Footer from './components/Footer/Footer';
import LazySection from './components/LazySection';
import scrollToSection from './scrollToSection';
import SEO from './components/SEO';

const Services = lazy(() => import('./components/NuestrosServicios/NuestrosServicios'));
const WhyUs = lazy(() => import('./components/whyus/WhyUs'));
const Process = lazy(() => import('./components/Process/Process'));
const Contact = lazy(() => import('./components/Contact/Contact'));
const Reseñas = lazy(() => import('./components/Resenhas/Resenhas'));

const Conditions = lazy(() => import('./components/Conditions/Conditions'));
const CotizadorForm = lazy(() => import('./components/Form/CotizadorForm'));
const MudanzasSanJose = lazy(() => import('./components/MudanzasSanJose/MudanzasSanJose'));

const NuestroEquipo = lazy(() => import('./components/NuestroEquipo/NuestroEquipo'));
import BottomNav from './components/BottomNav/BottomNav';
import WhatsappFloat from './components/WhatsappFloat/WhatsappFloat';
import PromoCotizador from './components/PromoCotizador/PromoCotizador';
import CursorBubble from './components/CursorBubble/CursorBubble';
import ScrollbarPill from './components/ScrollbarPill/ScrollbarPill';

// Component to handle scroll behavior
const ScrollToTop = () => {
    const { pathname, hash, state } = useLocation();

    useEffect(() => {
        const id = state?.scrollTo || (hash ? hash.replace('#', '') : null);
        if (!id) {
            window.scrollTo(0, 0);
            return;
        }
        setTimeout(() => scrollToSection(id), 100);
    }, [pathname, hash, state]);

    return null;
};

const PageWrapper = ({ children }) => {
    const ref = useRef(null);

    useGSAP(() => {
        gsap.from(ref.current, { opacity: 0, duration: 0.3 });
    }, { scope: ref });

    return <div ref={ref}>{children}</div>;
};

const HomePage = () => {
    return (
        <PageWrapper>
            <SEO
                title="MudaFletesRivera — Mudanzas y Fletes en Costa Rica"
                description="Soluciones integrales de transporte y mudanzas profesionales en Costa Rica."
                path="/"
            />
            <Hero />
            <Stats />
            {/* Cada LazySection trae su propio Suspense con espaciador: un
                chunk cargando no debe colapsar el resto de la página. */}
            {/* minHeight ≈ altura real medida de cada sección (móvil/escritorio)
                para que el layout no salte mientras cargan. */}
            <LazySection order={0} variant="services" minHeight={{ mobile: 1540, desktop: 1060 }}><Services /></LazySection>
            <LazySection order={1} variant="process" minHeight={{ mobile: 1180, desktop: 600 }}><Process /></LazySection>
            <LazySection order={2} variant="whyus" minHeight={{ mobile: 1160, desktop: 800 }}><WhyUs /></LazySection>
            <LazySection order={3} variant="team" minHeight={{ mobile: 1500, desktop: 990 }}><NuestroEquipo /></LazySection>
            <LazySection order={4} variant="reviews" minHeight={{ mobile: 1580, desktop: 980 }}><Reseñas /></LazySection>
            <LazySection order={5} variant="contact" minHeight={{ mobile: 1370, desktop: 870 }}><Contact /></LazySection>
        </PageWrapper>
    );
};

const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <Suspense fallback={null}>
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/condiciones" element={(
                    <>
                        <SEO
                            title="Condiciones del servicio — MudaFletesRivera"
                            description="Términos y condiciones del servicio de mudanzas y fletes de MudaFletesRivera en Costa Rica."
                            path="/condiciones"
                        />
                        <Conditions />
                    </>
                )} />
                <Route path="/mimudanza" element={(
                    <PageWrapper>
                        <SEO
                            title="Cotiza tu mudanza en San José — MudaFletesRivera"
                            description="Cotiza en línea tu mudanza en San José y el Gran Área Metropolitana. Precio estimado al instante con MudaFletesRivera."
                            path="/mimudanza"
                        />
                        <CotizadorForm />
                    </PageWrapper>
                )} />
                <Route path="/mudanzas-san-jose" element={<PageWrapper><MudanzasSanJose /></PageWrapper>} />
            </Routes>
        </Suspense>
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
                <PromoCotizador />
                <CursorBubble />
                <ScrollbarPill />
            </div>
        </Router>
    );
};

export default App;
