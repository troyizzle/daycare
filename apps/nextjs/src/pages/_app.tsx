// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { trpc } from "../utils/trpc";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <>
      <ClerkProvider {...pageProps}>
        <ThemeProvider attribute="class">
          <Component {...pageProps} />
        </ThemeProvider>
      </ClerkProvider>
      <Toaster />
    </>
  );
};

export default trpc.withTRPC(MyApp);
