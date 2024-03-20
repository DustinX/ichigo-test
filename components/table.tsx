import { sql } from "@vercel/postgres";
import RefreshButton from "./refresh-button";

export type CustomerData = {
  rows: any[];
};

export default async function Table() {
  let data: CustomerData = { rows: [] };
  let startTime = Date.now();

  try {
    data = (await sql`
      SELECT 
        customer_name,
        total_spent,
        current_tier
      FROM customers
    `) as CustomerData;
  } catch (e: any) {
    console.log(e);
  }

  console.log("%cdata:", "color:yellow", data);

  const { rows: customers } = data;
  const duration = Date.now() - startTime;

  return (
    <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <h2>Customers</h2>
        <p>
          Fetched {customers.length} customers in {duration}ms
        </p>
        <RefreshButton />
      </div>
      <div className="divide-y divide-gray-900/5">
        {customers.map((customer) => (
          <div
            key={customer.name}
            className="flex items-center justify-between py-3"
          >
            <div className="space-y-1">
              <p className="font-medium leading-none">
                {customer.customer_name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
