import React, { useState } from 'react';
import { Plus, FileText, Trash2, CreditCard as Edit2, LogOut, MessageCircle, Filter, FolderOpen, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { DocumentForm } from './DocumentForm';
import { Messages } from './Messages';
import { DocumentType } from '../types';

export const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { documents, deleteDocument } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'documents' | 'messages'>('documents');
  const [filterType, setFilterType] = useState<DocumentType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const myDocuments = documents.filter(d => d.studentId === user?.id);

  const filteredDocuments = myDocuments.filter(doc => {
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleEdit = (id: string) => {
    setEditingDocument(id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument(id);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FolderOpen className="w-6 h-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-slate-900">ClassFYI</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user?.fullName}</p>
                <p className="text-xs text-slate-500">Student</p>
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
              onClick={() => setActiveTab('documents')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'documents'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-slate-600 hover:bg-white/50'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              My Documents
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'messages'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-slate-600 hover:bg-white/50'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Messages
            </button>
          </div>
        </div>

        {activeTab === 'documents' && (
          <>
            {showForm && (
              <DocumentForm
                editingId={editingDocument}
                onClose={() => {
                  setShowForm(false);
                  setEditingDocument(null);
                }}
              />
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Document Library</h2>
                  <p className="text-slate-600 mt-1">Store and manage all your important documents</p>
                </div>
                <button
                  onClick={() => {
                    setEditingDocument(null);
                    setShowForm(true);
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 justify-center"
                >
                  <Plus className="w-5 h-5" />
                  Add Document
                </button>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-slate-500" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as DocumentType | 'all')}
                    className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

              {myDocuments.length > 0 && (
                <div className="mt-4 text-sm text-slate-600">
                  Showing {filteredDocuments.length} of {myDocuments.length} documents
                </div>
              )}
            </div>

            {filteredDocuments.length === 0 && myDocuments.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No documents yet</h3>
                <p className="text-slate-600 mb-6">Start building your document library</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Document
                </button>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No documents found</h3>
                <p className="text-slate-600">Try adjusting your search or filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-slate-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getDocumentTypeColor(document.type)}`}>
                            {getDocumentTypeLabel(document.type)}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">
                          {document.title}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2">{document.description}</p>
                      </div>
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={() => handleEdit(document.id)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(document.id)}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Category:</span>
                        <span className="font-medium text-slate-900">{document.category}</span>
                      </div>
                      {document.subject && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Subject:</span>
                          <span className="font-medium text-slate-900">{document.subject}</span>
                        </div>
                      )}
                      {document.academicYear && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Year:</span>
                          <span className="font-medium text-slate-900">{document.academicYear}</span>
                        </div>
                      )}
                      {document.semester && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Semester:</span>
                          <span className="font-medium text-slate-900">{document.semester}</span>
                        </div>
                      )}
                      {document.issueDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Issue Date:</span>
                          <span className="font-medium text-slate-900">
                            {new Date(document.issueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {document.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {document.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {document.fileUrl && (
                      <a
                        href={document.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View File
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'messages' && <Messages />}
      </div>
    </div>
  );
};
