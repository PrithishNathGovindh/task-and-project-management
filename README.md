# TaskFlow

Premium task and project management platform inspired by Notion, Trello, and ClickUp.

## Frontend Commands

```bash
npm install
npm run dev
```

## Backend Commands

```bash
mvn spring-boot:run
```

The backend runs on `http://localhost:8080`.

## Production Checks

```bash
npm run build
mvn -DskipTests package
```

## Frontend Dependencies

- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Framer Motion
- React Icons
- Shadcn-style UI primitives with Radix Slot, CVA, clsx, and tailwind-merge

## Backend Dependencies

- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data MongoDB
- Validation
- Lombok

## Frontend Routes

- `/` - Landing page
- `/login` - Login UI
- `/register` - Registration UI
- `/dashboard` - Protected dashboard placeholder
- `/projects` - Protected projects placeholder
- `/tasks` - Protected tasks placeholder
- `/profile` - Protected profile placeholder
- `*` - Not found page

## Auth APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Project Structure

```text
src/
  assets/
  components/
    AnimatedBlob/
    Button/
    FeatureCard/
    FloatingTaskCard/
    Footer/
    HeroSection/
    Navbar/
    ui/
  context/
  data/
  hooks/
  layouts/
  main/
    java/com/taskflow/
      config/
      controller/
      dto/
      exception/
      model/
      repository/
      security/
      service/
      service/impl/
      util/
    resources/
  pages/
    DashboardPlaceholder/
    LandingPage/
    Login/
    NotFound/
    Register/
  routes/
  services/
  utils/
  App.jsx
  index.css
  main.jsx
```

## Completed Scope

Sprint 1 includes the premium responsive landing, login, register, theme persistence, animated gradient blobs, Framer Motion transitions, reusable components, and React Router configuration.

Sprint 2 adds Spring Boot authentication, MongoDB persistence, BCrypt password hashing, JWT-protected APIs, Axios integration, route protection, logout, loading states, frontend validation, and toast notifications.
