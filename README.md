# Easy Travels Backend API

A complete backend API for travel management system with admin panel integration.

## Features

- **Authentication**: JWT-based admin authentication
- **CRUD Operations**: Complete CRUD for destinations, categories, itineraries, and enquiries
- **Email Notifications**: Automatic email sending for new enquiries
- **Validation**: Input validation for all endpoints
- **Error Handling**: Comprehensive error handling middleware
- **Database**: PostgreSQL with Prisma ORM
- **Admin Panel**: Integrated admin frontend

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Destinations
- `GET /api/destinations` - Get all destinations
- `POST /api/destinations` - Create destination (admin only)
- `PUT /api/destinations/:id` - Update destination (admin only)
- `DELETE /api/destinations/:id` - Delete destination (admin only)

### Itinerary
- `GET /api/itinerary/destination/:destinationId` - Get itinerary by destination
- `GET /api/itinerary/:id` - Get itinerary by ID
- `POST /api/itinerary` - Create itinerary (admin only)
- `PUT /api/itinerary/:id` - Update itinerary (admin only)
- `DELETE /api/itinerary/:id` - Delete itinerary (admin only)
- `PUT /api/itinerary/bulk/:destinationId` - Bulk update itinerary (admin only)

### Enquiries
- `POST /api/enquiry` - Submit enquiry (public)
- `GET /api/enquiry` - Get all enquiries (admin only)
- `DELETE /api/enquiry/:id` - Delete enquiry (admin only)

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

Update the following variables:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Generate a strong secret key
- `SMTP_*` - Email configuration for enquiries
- `CLOUDINARY_*` - Optional: for file uploads

### 3. Database Setup
```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Or run migrations
npm run prisma:migrate
```

### 4. Create Admin User
```bash
# Using Prisma Studio
npm run prisma:studio

# Or manually insert into database
```

### 5. Start Development Server
```bash
npm run dev
```

## Project Structure

```
src/
├── controllers/          # Route handlers
│   ├── adminController.js
│   ├── categoryController.js
│   ├── destinationController.js
│   ├── enquiryController.js
│   └── itineraryController.js
├── middleware/           # Custom middleware
│   ├── auth.js          # Authentication middleware
│   ├── validation.js    # Input validation
│   └── errorHandler.js  # Error handling
├── routes/              # API routes
│   ├── adminRoutes.js
│   ├── categoryRoutes.js
│   ├── destinationRoutes.js
│   ├── enquiryRoutes.js
│   └── itineraryRoutes.js
├── lib/                 # Utilities
│   └── prisma.js       # Prisma client
└── server.js           # Main server file
```

## Database Schema

The application uses the following main entities:
- **Admin**: Admin users with JWT authentication
- **Category**: Travel categories (e.g., Adventure, Beach, Cultural)
- **Destination**: Travel packages/trips with details
- **Itinerary**: Day-by-day plans for destinations
- **Enquiry**: Customer enquiries with email notifications

## Admin Panel

The admin panel is served from the `/admin` route and includes:
- Dashboard with statistics
- Destination management
- Category management
- Enquiry management
- Admin authentication

## Security Features

- JWT authentication for admin routes
- Input validation for all endpoints
- SQL injection prevention via Prisma ORM
- CORS configuration
- Error handling without exposing sensitive information

## Email Configuration

For enquiry notifications, configure SMTP settings in `.env`:
- Gmail: Use app-specific password
- Other providers: Update SMTP settings accordingly

## Development

```bash
# Start with auto-reload
npm run dev

# View database
npm run prisma:studio

# Generate Prisma client
npm run prisma:generate

# Reset database
npm run prisma:push --force-reset
```

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Configure production database URL
3. Set up proper CORS origins
4. Configure production email service
5. Use process manager like PM2

## License

MIT
