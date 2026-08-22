// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from "./hooks/use-theme.tsx"
import { AuthProvider } from './context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(

    <AuthProvider>
      <ThemeProvider>
      <BrowserRouter>
        <App></App>
      </BrowserRouter>
    </ThemeProvider>
    </AuthProvider>
)
