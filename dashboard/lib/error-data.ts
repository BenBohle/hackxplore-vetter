export const errorData = [
  {
    id: "err-1",
    ticketId: "ERR-2023-001",
    device: "Marketing PC-01",
    deviceId: "PC-MKT-001",
    user: "John Smith",
    userId: "john.smith",
    errorMessage: "TypeError: Cannot read property 'data' of undefined",
    shortMessage: "TypeError: Cannot read property 'data' of undefined",
    fullMessage: "TypeError: Cannot read property 'data' of undefined at Dashboard.render (Dashboard.js:45:23)",
    context: "Dashboard component at line 45",
    stackTrace: `TypeError: Cannot read property 'data' of undefined
    at Dashboard.render (Dashboard.js:45:23)
    at processChild (react-dom.development.js:7344:14)
    at processChildren (react-dom.development.js:7309:4)
    at Object.render (react-dom.development.js:7408:5)
    at renderRoot (react-dom.development.js:11242:7)
    at performWorkOnRoot (react-dom.development.js:12141:24)
    at performWork (react-dom.development.js:12050:7)
    at performSyncWork (react-dom.development.js:12024:3)
    at requestWork (react-dom.development.js:11883:5)
    at scheduleWork (react-dom.development.js:11792:5)`,
    timestamp: "10 minutes ago",
    dateTime: "2023-05-14T14:30:00Z",
    status: "new",
    severity: "high",
    application: "Marketing Portal",
    applicationId: "app-1",
    occurrences: 3,
    firstSeen: "2023-05-14T14:30:00Z",
    lastSeen: "2023-05-14T14:45:00Z",
    assignedTo: null,
    statusHistory: [
      {
        status: "new",
        timestamp: "2023-05-14T14:30:00Z",
        user: "System",
      },
    ],
    comments: [],
    browserInfo: {
      browser: "Chrome",
      version: "112.0.5615.138",
      os: "Windows 10",
    },
    affectedUsers: 2,
  },
  {
    id: "err-2",
    ticketId: "ERR-2023-002",
    device: "Sales Laptop-03",
    deviceId: "LT-SALES-003",
    user: "Emma Johnson",
    userId: "emma.johnson",
    errorMessage: "Failed to fetch data: Network error",
    shortMessage: "Failed to fetch data: Network error",
    fullMessage: "Failed to fetch data: Network error at fetchCustomers (api-client.js:78:12)",
    context: "API client at fetchCustomers()",
    stackTrace: `Error: Failed to fetch data: Network error
    at fetchCustomers (api-client.js:78:12)
    at CustomerList.componentDidMount (CustomerList.js:32:18)
    at commitLifeCycles (react-dom.development.js:16233:22)
    at commitLayoutEffects (react-dom.development.js:19073:7)
    at HTMLUnknownElement.callCallback (react-dom.development.js:3945:14)
    at Object.invokeGuardedCallbackDev (react-dom.development.js:3994:16)
    at invokeGuardedCallback (react-dom.development.js:4056:31)
    at commitRootImpl (react-dom.development.js:19322:9)
    at unstable_runWithPriority (scheduler.development.js:468:12)
    at runWithPriority$1 (react-dom.development.js:11276:10)`,
    timestamp: "25 minutes ago",
    dateTime: "2023-05-14T14:15:00Z",
    status: "investigating",
    severity: "medium",
    application: "Customer Dashboard",
    applicationId: "app-2",
    occurrences: 5,
    firstSeen: "2023-05-14T13:45:00Z",
    lastSeen: "2023-05-14T14:15:00Z",
    assignedTo: {
      id: "tech-1",
      name: "Alex Rivera",
      email: "a.rivera@company.com",
      avatar: "/tech-support-avatar.png",
    },
    statusHistory: [
      {
        status: "new",
        timestamp: "2023-05-14T13:45:00Z",
        user: "System",
      },
      {
        status: "investigating",
        timestamp: "2023-05-14T14:00:00Z",
        user: "Alex Rivera",
      },
    ],
    comments: [
      {
        id: "comment-1",
        user: "Alex Rivera",
        timestamp: "2023-05-14T14:05:00Z",
        text: "Looking into this issue. Appears to be related to network connectivity problems with the API server.",
      },
    ],
    browserInfo: {
      browser: "Firefox",
      version: "112.0.1",
      os: "Windows 11",
    },
    affectedUsers: 3,
  },
  {
    id: "err-3",
    ticketId: "ERR-2023-003",
    device: "Finance PC-02",
    deviceId: "PC-FIN-002",
    user: "Michael Brown",
    userId: "michael.brown",
    errorMessage: "Uncaught ReferenceError: chartData is not defined",
    shortMessage: "Uncaught ReferenceError: chartData is not defined",
    fullMessage:
      "Uncaught ReferenceError: chartData is not defined at ReportGenerator.generateChart (ReportGenerator.js:78:21)",
    context: "ReportGenerator.js:78",
    stackTrace: `ReferenceError: chartData is not defined
    at ReportGenerator.generateChart (ReportGenerator.js:78:21)
    at FinancialReport.renderCharts (FinancialReport.js:45:28)
    at FinancialReport.render (FinancialReport.js:92:12)
    at processChild (react-dom.development.js:7344:14)
    at processChildren (react-dom.development.js:7309:4)
    at Object.render (react-dom.development.js:7408:5)
    at renderRoot (react-dom.development.js:11242:7)
    at performWorkOnRoot (react-dom.development.js:12141:24)
    at performWork (react-dom.development.js:12050:7)
    at performSyncWork (react-dom.development.js:12024:3)`,
    timestamp: "1 hour ago",
    dateTime: "2023-05-14T13:40:00Z",
    status: "resolved",
    severity: "low",
    application: "Finance App",
    applicationId: "app-5",
    occurrences: 2,
    firstSeen: "2023-05-14T13:30:00Z",
    lastSeen: "2023-05-14T13:40:00Z",
    assignedTo: {
      id: "tech-2",
      name: "Sophia Lee",
      email: "s.lee@company.com",
      avatar: "/tech-support-avatar-2.png",
    },
    statusHistory: [
      {
        status: "new",
        timestamp: "2023-05-14T13:30:00Z",
        user: "System",
      },
      {
        status: "investigating",
        timestamp: "2023-05-14T13:35:00Z",
        user: "Sophia Lee",
      },
      {
        status: "resolved",
        timestamp: "2023-05-14T14:10:00Z",
        user: "Sophia Lee",
      },
    ],
    comments: [
      {
        id: "comment-2",
        user: "Sophia Lee",
        timestamp: "2023-05-14T13:35:00Z",
        text: "Investigating the missing chartData variable in the ReportGenerator component.",
      },
      {
        id: "comment-3",
        user: "Sophia Lee",
        timestamp: "2023-05-14T14:10:00Z",
        text: "Fixed the issue. The chartData variable was not being properly initialized before use. Added proper initialization in the component.",
      },
    ],
    browserInfo: {
      browser: "Chrome",
      version: "112.0.5615.138",
      os: "Windows 10",
    },
    affectedUsers: 1,
    resolution: "Fixed by initializing chartData variable before use in ReportGenerator component.",
  },
  {
    id: "err-4",
    ticketId: "ERR-2023-004",
    device: "HR Laptop-01",
    deviceId: "LT-HR-001",
    user: "Sarah Wilson",
    userId: "sarah.wilson",
    errorMessage: "Database connection timeout after 30s",
    shortMessage: "Database connection timeout after 30s",
    fullMessage:
      "Database connection timeout after 30s at EmployeeController.getEmployeeData (EmployeeController.php:124)",
    context: "EmployeeController.php:124",
    stackTrace: `Error: Database connection timeout after 30s
    at EmployeeController->getEmployeeData (EmployeeController.php:124)
    at EmployeeDirectory->render (EmployeeDirectory.php:56)
    at include (header.php:23)
    at require_once (index.php:15)`,
    timestamp: "2 hours ago",
    dateTime: "2023-05-14T12:40:00Z",
    status: "new",
    severity: "critical",
    application: "HR Portal",
    applicationId: "app-4",
    occurrences: 8,
    firstSeen: "2023-05-14T12:30:00Z",
    lastSeen: "2023-05-14T13:15:00Z",
    assignedTo: null,
    statusHistory: [
      {
        status: "new",
        timestamp: "2023-05-14T12:30:00Z",
        user: "System",
      },
    ],
    comments: [],
    serverInfo: {
      server: "Apache",
      version: "2.4.52",
      os: "Ubuntu 20.04",
      php: "8.1.2",
    },
    affectedUsers: 12,
  },
  {
    id: "err-5",
    ticketId: "ERR-2023-005",
    device: "IT Admin-PC",
    deviceId: "PC-IT-001",
    user: "David Miller",
    userId: "david.miller",
    errorMessage: "Permission denied: Unable to access /var/log/app",
    shortMessage: "Permission denied: Unable to access /var/log/app",
    fullMessage: "Permission denied: Unable to access /var/log/app at LogRotation.rotate (LogRotation.js:45)",
    context: "LogRotation service",
    stackTrace: `Error: Permission denied: Unable to access /var/log/app
    at LogRotation.rotate (LogRotation.js:45:12)
    at LogRotation.start (LogRotation.js:23:8)
    at Server.<anonymous> (server.js:156:10)
    at Object.onceWrapper (events.js:421:28)
    at Server.emit (events.js:315:20)
    at emitListeningNT (net.js:1352:10)
    at processTicksAndRejections (internal/process/task_queues.js:79:21)`,
    timestamp: "3 hours ago",
    dateTime: "2023-05-14T11:40:00Z",
    status: "investigating",
    severity: "high",
    application: "System Utilities",
    applicationId: "app-16",
    occurrences: 4,
    firstSeen: "2023-05-14T11:30:00Z",
    lastSeen: "2023-05-14T11:40:00Z",
    assignedTo: {
      id: "tech-3",
      name: "James Wilson",
      email: "j.wilson@company.com",
      avatar: "/tech-support-avatar-3.png",
    },
    statusHistory: [
      {
        status: "new",
        timestamp: "2023-05-14T11:30:00Z",
        user: "System",
      },
      {
        status: "investigating",
        timestamp: "2023-05-14T11:45:00Z",
        user: "James Wilson",
      },
    ],
    comments: [
      {
        id: "comment-4",
        user: "James Wilson",
        timestamp: "2023-05-14T11:50:00Z",
        text: "This appears to be a file permission issue on the server. Checking the user permissions for the log directory.",
      },
    ],
    serverInfo: {
      server: "Node.js",
      version: "16.14.2",
      os: "Ubuntu 20.04",
    },
    affectedUsers: 1,
  },
]
