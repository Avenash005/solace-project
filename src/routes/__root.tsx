import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Solace — A safe space for your thoughts" },
      { name: "description", content: "Solace is a calming mental well-being sanctuary and emotional companion. Reflect, breathe, and feel heard." },
      { property: "og:title", content: "Solace — A safe space for your thoughts" },
      { property: "og:description", content: "Solace is a calming mental well-being sanctuary and emotional companion. Reflect, breathe, and feel heard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Solace — A safe space for your thoughts" },
      { name: "twitter:description", content: "Solace is a calming mental well-being sanctuary and emotional companion. Reflect, breathe, and feel heard." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b4f8162a-1ff4-4c02-9781-ca291548471d/id-preview-e4a1a681--b38b3f3d-89c1-4d9b-a5ac-1e6e74ff3bb6.lovable.app-1782665405116.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b4f8162a-1ff4-4c02-9781-ca291548471d/id-preview-e4a1a681--b38b3f3d-89c1-4d9b-a5ac-1e6e74ff3bb6.lovable.app-1782665405116.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@400;500;600&display=swap",
      },
    ],
    scripts: [
      {
        type: "text/javascript",
        children: `(function(d, t) { var v = d.createElement(t), s = d.getElementsByTagName(t)[0]; v.onload = function() { var saved = null; try { saved = JSON.parse(localStorage.getItem('solace.state.v1')); } catch(e) {} var moods = ["heavy", "tense", "steady", "light", "bright"]; var directives = ["Provide deep care, emotional validation, and supportive listening. Do not rush to fix problems; hold space and be incredibly gentle.", "Deliver high positivity, grounding exercises, and motivational reframes. Focus on relief, safety, and encouragement.", "Maintain an objective, grounded stance. Reflect on both positive aspects and slight real-world challenges (constructive realism).", "Respond with warmth and lighthearted energy. Focus on maintaining momentum and finding small moments of gratitude.", "Celebrate your energy. Prompt reflection on how to channel this positive state to overcome future challenges or share/give positive energy to others."]; var idx = saved && saved.mood !== undefined ? saved.mood : 3; var initialMood = moods[idx]; var initialEnergy = saved && saved.energy !== undefined ? saved.energy : 60; var initialDirective = directives[idx]; window.voiceflow.chat.load({ verify: { projectID: '6a41495a4ae39787070bd525' }, url: 'https://general-runtime.voiceflow.com', voice: { url: "https://runtime-api.voiceflow.com" }, assistant: { title: "Solace Guide", description: "Private AI Companion", color: "#5f8a75" }, launch: { event: { type: "launch", payload: { user_mood: initialMood, user_energy: initialEnergy, ai_directive: initialDirective } } } }); }; v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s); })(document, 'script');`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
