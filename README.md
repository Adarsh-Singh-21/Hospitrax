# Hospital Resource Sharing Dashboard

A modern web application that helps hospitals in a local area connect and share resources in real-time. Built with React, TypeScript, and Tailwind CSS.

## Features

### 🏥 Resource Management
- **Real-time Resource Tracking**: Monitor available beds, ICU capacity, oxygen supply, and staff availability
- **Resource Requests**: Hospitals can request specific resources from other facilities
- **Priority System**: Categorize requests by urgency (Low, Medium, High, Urgent)
- **Status Updates**: Track resource status with visual progress indicators

### 🚨 Emergency Management
- **Emergency Alerts**: Send immediate alerts for critical situations
- **Severity Levels**: Categorize emergencies from Low to Critical
- **Real-time Notifications**: Instant communication between hospitals
- **Location Tracking**: Include hospital location and contact information

### 📊 Analytics & Monitoring
- **Resource Utilization Charts**: Visual representation of resource usage
- **Performance Tracking**: Weekly resource utilization trends
- **Availability Overview**: Pie charts showing resource distribution
- **Historical Data**: Track resource usage over time

### 🔒 Security & Privacy
- **Secure Communication**: All data transmission is encrypted
- **Patient Privacy**: No patient data is stored or shared
- **Access Control**: Role-based access for different hospital staff
- **Audit Trail**: Track all resource requests and responses

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hospital-resource-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx           # Main dashboard component
│   ├── Sidebar.tsx            # Navigation sidebar
│   ├── Header.tsx             # Top header with breadcrumbs
│   ├── OverviewCards.tsx      # Resource overview cards
│   ├── PerformanceChart.tsx   # Resource utilization chart
│   ├── ResourceChart.tsx      # Resource availability pie chart
│   ├── ResourceTable.tsx      # Resource requests table
│   ├── ResourceRequestModal.tsx # Resource request form
│   └── EmergencyAlert.tsx     # Emergency alert form
├── App.tsx                    # Main app component
├── index.tsx                  # React entry point
└── index.css                  # Global styles with Tailwind
```

## Usage

### Requesting Resources
1. Click the "Request Resource" button
2. Fill in hospital details and resource requirements
3. Select priority level and provide description
4. Submit the request to notify other hospitals

### Emergency Alerts
1. Click the "Emergency Alert" button
2. Select emergency type and severity level
3. Provide location and contact information
4. Send immediate alert to all connected hospitals

### Monitoring Resources
- View real-time resource availability in overview cards
- Track resource utilization trends in charts
- Monitor active requests in the resource table
- Filter and search through resource requests

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Create React App

## Future Enhancements

- [ ] Real-time WebSocket connections
- [ ] Mobile app for on-the-go access
- [ ] Integration with hospital management systems
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Resource reservation system
- [ ] Staff scheduling integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.
