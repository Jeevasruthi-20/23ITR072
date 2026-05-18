# Campus Notification App

This project includes:
- a React frontend built with Vite
- an Express notification API backend
- a priority box for top notifications and read/unread distinction

## Run locally

1. Install dependencies:
```bash
npm install
```

2. Start the API server:
```bash
npm run api
```

3. Start the frontend app in another terminal:
```bash
npm run dev
```

4. Open the app:
http://localhost:5173/

## Notification API endpoints

Base URL: `http://localhost:4000/api`

### GET /notifications
Returns all notifications, newest first.

### POST /notifications
Create a new notification.
Body (JSON):
```json
{
  "category": "placements",
  "stage": "Application Deadline",
  "title": "New placement alert",
  "message": "Submit your application by Friday."
}
```

### PATCH /notifications/:id/read
Mark a single notification as read.

### PATCH /notifications/read
Mark all notifications as read.

### DELETE /notifications/read
Delete all read notifications.

### GET /notifications/priority
Returns the top 10 notifications, unread first.

## Postman usage

1. Create a new collection in Postman.
2. Add a request for `GET http://localhost:4000/api/notifications`.
3. Add a request for `POST http://localhost:4000/api/notifications` and use JSON body.
4. Use `PATCH` and `DELETE` requests to update or clear notifications:
   - `PATCH http://localhost:4000/api/notifications/{id}/read`
   - `PATCH http://localhost:4000/api/notifications/read`
   - `DELETE http://localhost:4000/api/notifications/read`

The frontend will automatically fetch notifications from the API, so any changes made via Postman are immediately reflected in the app.
