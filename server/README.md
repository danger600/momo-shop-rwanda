# MOMO SHOP RWANDA API

Node.js + Express REST API with MongoDB and Mongoose.

## Requirements

- Node.js 22 or newer
- MongoDB Atlas database (or another MongoDB deployment)
- npm

## Local setup

1. Open the server folder in PowerShell.
2. Install the dependencies listed below.
3. Copy .env.example to .env.
4. Set MONGODB_URI, a random JWT_SECRET with at least 32 characters, and CLIENT_URL.
5. Create your first administrator with the one-time seed command.
6. Start the development API.

PowerShell commands:

    npm.cmd install
    npm.cmd install express mongoose cors helmet express-rate-limit dotenv bcryptjs jsonwebtoken zod
    npm.cmd install -D nodemon
    Copy-Item .env.example .env
    npm.cmd run seed:admin
    npm.cmd run dev

The API runs at http://localhost:5000.

## Initial endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | /api/health | Public | API and database health |
| POST | /api/auth/register | Public | Register a customer |
| POST | /api/auth/login | Public | Sign in |
| GET | /api/auth/me | Signed in | Current account |
| GET | /api/products | Public | List active products |
| GET | /api/products/:id | Public | Get an active product |
| POST | /api/products | Admin | Create a product |
| PATCH | /api/products/:id | Admin | Update a product |
| DELETE | /api/products/:id | Admin | Archive a product |

Protected routes require an Authorization header with a Bearer token.

## Product fields

- name, description, category
- priceRwf (integer, whole Rwandan francs)
- compareAtPriceRwf (optional integer or null)
- stockQuantity (optional non-negative integer)
- sku (optional unique stock code)
- images (optional array of image URLs)

Available categories: Electronics, Fashion, Home, Beauty, Other.

## Security notes

- Public registration always creates a customer. It cannot assign the admin role.
- Create the first administrator with the local seed script and private environment variables.
- Passwords are hashed with bcryptjs; password hashes are excluded from normal user queries.
- Authentication uses signed JWTs.
- Never commit .env or production secrets.
- Checkout and payment-provider integration are not active yet. Mobile-money payment options must remain sandbox/test until the provider approves live credentials.
