export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: NotificationPriority;
  category: NotificationCategory;
  deliveryChannels: DeliveryChannel[];
  metadata?: Record<string, any>;
  actionUrl?: string;
  expiresAt?: Date;
}

export enum NotificationType {
  APPOINTMENT_REMINDER = 'appointment_reminder',
  APPOINTMENT_CONFIRMATION = 'appointment_confirmation',
  APPOINTMENT_CANCELLATION = 'appointment_cancellation',
  APPOINTMENT_RESCHEDULING = 'appointment_rescheduling',
  RESOURCE_AVAILABILITY = 'resource_availability',
  RESOURCE_SHORTAGE = 'resource_shortage',
  EMERGENCY_CODE_BLUE = 'emergency_code_blue',
  DISASTER_ALERT = 'disaster_alert',
  STAFF_SHIFT_REMINDER = 'staff_shift_reminder',
  STAFF_SUBSTITUTION = 'staff_substitution',
  AI_RESOURCE_SURGE = 'ai_resource_surge',
  AI_ANOMALY_DETECTION = 'ai_anomaly_detection',
  PATIENT_MESSAGE = 'patient_message',
  ADMINISTRATIVE = 'administrative',
  BILLING = 'billing',
  SYSTEM_MAINTENANCE = 'system_maintenance'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical'
}

export enum NotificationCategory {
  APPOINTMENTS = 'appointments',
  RESOURCES = 'resources',
  EMERGENCY = 'emergency',
  STAFF = 'staff',
  AI_INSIGHTS = 'ai_insights',
  PATIENT_COMMUNICATION = 'patient_communication',
  ADMINISTRATIVE = 'administrative',
  SYSTEM = 'system'
}

export enum DeliveryChannel {
  IN_APP = 'in_app',
  PUSH = 'push',
  EMAIL = 'email',
  SMS = 'sms'
}

export interface NotificationSettings {
  userId: string;
  channels: {
    [key in DeliveryChannel]: boolean;
  };
  categories: {
    [key in NotificationCategory]: boolean;
  };
  priorities: {
    [key in NotificationPriority]: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
    timezone: string;
  };
  emailDigest: {
    enabled: boolean;
    frequency: 'hourly' | 'daily' | 'weekly';
  };
}

export interface NotificationFilter {
  category?: NotificationCategory;
  priority?: NotificationPriority;
  type?: NotificationType;
  isRead?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}
