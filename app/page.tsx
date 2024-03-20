import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Table from "@/components/table";
import TablePlaceholder from "@/components/table-placeholder";

export const runtime = "edge";
export const preferredRegion = "home";

export default function Home() {
  return (
    <main>
      <Suspense fallback={<TablePlaceholder />}>
        <Table />
      </Suspense>

      <Link
        href="https://github.com/DustinX/ichigo-test"
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
