import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import Footer from "../components/Footer";
import Header from "../components/Header";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
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
          "ASMA Academy - Maths Masters is a comprehensive online learning platform designed to help students excel in mathematics. Our curriculum covers a wide range of topics, from basic arithmetic to advanced calculus, tailored to meet the needs of learners at all levels. With interactive lessons, practice exercises, and expert guidance, we empower students to build a strong foundation in math and achieve their academic goals.",
      },
      {
        name: "keywords",
        content:
          "ASMA Academy, Maths Masters, online learning, mathematics, interactive lessons, practice exercises, expert guidance, academic goals",
      },
      {
        name: "author",
        content: "ASMA Academy",
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
        <Header />
        {children}
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
        <Scripts />
      </body>
    </html>
  );
}
