# EagleFier — Furniture E-Commerce Platform

Full-stack furniture store with Spring Boot backend and Angular 17 frontend.

---

## Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Backend    | Java 17, Spring Boot 3.2           |
| Database   | PostgreSQL                         |
| ORM        | Spring Data JPA / Hibernate        |
| Security   | Spring Security + JWT              |
| Frontend   | Angular 17 (standalone components) |
| Orders     | WhatsApp (wa.me deep link)         |

---

## Quick Start

### 1. Database
```sql
CREATE DATABASE ecommerce_db;
```

Update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_PASSWORD
```

### 2. Backend (IntelliJ)
1. **File → Open** → select `backend/` folder
2. Wait for Maven to import (bottom progress bar)
3. **Settings → Build → Compiler → Annotation Processors → ✓ Enable** (for Lombok)
4. Open `EcommerceApplication.java` → click ▶ Run
5. API starts at `http://localhost:8080`

### 3. Frontend
```bash
cd frontend
npm install
ng serve
# Opens at http://localhost:4200
```

---

## WhatsApp Number Setup

Edit this line in `product-modal.component.ts`:
```typescript
private waNumber = '35699000001';  // ← replace with your number (no + or spaces)
```

---

## Creating an Admin User
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

---

## Navigation Structure

| Group     | Subcategories                                                                          |
|-----------|----------------------------------------------------------------------------------------|
| Indoor    | Sofas & Corners, Indoor Chairs & Armchairs, Chair + Table Sets, Beds, Office, Shelves & Sideboards, Tables, Coffee Tables, Barstools |
| Outdoor   | Outdoor Sets, Chairs & Armchairs, Bar Stools, Beach                                   |
| Lighting  | (browse all lighting)                                                                  |
| Boho Décor | (browse all boho)                                                                     |

Categories in the database must have their `groupName` set to `INDOOR`, `OUTDOOR`, `LIGHTING`, or `BOHO` to appear in the correct dropdown.

---

## Product Fields

| Field              | Purpose                                      |
|--------------------|----------------------------------------------|
| `name`             | Product title                                |
| `description`      | Full description shown in modal              |
| `price`            | Displayed in EUR                             |
| `imageUrl`         | Primary product image                        |
| `additionalImages` | Comma-separated extra image URLs (gallery)   |
| `availableColors`  | Comma-separated colour options (chips)       |
| `availableMaterials` | Comma-separated material options            |
| `dimensions`       | Free text, e.g. `W:200cm H:85cm D:95cm`     |
| `featured`         | Shows on homepage featured section           |

---

## API Reference

### Public
```
GET  /api/products?group=INDOOR&page=0&size=12
GET  /api/products/featured
GET  /api/products/{id}
GET  /api/categories?group=INDOOR
POST /api/auth/register
POST /api/auth/login
```

### Admin (requires ADMIN JWT)
```
POST   /api/admin/products
PUT    /api/admin/products/{id}
DELETE /api/admin/products/{id}
POST   /api/admin/categories
PUT    /api/admin/categories/{id}
DELETE /api/admin/categories/{id}
```
