## E-Commerce Project (Django + Angular)

Backend architecture is prepared for team collaboration with clear module boundaries and versioned APIs.

## Backend Architecture

`backend/`

- `config/` central project config and root routing
- `accounts/` auth and user domain
- `products/` product and catalog domain
- `cart/` cart domain
- `orders/` order domain
- `.env.example` shared environment template

## API Routing Convention

All backend APIs are exposed under:

- `/api/v1/health/`
- `/api/v1/accounts/...`
- `/api/v1/products/...`
- `/api/v1/cart/...`
- `/api/v1/orders/...`

Current health endpoints:

- `/api/v1/accounts/health/`
- `/api/v1/products/health/`
- `/api/v1/cart/health/`
- `/api/v1/orders/health/`

## Team Workflow

Each teammate can work independently inside one app (`accounts`, `products`, `cart`, `orders`) without touching global routing except when adding new top-level API modules.

Suggested branching:

- `main`: stable branch
- `develop`: integration branch
- `feature/accounts-*`
- `feature/products-*`
- `feature/cart-*`
- `feature/orders-*`

## Local Setup (Backend)

From `backend/`:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

## Environment Variables

Configured through `backend/.env`:

- `SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS`
- `CORS_ALLOW_ALL_ORIGINS`
- `DB_ENGINE`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`

## Notes

- `.gitignore` now ignores local venv, db, media, cache, and `.env`.
- Do not commit `backend/venv` or local secrets.