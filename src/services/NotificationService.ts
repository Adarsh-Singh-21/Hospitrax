import { 
  Notification, 
  NotificationType, 
  NotificationPriority, 
  NotificationCategory,
  DeliveryChannel, 
  NotificationSettings 
} from '../types/notifications';

export class NotificationService {
  private static instance: NotificationService;
  private settings: NotificationSettings;
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private notifications: Notification[] = [];

  private constructor() {
    this.settings = this.getDefaultSettings();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private getDefaultSettings(): NotificationSettings {
    return {
      userId: 'user-123',
      channels: {
        [DeliveryChannel.IN_APP]: true,
        [DeliveryChannel.PUSH]: true,
        [DeliveryChannel.EMAIL]: false,
        [DeliveryChannel.SMS]: false,
      },
      categories: {
        appointments: true,
        resources: true,
        emergency: true,
        staff: true,
        ai_insights: true,
        patient_communication: true,
        administrative: false,
        system: true,
      },
      priorities: {
        critical: true,
        urgent: true,
        high: true,
        medium: true,
        low: false,
      },
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '07:00',
        timezone: 'UTC-5',
      },
      emailDigest: {
        enabled: true,
        frequency: 'daily',
      },
    };
  }

  // Subscribe to notification updates
  public subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  private notifyListeners(notifications: Notification[]) {
    this.listeners.forEach(listener => listener(notifications));
  }

  // Create and send a notification
  public async createNotification(notification: Omit<Notification, 'id' | 'timestamp'>): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
    };

    // Check if notification should be sent based on settings
    if (this.shouldSendNotification(newNotification)) {
      await this.sendNotification(newNotification);
    }

    // Store and broadcast to listeners
    this.notifications = [newNotification, ...this.notifications];
    this.notifyListeners(this.notifications);

    return newNotification;
  }

  // Check if notification should be sent based on user settings
  private shouldSendNotification(notification: Notification): boolean {
    // Check if category is enabled
    if (!this.settings.categories[notification.category as keyof typeof this.settings.categories]) {
      return false;
    }

    // Check if priority is enabled
    if (!this.settings.priorities[notification.priority as keyof typeof this.settings.priorities]) {
      return false;
    }

    // Check quiet hours
    if (this.isInQuietHours() && notification.priority !== NotificationPriority.CRITICAL) {
      return false;
    }

    return true;
  }

  // Check if current time is within quiet hours
  private isInQuietHours(): boolean {
    if (!this.settings.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    const { start, end } = this.settings.quietHours;

    // Handle overnight quiet hours (e.g., 22:00 to 07:00)
    if (start > end) {
      return currentTime >= start || currentTime <= end;
    } else {
      return currentTime >= start && currentTime <= end;
    }
  }

  // Send notification through appropriate channels
  private async sendNotification(notification: Notification): Promise<void> {
    const promises = notification.deliveryChannels.map(channel => {
      if (this.settings.channels[channel]) {
        return this.sendToChannel(notification, channel);
      }
      return Promise.resolve();
    });

    await Promise.all(promises);
  }

  // Send notification to specific channel
  private async sendToChannel(notification: Notification, channel: DeliveryChannel): Promise<void> {
    switch (channel) {
      case DeliveryChannel.IN_APP:
        await this.sendInAppNotification(notification);
        break;
      case DeliveryChannel.PUSH:
        await this.sendPushNotification(notification);
        break;
      case DeliveryChannel.EMAIL:
        await this.sendEmailNotification(notification);
        break;
      case DeliveryChannel.SMS:
        await this.sendSMSNotification(notification);
        break;
    }
  }

  // Send in-app notification
  private async sendInAppNotification(notification: Notification): Promise<void> {
    // In a real app, this would update the UI state
    console.log('In-app notification:', notification);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Send push notification
  private async sendPushNotification(notification: Notification): Promise<void> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(notification.title, {
          body: notification.message,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          tag: notification.id,
          data: notification,
          requireInteraction: notification.priority === NotificationPriority.CRITICAL,
          actions: notification.actionUrl ? [
            {
              action: 'view',
              title: 'View Details',
              icon: '/view-icon.png'
            }
          ] : []
        });
      } catch (error) {
        console.error('Failed to send push notification:', error);
      }
    }
  }

  // Send email notification
  private async sendEmailNotification(notification: Notification): Promise<void> {
    // In a real app, this would call your email service
    console.log('Email notification:', notification);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Send SMS notification
  private async sendSMSNotification(notification: Notification): Promise<void> {
    // In a real app, this would call your SMS service (Twilio, etc.)
    console.log('SMS notification:', notification);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Expose current notifications
  public getNotifications(): Notification[] {
    return this.notifications;
  }

  // Mark as read helpers
  public markAsRead(id: string): void {
    this.notifications = this.notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    this.notifyListeners(this.notifications);
  }

  public markAllAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
    this.notifyListeners(this.notifications);
  }

  // Update notification settings
  public updateSettings(settings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...settings };
    // In a real app, save to backend
    localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
  }

  // Get current settings
  public getSettings(): NotificationSettings {
    return this.settings;
  }

  // Load settings from storage
  public loadSettings(): void {
    const stored = localStorage.getItem('notificationSettings');
    if (stored) {
      try {
        this.settings = { ...this.settings, ...JSON.parse(stored) };
      } catch (error) {
        console.error('Failed to load notification settings:', error);
      }
    }
  }

  // Create specific notification types
  public async createEmergencyAlert(message: string, location?: string): Promise<Notification> {
    return this.createNotification({
      type: NotificationType.EMERGENCY_CODE_BLUE,
      title: 'Emergency Alert',
      message,
      isRead: false,
      priority: NotificationPriority.CRITICAL,
      category: NotificationCategory.EMERGENCY,
      deliveryChannels: [DeliveryChannel.IN_APP, DeliveryChannel.PUSH, DeliveryChannel.SMS],
      metadata: { location },
    });
  }

  public async createResourceAlert(resource: string, status: string): Promise<Notification> {
    return this.createNotification({
      type: NotificationType.RESOURCE_SHORTAGE,
      title: 'Resource Alert',
      message: `${resource}: ${status}`,
      isRead: false,
      priority: NotificationPriority.HIGH,
      category: NotificationCategory.RESOURCES,
      deliveryChannels: [DeliveryChannel.IN_APP, DeliveryChannel.PUSH],
    });
  }

  public async createAppointmentReminder(patientName: string, time: string): Promise<Notification> {
    return this.createNotification({
      type: NotificationType.APPOINTMENT_REMINDER,
      title: 'Appointment Reminder',
      message: `${patientName} has an appointment at ${time}`,
      isRead: false,
      priority: NotificationPriority.MEDIUM,
      category: NotificationCategory.APPOINTMENTS,
      deliveryChannels: [DeliveryChannel.IN_APP, DeliveryChannel.PUSH],
    });
  }

  public async createAIInsight(insight: string, confidence: number): Promise<Notification> {
    return this.createNotification({
      type: NotificationType.AI_RESOURCE_SURGE,
      title: 'AI Insight',
      message: `${insight} (Confidence: ${confidence}%)`,
      isRead: false,
      priority: NotificationPriority.MEDIUM,
      category: NotificationCategory.AI_INSIGHTS,
      deliveryChannels: [DeliveryChannel.IN_APP, DeliveryChannel.EMAIL],
    });
  }
}

export default NotificationService;
