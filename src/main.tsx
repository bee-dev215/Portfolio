import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { runBoot } from './boot'
import './index.css'

// Remove dark mode class addition
createRoot(document.getElementById("root")!).render(<App />);
runBoot();
