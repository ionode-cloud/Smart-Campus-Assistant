# Smart Campus Assistant API Documentation

Base URL: `https://smartcampus-assist.api.ionode.cloud/api`

## 1. Campus Locations

### Get All Locations
- **Endpoint**: `GET /locations`
- **Query Params**: `type` (optional - academic, residential, sports, facility, entrance, landmark)
- **Description**: Returns all campus buildings and landmarks.

### Create New Location
- **Endpoint**: `POST /locations`
- **Body** (JSON):
```json
{
  "locationId": "block-d",
  "name": "Block D",
  "description": "Information about the building...",
  "departments": ["Department 1", "Department 2"],
  "timings": "9:00 AM to 5:00 PM",
  "type": "academic"
}
```

### Update Location
- **Endpoint**: `PUT /locations/:id`
- **Description**: Update a location using its `locationId` or MongoDB `_id`.

### Delete Location
- **Endpoint**: `DELETE /locations/:id`
- **Description**: Remove a location from the database.

---

## 2. Bus Schedules

### Get All Buses
- **Endpoint**: `GET /buses`
- **Description**: Returns all registered campus buses.

### Create New Bus
- **Endpoint**: `POST /buses`
- **Body** (JSON):
```json
{
  "busName": "Campus Bus 10",
  "busNumber": "OD-01-XX-9999",
  "startLocation": "Campus",
  "destination": "Market",
  "stops": ["Stop A", "Stop B"],
  "departureTime": "10:00 AM",
  "arrivalTime": "10:30 AM",
  "routePath": [
    {"lat": 20.2961, "lng": 85.8245},
    {"lat": 20.3000, "lng": 85.8300}
  ]
}
```

### Update Bus
- **Endpoint**: `PUT /buses/:id`
- **Description**: Update bus details using its MongoDB `_id`.

### Delete Bus
- **Endpoint**: `DELETE /buses/:id`
- **Description**: Remove a bus entry.

---

## How to send data (POST/PUT)

To send data through the API, you can use tools like **Postman** or **cURL**.

### Using Postman:
1. Set the method to **POST** or **PUT**.
2. Enter the URL (e.g., `https://smartcampus-assist.api.ionode.cloud/api/locations`).
3. Go to the **Headers** tab and add:
   - `Content-Type`: `application/json`
4. Go to the **Body** tab, select **raw**, and choose **JSON**.
5. Paste your data in JSON format and click **Send**.

### Using cURL:
```bash
curl -X POST https://smartcampus-assist.api.ionode.cloud/api/locations \
     -H "Content-Type: application/json" \
     -d '{
           "locationId": "demo-id",
           "name": "Demo Building",
           "description": "Example description",
           "type": "academic"
         }'
```
