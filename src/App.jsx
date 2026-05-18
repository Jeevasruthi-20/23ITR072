import { useEffect, useMemo, useState } from 'react';

const defaultNotifications = [
  {
    id: 'placement-001',
    category: 'placements',
    stage: 'Interview Scheduled',
    title: 'Campus placement drive by TechCorp',
    message: 'Eligible students invited for on-campus interviews in Block B.',
    receivedAt: new Date(Date.now() - 1000 * 60 * 25),
    read: true,
  },
  {
    id: 'event-001',
    category: 'events',
    stage: 'Registration Open',
    title: 'Career fair registration',
    message: 'Register for the campus career fair before Friday.',
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
  },
  {
    id: 'result-001',
    category: 'results',
    stage: 'Results Published',
    title: 'Placement result update',
    message: 'Final round results published for the software engineering test.',
    receivedAt: new Date(Date.now() - 1000 * 60 * 90),
    read: false,
  },
];

const categories = [
  { key: 'all', label: 'All' },
  { key: 'placements', label: 'Placements' },
  { key: 'events', label: 'Events' },
  { key: 'results', label: 'Results' },
];

const incomingMessages = [
  {
    id: 'placement-002',
    category: 'placements',
    stage: 'Application Deadline',
    title: 'Submit placement forms',
    message: 'Deadline for placement registration is tomorrow at 5 PM.',
  },
  {
    id: 'event-002',
    category: 'events',
    stage: 'Workshop Alert',
    title: 'Resume building workshop',
    message: 'Join the resume workshop in Hall C at 4 PM.',
  },
  {
    id: 'result-002',
    category: 'results',
    stage: 'Interview Outcome',
    title: 'First round results are out',
    message: 'Check your student portal for interview outcomes.',
  },
];

const initialForm = {
  category: 'placements',
  stage: 'New alert',
  title: '',
  message: '',
};

function formatTime(date) {
  const diffMinutes = Math.round((Date.now() - new Date(date).getTime()) / 60000);
  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  return diffHours === 1 ? '1h ago' : `${diffHours}h ago`;
}

function App() {
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [newNotification, setNewNotification] = useState(initialForm);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((current) => {
        const next = incomingMessages[Math.floor(Math.random() * incomingMessages.length)];
        if (current.some((item) => item.id === next.id)) return current;

        return [
          {
            ...next,
            id: `${next.id}-${Date.now()}`,
            receivedAt: new Date(),
            read: false,
          },
          ...current,
        ];
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const counts = useMemo(
    () =>
      categories.reduce(
        (acc, { key }) => ({
          ...acc,
          [key]: key === 'all' ? notifications.length : notifications.filter((n) => n.category === key).length,
        }),
        {}
      ),
    [notifications]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const priorityNotifications = useMemo(
    () =>
      [...notifications]
        .sort((a, b) => {
          if (a.read !== b.read) return a.read ? 1 : -1;
          return new Date(b.receivedAt) - new Date(a.receivedAt);
        })
        .slice(0, 10),
    [notifications]
  );

  const filteredNotifications = useMemo(
    () =>
      notifications.filter((notification) => {
        const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;
        const query = search.toLowerCase();
        const matchesSearch =
          notification.title.toLowerCase().includes(query) ||
          notification.message.toLowerCase().includes(query) ||
          notification.stage.toLowerCase().includes(query);
        const matchesUnread = !showUnreadOnly || !notification.read;
        return matchesCategory && matchesSearch && matchesUnread;
      }),
    [notifications, categoryFilter, search, showUnreadOnly]
  );

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) => (notification.id === id ? { ...notification, read: true } : notification))
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  };

  const clearReadNotifications = () => {
    setNotifications((current) => current.filter((notification) => !notification.read));
  };

  const addNotification = () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) return;

    setNotifications((current) => [
      {
        ...newNotification,
        id: `local-${Date.now()}`,
        receivedAt: new Date(),
        read: false,
      },
      ...current,
    ]);
    setNewNotification(initialForm);
  };

  return (
    <main className="app">
      <section className="card dashboard-card">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Campus Notification Center</p>
            <h1>Stay On Track With Notifications</h1>
            <p className="subtitle">
              Live notifications are generated in the app.
            </p>
          </div>
          <div className="summary-box">
            <span>{unreadCount}</span>
            <p>Unread notifications</p>
          </div>
        </div>

        <div className="filters">
          {categories.map((item) => (
            <button
              key={item.key}
              className={categoryFilter === item.key ? 'active' : ''}
              onClick={() => setCategoryFilter(item.key)}
            >
              {item.label}
              <span>{counts[item.key] ?? 0}</span>
            </button>
          ))}
        </div>

        <div className="actions-row">
          <label className="search-box">
            Search notifications
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, stage, or message"
            />
          </label>
          <div className="action-buttons">
            <button onClick={() => setShowUnreadOnly((value) => !value)}>
              {showUnreadOnly ? 'Show all' : 'Show unread only'}
            </button>
            <button onClick={markAllAsRead}>Mark all read</button>
            <button onClick={clearReadNotifications}>Clear read</button>
          </div>
        </div>

        <div className="event-form card form-card">
          <h3>Add a new notification</h3>
          <div className="form-grid">
            <label>
              Category
              <select
                value={newNotification.category}
                onChange={(e) => setNewNotification({ ...newNotification, category: e.target.value })}
              >
                {categories.filter((c) => c.key !== 'all').map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Stage
              <input
                value={newNotification.stage}
                onChange={(e) => setNewNotification({ ...newNotification, stage: e.target.value })}
              />
            </label>
            <label>
              Title
              <input
                value={newNotification.title}
                onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
              />
            </label>
            <label>
              Message
              <input
                value={newNotification.message}
                onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
              />
            </label>
          </div>
          <button onClick={addNotification}>Send notification</button>
        </div>
      </section>

      <section className="card priority-card">
        <div className="priority-header">
          <div>
            <h2>Priority notification</h2>
            <p>Top 10 alerts sorted by unread status and recency.</p>
          </div>
          <span className="priority-badge">Top {priorityNotifications.length}</span>
        </div>

        <ul className="priority-list">
          {priorityNotifications.map((notification) => (
            <li key={notification.id} className={notification.read ? 'priority-item read' : 'priority-item unread'}>
              <button type="button" className="priority-content" onClick={() => markAsRead(notification.id)}>
                <div className="priority-meta">
                  <span className={`pill ${notification.category}`}>{notification.category}</span>
                  <span className="timestamp">{formatTime(notification.receivedAt)}</span>
                </div>
                <strong>{notification.title}</strong>
                <p>{notification.stage}</p>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="card notification-card">
        <div className="notification-header">
          <div>
            <h2>Notifications ({filteredNotifications.length})</h2>
            <p>Latest updates appear at the top. Click a notification to mark it read.</p>
          </div>
          <span className="badge">Live feed</span>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <p>No notifications match your current filters.</p>
          </div>
        ) : (
          <ul className="notification-list">
            {filteredNotifications.map((notification) => (
              <li key={notification.id} className={notification.read ? 'read' : 'unread'}>
                <div className="notification-meta">
                  <span className={`pill ${notification.category}`}>{notification.category}</span>
                  <span className="stage">{notification.stage}</span>
                  <span className="timestamp">{formatTime(notification.receivedAt)}</span>
                </div>
                <button type="button" className="notification-content" onClick={() => markAsRead(notification.id)}>
                  <strong>{notification.title}</strong>
                  <p>{notification.message}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
