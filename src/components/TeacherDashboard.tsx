import React, { useState } from 'react';
import { Users, FileText, LogOut, MessageCircle, Search, Filter, FolderOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Messages } from './Messages';
import { DocumentType } from '../types';

export const TeacherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { documents, allUsers } = useData();
  const [activeTab, setActiveTab] = useState<'students' | 'messages'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<DocumentType | 'all'>('all');

  const students = allUsers.filter(u => u.role === 'student');

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentDocuments = (studentId: string) => {
    const studentDocs = documents.filter(d => d.studentId === studentId);
    if (filterType === 'all') return studentDocs;
    return studentDocs.filter(d => d.type === filterType);
  };

  const getStudentStats = (studentId: string) => {
    const studentDocs = documents.filter(d => d.studentId === studentId);
    if (studentDocs.length === 0) return null;

    const typeCount: Record<string, number> = {};
    studentDocs.forEach(doc => {
      typeCount[doc.type] = (typeCount[doc.type] || 0) + 1;
    });

    return {
      total: studentDocs.length,
      types: Object.keys(typeCount).length,
    };
  };

  const getDocumentTypeLabel = (type: DocumentType) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getDocumentTypeColor = (type: DocumentType) => {
    const colors: Record<DocumentType, string> = {
      marksheet: 'bg-blue-100 text-blue-700',
      certificate: 'bg-green-100 text-green-700',
      id_card: 'bg-yellow-100 text-yellow-700',
      transcript: 'bg-purple-100 text-purple-700',
      recommendation_letter: 'bg-pink-100 text-pink-700',
      assignment: 'bg-orange-100 text-orange-700',
      project_report: 'bg-cyan-100 text-cyan-700',
      attendance_record: 'bg-teal-100 text-teal-700',
      fee_receipt: 'bg-rose-100 text-rose-700',
      other: 'bg-slate-100 text-slate-700',
    };
    return colors[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100">
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-emerald-600 mr-2" />
              <span className="text-xl font-bold text-slate-900">ClassFYI</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user?.fullName}</p>
                <p className="text-xs text-slate-500">Teacher</p>
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('students')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'students'
                  ? 'bg-white text-emerald-600 shadow-md'
                  : 'text-slate-600 hover:bg-white/50'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Student Records
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'messages'
                  ? 'bg-white text-emerald-600 shadow-md'
                  : 'text-slate-600 hover:bg-white/50'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Messages
            </button>
          </div>
        </div>

        {activeTab === 'students' && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Student Records</h2>
                  <p className="text-slate-600 mt-1">View all student documents and records</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-emerald-600">{students.length}</p>
                  <p className="text-sm text-slate-600">Total Students</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search students by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-slate-500" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as DocumentType | 'all')}
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="marksheet">Marksheet</option>
                    <option value="certificate">Certificate</option>
                    <option value="id_card">ID Card</option>
                    <option value="transcript">Transcript</option>
                    <option value="recommendation_letter">Recommendation Letter</option>
                    <option value="assignment">Assignment</option>
                    <option value="project_report">Project Report</option>
                    <option value="attendance_record">Attendance Record</option>
                    <option value="fee_receipt">Fee Receipt</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No students found</h3>
                <p className="text-slate-600">
                  {searchTerm ? 'Try adjusting your search' : 'Students will appear here once they register'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
                    {filteredStudents.map((student) => {
                      const stats = getStudentStats(student.id);
                      return (
                        <button
                          key={student.id}
                          onClick={() => setSelectedStudent(student.id)}
                          className={`w-full text-left p-4 rounded-lg transition-all ${
                            selectedStudent === student.id
                              ? 'bg-emerald-50 border-2 border-emerald-600'
                              : 'hover:bg-slate-50 border-2 border-transparent'
                          }`}
                        >
                          <div className="font-semibold text-slate-900">{student.fullName}</div>
                          <div className="text-sm text-slate-600">{student.email}</div>
                          {stats && (
                            <div className="mt-2 text-xs text-slate-500">
                              {stats.total} document{stats.total !== 1 ? 's' : ''} • {stats.types} type{stats.types !== 1 ? 's' : ''}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  {selectedStudent ? (
                    <>
                      {(() => {
                        const student = students.find(s => s.id === selectedStudent);
                        const studentDocuments = getStudentDocuments(selectedStudent);

                        return (
                          <div>
                            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                              <h3 className="text-xl font-bold text-slate-900 mb-2">
                                {student?.fullName}
                              </h3>
                              <p className="text-slate-600">{student?.email}</p>
                              {studentDocuments.length > 0 && (
                                <p className="text-sm text-slate-500 mt-2">
                                  {filterType === 'all'
                                    ? `${studentDocuments.length} total documents`
                                    : `${studentDocuments.length} ${getDocumentTypeLabel(filterType).toLowerCase()}(s)`}
                                </p>
                              )}
                            </div>

                            {studentDocuments.length === 0 ? (
                              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-600">
                                  {filterType === 'all'
                                    ? 'No documents available for this student'
                                    : `No ${getDocumentTypeLabel(filterType).toLowerCase()} documents found`}
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {studentDocuments.map((document) => (
                                  <div
                                    key={document.id}
                                    className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
                                  >
                                    <div className="flex justify-between items-start mb-4">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getDocumentTypeColor(document.type)}`}>
                                            {getDocumentTypeLabel(document.type)}
                                          </span>
                                          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                                            {document.category}
                                          </span>
                                        </div>
                                        <h4 className="font-bold text-lg text-slate-900 mb-1">
                                          {document.title}
                                        </h4>
                                        <p className="text-sm text-slate-600">{document.description}</p>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                      {document.subject && (
                                        <div>
                                          <p className="text-sm text-slate-600">Subject</p>
                                          <p className="font-semibold text-slate-900">{document.subject}</p>
                                        </div>
                                      )}
                                      {document.academicYear && (
                                        <div>
                                          <p className="text-sm text-slate-600">Academic Year</p>
                                          <p className="font-semibold text-slate-900">{document.academicYear}</p>
                                        </div>
                                      )}
                                      {document.semester && (
                                        <div>
                                          <p className="text-sm text-slate-600">Semester</p>
                                          <p className="font-semibold text-slate-900">{document.semester}</p>
                                        </div>
                                      )}
                                      {document.issueDate && (
                                        <div>
                                          <p className="text-sm text-slate-600">Issue Date</p>
                                          <p className="font-semibold text-slate-900">
                                            {new Date(document.issueDate).toLocaleDateString()}
                                          </p>
                                        </div>
                                      )}
                                    </div>

                                    {document.tags.length > 0 && (
                                      <div className="border-t border-slate-200 pt-4">
                                        <p className="text-sm text-slate-600 mb-2">Tags:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {document.tags.map((tag, index) => (
                                            <span
                                              key={index}
                                              className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded"
                                            >
                                              {tag}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {document.fileUrl && (
                                      <div className="border-t border-slate-200 pt-4 mt-4">
                                        <a
                                          href={document.fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                                        >
                                          View Document →
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </>
                  ) : (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                      <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Select a student
                      </h3>
                      <p className="text-slate-600">
                        Click on a student from the list to view their documents and records
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'messages' && <Messages />}
      </div>
    </div>
  );
};
