import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from "./hooks/use-theme.tsx"

createRoot(document.getElementById('root')!).render(

    <ThemeProvider>
      <BrowserRouter>
        <App></App>
      </BrowserRouter>
    </ThemeProvider>
)
