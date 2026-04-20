# ✅ Institute Registration Setup Guide

## Backend Status: ✅ RUNNING

**Backend Server:** Running on `http://localhost:5000`
- MongoDB Connected ✅
- CORS Enabled ✅
- Health Check: `GET /api/health`
- Registration Endpoint: `POST /api/institutes/register`
- List Institutes: `GET /api/institutes`

**Database:** `coaching_db` (MongoDB)
- Current Records: 5 institutes saved ✅

---

## Frontend Setup Required

### Step 1: Clear Frontend Cache
```bash
cd Frontend
# Kill the existing frontend if running
# Then clear node_modules and cache
rm -r node_modules
npm cache clean --force
npm install
```

### Step 2: Start Frontend
```bash
cd Frontend
npm start
# For Expo: expo start
# For Web: npm run web
```

### Step 3: Access Application

**For Mobile/Emulator:**
- Open Expo app
- Scan QR code or select device

**For Web/Laptop:**
- Browser will open at `http://localhost:8081` (or similar)
- Or manually open: `http://localhost:3000`

---

## How to Register an Institute

### Via Web Form (Laptop View):

1. Navigate to **Committee Dashboard**
2. Click **"＋ Register New Institute"** button
3. Fill in ALL required fields:
   - **Institute Name** (e.g., "Apex Academy")
   - **Location** (e.g., "Mumbai")
   - **Institute ID** (e.g., "INST-APEX-001") - MUST be unique
   - **Institute Password** (min 6 characters)
   - **Admin Name** (e.g., "Dr. Smith")
   - **Email** (e.g., "admin@apex.edu")
   - **Phone** (e.g., "9876543210")
   - **Modules** - Toggle student/teacher/parent/admin portals
   - **Join Date** (optional, format: DD-MM-YYYY)

4. Click **"Register"** button
5. Success message should appear: "✅ Institute registered successfully!"

---

## Troubleshooting

### Issue: "Network error" or "Could not reach backend server"

**Solution:**
1. Verify backend is running:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:5000/api/institutes" -Method Get
   ```
   Should return array of institutes (not an error)

2. Check browser console (F12) for any CORS errors
3. Restart frontend app completely:
   ```bash
   npm start
   ```

### Issue: Form doesn't submit

**Solution:**
1. Check that ALL fields are filled (no empty fields allowed)
2. Password must be at least 6 characters
3. Institute ID must be unique (not used before)
4. Check browser console (F12) for error messages
5. Look for red error alert showing which field is missing

### Issue: Data not appearing in database

**Solution:**
1. Check success message appeared after form submission
2. Verify via PowerShell:
   ```powershell
   $institutes = Invoke-RestMethod -Uri "http://localhost:5000/api/institutes" -Method Get
   $institutes | Where-Object {$_.name -eq "Your Institute Name"} | ConvertTo-Json
   ```

### Issue: "Institute ID already exists"

**Solution:**
- Each Institute ID must be unique
- Change the ID or clear it and generate a new one

---

## API Reference

### 1. Register New Institute
```
POST /api/institutes/register
Content-Type: application/json

{
  "name": "Institute Name",
  "location": "Location",
  "instituteId": "INST-UNIQUE-001",
  "institutePassword": "securepass123",
  "adminName": "Admin Name",
  "email": "admin@institute.edu",
  "phone": "9876543210",
  "joinDate": "2026-04-20",
  "modules": {
    "studentPortal": true,
    "teacherPortal": true,
    "parentPortal": false,
    "adminPortal": true
  }
}
```

### 2. Get All Institutes
```
GET /api/institutes

Response: Array of institute objects with all saved data
```

### 3. Admin Login
```
POST /api/institutes/admin-login

{
  "instituteId": "INST-UNIQUE-001",
  "institutePassword": "securepass123"
}

Response: Institute details if password matches
```

### 4. Health Check
```
GET /api/health

Response: {
  "status": "Server is running",
  "port": 5000,
  "timestamp": "2026-04-20T..."
}
```

---

## Database Schema

Each institute record is saved with this structure:

```json
{
  "_id": "MongoDB ObjectId (auto-generated)",
  "name": "string",
  "location": "string",
  "instituteId": "string (unique)",
  "institutePassword": "string",
  "joinDate": "ISO Date",
  "adminName": "string",
  "email": "string",
  "phone": "string",
  "modules": {
    "studentPortal": boolean,
    "teacherPortal": boolean,
    "parentPortal": boolean,
    "adminPortal": boolean
  },
  "createdAt": "ISO Date (auto-generated)",
  "updatedAt": "ISO Date (auto-generated)",
  "__v": 0
}
```

---

## What Changed

### Backend Improvements:
✅ CORS configuration updated to allow web requests
✅ Health check endpoint added (`GET /api/health`)
✅ Better error handling in registration route
✅ Explicit headers configuration

### Frontend Improvements:
✅ Added detailed debug logging for form submission
✅ Better error messages showing which fields are missing
✅ Password field now properly masked (shows dots)
✅ Added logging for API URL being used
✅ Enhanced API connectivity checks

### Validation Rules:
✅ All 7 fields required (name, location, ID, password, admin name, email, phone)
✅ Institute ID must be unique
✅ Password minimum 6 characters
✅ Email and phone validation on client-side
✅ Date parsing supports DD-MM-YYYY or ISO format

---

## Next Steps

1. **Restart Backend** (if not running):
   ```bash
   cd Backend
   node Server.js
   ```

2. **Restart Frontend** (required for code changes to take effect):
   ```bash
   cd Frontend
   npm start
   ```

3. **Test Registration**: Try registering an institute via the web form

4. **Monitor Logs**:
   - Backend terminal: Shows request/response logs
   - Browser Console (F12): Shows frontend logs and errors

5. **Verify Success**:
   - Check success alert message
   - Verify data in database via PowerShell or by fetching institutes list

---

## Support

If registration still isn't working:

1. Check backend terminal for error messages
2. Check browser console (F12) for CORS or connection errors
3. Verify API_BASE_URL is correct: `http://localhost:5000`
4. Ensure all form fields are filled completely
5. Try registering with a unique Institute ID (different from previous attempts)

