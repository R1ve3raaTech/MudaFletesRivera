import { LazyMotion, domAnimation, m as Motion, useReducedMotion } from 'motion/react';

export default function Reveal({ as = 'div', children, delay = 0, ...props }) {
    const reduced = useReducedMotion();
    const Element = Motion[as];
    return <LazyMotion features={domAnimation}>
        <Element {...props}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}>
            {children}
        </Element>
    </LazyMotion>;
}
