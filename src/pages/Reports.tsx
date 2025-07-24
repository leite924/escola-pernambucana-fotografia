import React from 'react'
import EnrollmentReport from '../components/EnrollmentReport'
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react'
import { useStore } from '../store/useStore'

const Reports: React.FC = () => {
  const { students, courses, classSchedules } = useStore()

  // Calculate statistics
  const totalStudents = students.length
  const activeStudents = students.filter(s => s.status === 'Ativo').length
  const totalRevenue = students.filter(s => s.paymentStatus === 'paid').length * 500 // Assuming average course price
  const totalClasses = classSchedules.length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-primary-600" />
            Relatórios e Análises
          </h1>
          <p className="mt-2 text-gray-600">
            Acompanhe o desempenho dos cursos, matrículas e receita da escola.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Alunos</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>{activeStudents} ativos</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Turmas Ativas</p>
                <p className="text-2xl font-bold text-gray-900">{totalClasses}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-blue-600">
                <span>{courses.length} cursos disponíveis</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Receita Estimada</p>
                <p className="text-2xl font-bold text-gray-900">R$ {totalRevenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Baseado em matrículas pagas</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <span>Alunos ativos vs total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollment Report */}
        <EnrollmentReport />

        {/* Additional Reports Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Performance */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Desempenho por Curso
            </h3>
            <div className="space-y-4">
              {courses.map((course) => {
                const courseStudents = students.filter(s => s.course === course.title)
                const activeCount = courseStudents.filter(s => s.status === 'Ativo').length
                const totalCount = courseStudents.length
                const percentage = totalCount > 0 ? (activeCount / totalCount) * 100 : 0

                return (
                  <div key={course.id} className="border-b border-gray-200 pb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{course.title}</span>
                      <span className="text-sm text-gray-500">{totalCount} alunos</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{activeCount} ativos</span>
                      <span>{Math.round(percentage)}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Enrollments */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Matrículas Recentes
            </h3>
            <div className="space-y-3">
              {students
                .sort((a, b) => new Date(b.enrollDate).getTime() - new Date(a.enrollDate).getTime())
                .slice(0, 5)
                .map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.course}</div>
                      <div className="text-xs text-gray-400">{student.shift}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{student.enrollDate}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        student.status === 'Ativo' 
                          ? 'bg-green-100 text-green-800'
                          : student.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            {students.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                Nenhuma matrícula encontrada.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports