// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { trpc } from "../utils/trpc";
import { Toaster } from "@/components/ui/toaster";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <>
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
      <Toaster />
    </>
  );
};

export default trpc.withTRPC(MyApp);
