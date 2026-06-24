## Setup

```bash
# 1. Clone the repository
git clone https://github.com/Bhavika-Giyanani/CodeVimarsh-Backend

# 2. Install dependencies
npm install

# 3. Add the .env file
# Paste the .env file shared on the WhatsApp group into the backend/ root directory

# 4. Apply database migrations
npx prisma migrate deploy

# 5. Generate Prisma client
npx prisma generate

# 6. Seed the database
npx prisma db seed

# 7. Start the development server
npm run dev
```

Server runs at `http://localhost:5000`  
Swagger docs at `http://localhost:5000/api-docs`

For detailed documentation, see [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md)
