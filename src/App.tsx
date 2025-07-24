import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import StudentLogin from './pages/StudentLogin'
import StudentDashboard from './pages/StudentDashboard'
import Reports from './pages/Reports'
import CashFlow from './components/CashFlow'
import AIAdminDashboard from './components/AIAdminDashboard'
import AIStudentDashboard from './components/AIStudentDashboard'
import NotificationCenter from './components/NotificationCenter'
import QuizSystem from './components/QuizSystem'
import AffiliateRegister from './pages/AffiliateRegister'
import AffiliateLogin from './pages/AffiliateLogin'
import AffiliateDashboard from './pages/AffiliateDashboard'
import StudentGallery from './components/StudentGallery'
import EcommerceCheckout from './components/EcommerceCheckout'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cursos" element={<Courses />} />
            <Route path="/curso/:id" element={<CourseDetail />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/aluno/login" element={<StudentLogin />} />
            <Route path="/aluno/dashboard" element={<StudentDashboard />} />
            <Route path="/admin/relatorios" element={<Reports />} />
            <Route path="/admin/fluxo-caixa" element={<CashFlow />} />
            <Route path="/admin/ia-admin" element={<AIAdminDashboard />} />
            <Route path="/aluno/ia-dashboard" element={<AIStudentDashboard />} />
            <Route path="/notificacoes" element={<NotificationCenter />} />
            <Route path="/quiz" element={<QuizSystem />} />
            <Route path="/galeria" element={<StudentGallery />} />
            <Route path="/affiliate-register" element={<AffiliateRegister />} />
            <Route path="/affiliate-login" element={<AffiliateLogin />} />
            <Route path="/affiliate-dashboard" element={<AffiliateDashboard />} />
            <Route path="/checkout" element={<EcommerceCheckout />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App
