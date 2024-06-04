"use client";

import { Stack } from "@chakra-ui/react";
import { Header } from "./components/header";
import { Suspense } from "react";
import MenuSkeleton from "./components/menu/skeleton";

const Page: () => JSX.Element = () => {
  if (process.env.NODE_ENV === "development") {
    if (typeof window === "undefined") {
      (async () => {
        const { server } = await import("./mock/server");
        server.listen();
      })();
    } else {
      (async () => {
        const { worker } = await import("./mock/browser");
        worker.start();
      })();
    }
  }

  return (
    <>
      <Stack position="relative">
        <Header />
        <Suspense fallback={<MenuSkeleton />}></Suspense>
      </Stack>
    </>
  );
};

export default Page;
