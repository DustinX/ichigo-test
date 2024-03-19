import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Table from "@/components/table";
import TablePlaceholder from "@/components/table-placeholder";

export const runtime = "edge";
export const preferredRegion = "home";
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      <Link href="https://vercel.com/templates/next.js/postgres-starter">
        <p>Customer Info</p>
      </Link>
      <Suspense fallback={<TablePlaceholder />}>
        <Table />
      </Suspense>

      <Link
        href="https://github.com/vercel/examples/tree/main/storage/postgres-starter"
        className="flex items-center space-x-2"
      >
        <Image
          src="/github.svg"
          alt="GitHub Logo"
          width={24}
          height={24}
          priority
        />
        <p className="font-light">Source</p>
      </Link>
    </main>
  );
}
