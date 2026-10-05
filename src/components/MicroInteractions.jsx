import { useEffect } from 'react';
import { animate } from 'motion/mini';

const CONTROL = 'button, a[href], [role="button"]';
const FIELD = 'textarea, select, input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]):not([type="submit"]):not([type="button"])';
const EXCLUDED = '[data-micro="off"], .maplibregl-map';

// Delegation also covers lazy sections, route changes and modal controls.
// Individual CSS scale leaves the transforms owned by GSAP untouched.
export default function MicroInteractions() {
    useEffect(() => {
        const root = document.getElementById('app-container');
        if (!root) return undefined;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
        const states = new Map();
        let pressed = null;

        const eligible = (element) => element && !element.closest(EXCLUDED)
            && !element.matches(':disabled, [aria-disabled="true"]');
        const closest = (event, selector) => {
            const element = event.target instanceof Element ? event.target.closest(selector) : null;
            return element && root.contains(element) && eligible(element) ? element : null;
        };
        const stateFor = (element) => {
            if (!states.has(element)) {
                states.set(element, {
                    hover: false,
                    pressed: false,
                    animation: null,
                    property: getComputedStyle(element).display === 'inline' ? 'opacity' : 'scale',
                    original: new Map(),
                });
            }
            return states.get(element);
        };
        const restore = (element, state) => {
            state.animation?.cancel();
            state.original.forEach((value, property) => {
                if (value) element.style.setProperty(property, value);
                else element.style.removeProperty(property);
            });
        };
        const play = (element, values, settling = false) => {
            if (reduced.matches || !element.isConnected) return;
            const state = stateFor(element);
            Object.keys(values).forEach((property) => {
                const cssProperty = property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
                if (!state.original.has(cssProperty)) state.original.set(cssProperty, element.style.getPropertyValue(cssProperty));
            });
            state.animation?.stop();
            const animation = animate(element, values, {
                duration: state.pressed ? 0.1 : 0.22,
                ease: [0.22, 1, 0.36, 1],
            });
            state.animation = animation;
            if (settling) animation.then(() => {
                if (state.animation !== animation) return;
                restore(element, state);
                states.delete(element);
            });
        };
        const update = (element) => {
            const state = stateFor(element);
            const card = element.matches('[data-micro="card"]');
            const value = state.property === 'opacity'
                ? (state.pressed ? 0.7 : state.hover ? 0.85 : 1)
                : (state.pressed ? 0.975 : state.hover ? (card ? 1.008 : 1.025) : 1);
            play(element, { [state.property]: value }, !state.hover && !state.pressed);
        };
        const hoverTargets = (event) => new Set([
            closest(event, CONTROL), closest(event, '[data-micro="card"]'),
        ].filter(Boolean));
        const over = (event) => {
            if (reduced.matches || !finePointer.matches || event.pointerType === 'touch') return;
            hoverTargets(event).forEach((element) => {
                if (event.relatedTarget instanceof Node && element.contains(event.relatedTarget)) return;
                stateFor(element).hover = true;
                update(element);
            });
        };
        const out = (event) => {
            hoverTargets(event).forEach((element) => {
                if (!states.has(element) || (event.relatedTarget instanceof Node && element.contains(event.relatedTarget))) return;
                stateFor(element).hover = false;
                update(element);
            });
        };
        const release = () => {
            if (!pressed) return;
            const element = pressed;
            pressed = null;
            if (!states.has(element)) return;
            stateFor(element).pressed = false;
            if (element.isConnected && !reduced.matches) update(element);
            else { restore(element, stateFor(element)); states.delete(element); }
        };
        const down = (event) => {
            if (reduced.matches || event.button !== 0 || !event.isPrimary) return;
            const element = closest(event, CONTROL);
            if (!element) return;
            release();
            pressed = element;
            stateFor(element).pressed = true;
            update(element);
        };
        const keyDown = (event) => {
            if (reduced.matches || event.repeat || !['Enter', ' '].includes(event.key)) return;
            const element = closest(event, CONTROL);
            if (!element || (event.key === ' ' && element.tagName === 'A')) return;
            pressed = element;
            stateFor(element).pressed = true;
            update(element);
        };
        const focus = (event) => {
            const element = closest(event, FIELD);
            if (element) play(element, { boxShadow: '0 0 0 4px rgba(14, 165, 233, 0.14)' });
        };
        const blur = (event) => {
            const element = closest(event, FIELD);
            if (element && states.has(element)) play(element, { boxShadow: '0 0 0 0px rgba(14, 165, 233, 0)' }, true);
            release();
        };
        const reset = () => {
            pressed = null;
            states.forEach((state, element) => restore(element, state));
            states.clear();
        };
        const preferenceChanged = () => { if (reduced.matches || !finePointer.matches) reset(); };
        const observer = new MutationObserver(() => {
            states.forEach((state, element) => {
                if (!root.contains(element) || !eligible(element)) {
                    restore(element, state);
                    states.delete(element);
                    if (pressed === element) pressed = null;
                }
            });
        });
        observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'aria-disabled'] });
        const listeners = [
            [root, 'pointerover', over], [root, 'pointerout', out],
            [root, 'pointerdown', down], [window, 'pointerup', release],
            [window, 'pointercancel', release], [window, 'blur', reset],
            [root, 'dragstart', release],
            [root, 'keydown', keyDown], [window, 'keyup', release],
            [root, 'focusin', focus], [root, 'focusout', blur],
        ];
        listeners.forEach(([target, name, handler]) => target.addEventListener(name, handler));
        reduced.addEventListener('change', preferenceChanged);
        finePointer.addEventListener('change', preferenceChanged);
        return () => {
            listeners.forEach(([target, name, handler]) => target.removeEventListener(name, handler));
            reduced.removeEventListener('change', preferenceChanged);
            finePointer.removeEventListener('change', preferenceChanged);
            observer.disconnect();
            reset();
        };
    }, []);
    return null;
}
