import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// PWA update handling
const updateSW = registerSW({
  onNeedRefresh() {
    const banner = document.createElement('div');
    banner.id = 'update-banner';
    banner.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
      background: var(--green-600); color: var(--earth-50);
      padding: 12px 16px; display: flex; align-items: center;
      justify-content: space-between; font-family: 'IBM Plex Sans', sans-serif;
      font-size: 14px;
    `;
    banner.innerHTML = `
      <span>Nueva versión disponible</span>
      <button id="update-btn" style="
        background: white; color: var(--green-800); border: none;
        padding: 6px 16px; border-radius: 6px; font-weight: 600;
        cursor: pointer; font-size: 13px;
      ">Actualizar</button>
    `;
    document.body.prepend(banner);
    document.getElementById('update-btn')?.addEventListener('click', () => updateSW(true));
  },
  onOfflineReady() {
    console.log('CotoControl lista para uso offline');
  },
});

// Global error logging
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
});
