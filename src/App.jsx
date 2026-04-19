import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transacciones from './pages/Transacciones'
import Metas from './pages/Metas'
import Presupuesto from './pages/Presupuesto'
import Categorias from './pages/Categorias'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="transacciones" element={<Transacciones />} />
            <Route path="metas" element={<Metas />} />
            <Route path="presupuesto" element={<Presupuesto />} />
            <Route path="categorias" element={<Categorias />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
