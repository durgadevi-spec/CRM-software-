import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Projects from './pages/Projects'
import CreateProject from './pages/CreateProject'
import EditProject from './pages/EditProject'
import Login from './pages/Login'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Projects />} />
        <Route path="/create" element={<CreateProject />} />
        <Route path="/edit/:id" element={<EditProject />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
