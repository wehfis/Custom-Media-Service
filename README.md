# Custom Media Service
## Demo:


https://github.com/user-attachments/assets/1d3849a3-c32a-4cfd-93a6-127259e3a1ff


## Prerequisites
1. NVM installed (recommended node version 23)
2. yarn installed (```npm i yarn```)
3. PostgreSQL installed (recommended postgres version 17.*)
### optional
4. Postman installed (for better API testing, also ```Custom-Media-Service.postman_collection.json``` file attached to this repo with appropriate teesting data payload)

## Installation
1. **Clone Repository**
```
git clone https://github.com/wehfis/Custom-Media-Service.git
```
2. **Install dependencies**
```
yarn
```
3. **Configure ```.env``` file based on ```.env.samle```**
```
PORT=8000
DB_USER=db_user
DB_HOST=host
DB_NAME=db_name
DB_PASSWORD=password
DB_PORT=5432
S3_ACCESS_KEY=access_key
S3_SECRET_ACCESS_KEY=secret_access_key
S3_REGION=eu-north-1
S3_BUCKET_NAME=your_bucket_name
```
4. **Run migrations**
```
yarn migrate:run
```
5. **Run server**
```
yarn dev
```

## How to use the API
### API supports common HTTP methods (GET, POST, PUT, DELETE)
| Method | Endpoint          | Description                          |
|--------|-------------------|--------------------------------------|
| GET    | `/media`          | Get all media metadata               |
| GET    | `/media/:id`      | Get single media item with S3 URL    |
| POST   | `/media`          | Upload new file                      |
| PUT    | `/media/:id`      | Replace file (deletes original)      |
| DELETE | `/media/:id`      | Delete file                          |

Common status codes:

- `200` - Success
- `201` - Success (created)
- `400` - Invalid request
- `404` - Media not found
- `413` - File too large
- `500` - Server error
