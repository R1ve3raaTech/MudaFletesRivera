import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TruckIcon, Route, Box } from 'lucide-react';
import './truckapart.modules.css';
import truck1 from '../../assets/truck1.jpg';
import truck2 from '../../assets/truck2.jpg';
import logoNew from '../../assets/mudafletesrivera.png';

const TruckApart = () => {
    return (
        <section className="truckSecContainer" id="nuestro-camion">
            <div className="truckSecBlob"></div>
            
            <div className="truckSecWrapper">
                {/* Visual Side */}
                <motion.div 
                    className="truckSecVisual"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="truckSecMainImgWrapper">
                        <img 
                            src={truck1}
                            alt="Vista exterior de nuestro camión" 
                            className="truckSecImage"
                            onError={(e) => {
                                e.currentTarget.style.display='none';
                                e.currentTarget.parentElement.innerHTML = `
                                <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background: var(--surface-color); color: var(--text-secondary); flex-direction:column; gap: 1rem; border: 2px dashed rgba(0,0,0,0.1); border-radius: 24px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
                                    <strong style="font-size:1.1rem;">Exterior Camión</strong>
                                    <span style="font-size:0.9rem; text-align:center; padding: 0 1.5rem;">Guarde su foto como <b>truck1.jpg</b> en <b>src/assets/</b></span>
                                </div>`;
                            }}
                        />
                    </div>
                    
                    <div className="truckSecSubImgWrapper">
                        <img 
                            src={truck2}
                            alt="Interior acondicionado del camión" 
                            className="truckSecImage"
                            onError={(e) => {
                                e.currentTarget.style.display='none';
                                e.currentTarget.parentElement.innerHTML = `
                                <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background: var(--bg-color); color: var(--text-secondary); flex-direction:column; gap: 0.8rem; border-radius: 20px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-box"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                                    <strong style="font-size:0.85rem;">Interior Camión</strong>
                                    <span style="font-size:0.75rem; text-align:center; padding: 0 0.5rem; line-height: 1.2;">Guarde su foto como <b>truck2.jpg</b></span>
                                </div>`;
                            }}
                        />
                    </div>
                    
                    <div className="truckSecBadge">
                        <img src={logoNew} alt="Logo Nuevo" className="truckSecBadgeLogo" />
                        <span>Equipamiento<br/>Seguro</span>
                    </div>
                </motion.div>

                {/* Content Side */}
                <motion.div 
                    className="truckSecContent"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="truckSecSubtitle">
                        <img src={logoNew} alt="Logo" className="truckSecSubLogo" />
                        Confianza en cada kilómetro
                    </div>
                    <h2 className="truckSecTitle">
                        Conozca la herramienta <span>que cuidará el traslado de sus bienes</span>
                    </h2>
                    <p className="truckSecDesc">
                        Sabemos que sus pertenencias son invaluables. Por eso, nuestro camión está equipado con los más altos estándares. Un furgón amplio, limpio y acondicionado logísticamente para que su mudanza llegue impecable a su destino.
                    </p>

                    <div className="truckSecGrid">
                        <motion.div className="truckSecFeature" whileHover={{ y: -5 }}>
                            <div className="truckSecFeatureIcon">
                                <ShieldCheck size={26} />
                            </div>
                            <h4>Furgón Cerrado</h4>
                            <p>Protección total contra el clima, polvo y suciedad durante todo el trayecto.</p>
                        </motion.div>

                        <motion.div className="truckSecFeature" whileHover={{ y: -5 }}>
                            <div className="truckSecFeatureIcon">
                                <Box size={26} />
                            </div>
                            <h4>Interior Acondicionado</h4>
                            <p>Superficies de madera y rieles de sujeción que resguardarán todo tipo de mercancía.</p>
                        </motion.div>

                        <motion.div className="truckSecFeature" whileHover={{ y: -5 }}>
                            <div className="truckSecFeatureIcon">
                                <Route size={26} />
                            </div>
                            <h4>Amplia Capacidad</h4>
                            <p>Espacio optimizado tipo furgón grande para mudanzas residenciales e institucionales completas.</p>
                        </motion.div>

                        <motion.div className="truckSecFeature" whileHover={{ y: -5 }}>
                            <div className="truckSecFeatureIcon">
                                <TruckIcon size={26} />
                            </div>
                            <h4>Rampa Eficiente</h4>
                            <p>Plataforma para facilitar el traslado ágil y sin daños de su mobiliario más pesado.</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TruckApart;
