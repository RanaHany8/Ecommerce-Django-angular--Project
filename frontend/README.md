# E-Commerce (Person 2 Scope) - Django + Angular

This project is now focused **only** on Person 2 requirements:

- Categories
- Product listing
- Product details
- Product images
- Price and stock availability
- Search
- Filters
- Pagination

Project structure:

- `backend/` Django + DRF APIs
- `frontend/` Angular UI

## Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py seed_data
python manage.py createsuperuser
python manage.py runserver
```

Backend URL: `http://127.0.0.1:8000`
Admin URL: `http://127.0.0.1:8000/admin`

### Available APIs

- `GET /api/categories/`
- `GET /api/categories/<slug>/`
- `GET /api/products/`
- `GET /api/products/<id>/`

### Products endpoint query parameters

- `search=<text>` search in product name, description, category name
- `category=<category_id>`
- `min_price=<number>`
- `max_price=<number>`
- `in_stock=true`
- `ordering=price | -price | created_at | -created_at | stock | -stock | name`
- `page=<number>`

## Frontend setup

```bash
cd frontend
npm install
npm start
```

Frontend URL: `http://localhost:4200`

## Run full project together

Open two terminals.

Terminal A:
```bash
cd backend
source .venv/bin/activate
python manage.py runserver
```

Terminal B:
```bash
cd frontend
npm start
```

Then open `http://localhost:4200`.

## What you should see

1. Home page with product cards.
2. Filter panel with:
   - search
   - category filter
   - min/max price
   - in-stock toggle
   - sorting
3. Pagination controls (Prev/Next).
4. Click `View Details` opens full product details page with image gallery, description, category, price, and stock.

## Demo flow for presentation

1. Start with all products.
2. Search by keyword.
3. Apply category and price filters.
4. Switch sort order (price low/high).
5. Enable `in stock only`.
6. Open one product details page and show multi-image gallery.
