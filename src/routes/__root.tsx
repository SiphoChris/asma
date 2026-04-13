import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import Header from "../components/Header";
import Footer from "../components/Footer";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import { getContext } from "../integrations/tanstack-query/root-provider";

import { QueryClientProvider } from "@tanstack/react-query";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "ASMA Academy - Maths Masters",
      },
      {
        name: "description",
        content:
          "ASMA Academy - Maths Masters is a comprehensive online learning platform designed to help students excel in mathematics.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  component: RootProviders,

  notFoundComponent: () => (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2">Page not found</p>
    </div>
  ),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased [wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootProviders() {
  const { queryClient } = getContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Header />

      <main className="min-h-screen px-4 md:px-42">
        <Outlet />
      </main>

      <Footer />

      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </QueryClientProvider>
  );
}
