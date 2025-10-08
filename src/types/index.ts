export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'teacher';
}

export type DocumentType =
  | 'marksheet'
  | 'certificate'
  | 'id_card'
  | 'transcript'
  | 'recommendation_letter'
  | 'assignment'
  | 'project_report'
  | 'attendance_record'
  | 'fee_receipt'
  | 'other';

export interface Document {
  id: string;
  studentId: string;
  studentName?: string;
  type: DocumentType;
  title: string;
  description: string;
  category: string;
  academicYear?: string;
  semester?: string;
  subject?: string;
  issueDate?: string;
  expiryDate?: string;
  fileUrl?: string;
  fileName?: string;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}
