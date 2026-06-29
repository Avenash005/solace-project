# TanStack Start Project

A modern full-stack React application built with TanStack Start, featuring file-based routing, server-side rendering, and a comprehensive UI component library.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) - Full-stack React framework
- **UI Library**: React 19
- **Build Tool**: Vite 8
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Routing**: [TanStack Router](https://tanstack.com/router) - File-based routing
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Database/Auth**: [Supabase](https://supabase.com)
- **Form Handling**: React Hook Form + Zod
- **Code Quality**: ESLint + Prettier

## Project Structure

```
├── src/
│   ├── components/
│   │   └── ui/                 # shadcn/ui components
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── command.tsx
│   │       ├── context-menu.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── hover-card.tsx
│   │       ├── input-otp.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── sonner.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       └── tooltip.tsx
│   │
│   ├── hooks/
│   │   └── use-mobile.tsx      # Custom hooks (mobile detection)
│   │
│   ├── integrations/
│   │   └── supabase/           # Supabase integration
│   │       ├── auth-attacher.ts
│   │       ├── auth-middleware.ts
│   │       ├── client.server.ts  # Server-side client
│   │       ├── client.ts       # Client-side client
│   │       └── types.ts
│   │
│   ├── lib/
│   │   ├── utils.ts           # Utility functions (cn, twMerge)
│   │   ├── error-capture.ts   # Error handling
│   │   ├── error-page.ts     # Error page rendering
│   │   └── lovably-error-reporting.ts
│   │
│   ├── routes/                # File-based routing
│   │   ├── __root.tsx         # Root layout
│   │   ├── index.tsx          # Home route (/)
│   │   └── README.md          # Routing documentation
│   │
│   ├── router.tsx             # Router configuration
│   ├── routeTree.gen.ts       # Auto-generated route tree
│   ├── server.ts               # Server entry point
│   ├── start.ts               # Client start
│   └── styles.css            # Global styles
│
├── supabase/                   # Supabase configuration
│   └── config.toml
│
├── components.json              # shadcn/ui configuration
├── vite.config.ts             # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── eslint.config.js           # ESLint configuration
├── package.json             # Dependencies
└── README.md                # This file
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- Supabase project (for authentication)

### Installation

```bash
# Install dependencies
bun install
# or
npm install
```

### Environment Variables

Create a `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
# Start development server
bun run dev
# or
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
# Production build
bun run build
# or
npm run build

# Build for development
bun run build:dev
```

### Preview

```bash
# Preview production build
bun run preview
# or
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server |
| `build` | Build for production |
| `build:dev` | Build for development |
| `preview` | Preview production build |
| `lint` | Run ESLint |
| `format` | Format code with Prettier |

## Routing

This project uses **file-based routing** with TanStack Router. Routes are defined in `src/routes/`.

| File | URL |
|------|-----|
| `index.tsx` | `/` |
| `about.tsx` | `/about` |
| `users/index.tsx` | `/users` |
| `users/$id.tsx` | `/users/:id` (dynamic) |

For more details, see [src/routes/README.md](src/routes/README.md).

## UI Components

This project includes 40+ shadcn/ui components built on Radix UI primitives:

- **Layout**: Resizable panels, Scroll area, Sheet, Sidebar
- **Forms**: Input, Select, Textarea, Checkbox, Radio Group, Toggle, Input OTP
- **Navigation**: Breadcrumb, Menu bar, Navigation menu, Pagination, Tabs
- **Feedback**: Alert, Alert dialog, Progress, Toast (Sonner), Tooltip
- **Data Display**: Avatar, Badge, Calendar, Card, Table, Skeleton
- **Overlays**: Dialog, Dropdown menu, Hover card, Popover, Tooltip
- **Media**: Aspect ratio, Carousel, Chart
- **Actions**: Accordion, Collapsible, Switch, Toggle, Button

### Using UI Components

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## Supabase Integration

The project includes built-in Supabase authentication integration:

- `src/integrations/supabase/client.ts` - Client-side Supabase client
- `src/integrations/supabase/client.server.ts` - Server-side Supabase client
- `src/integrations/supabase/auth-middleware.ts` - Authentication middleware
- `src/integrations/supabase/auth-attacher.ts` - Auth attachment utility

## Error Handling

Server-side errors are captured and displayed via custom error pages:

- `src/lib/error-capture.ts` - Error capturing utilities
- `src/lib/error-page.ts` - Error page rendering

## License

Private - All rights reserved.
