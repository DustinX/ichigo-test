import { sql } from "@vercel/postgres";
import RefreshButton from "./refresh-button";
import Customer from "components/Customer";

export type CustomerData = {
  rows: any[];
};

export default async function Table() {
  let data: CustomerData = { rows: [] };
  let startTime = Date.now();

  try {
    data = (await sql`
      SELECT 
        customer_id,
        customer_name,
        total_spent,
        current_tier
      FROM customers
    `) as CustomerData;
  } catch (e: any) {
    console.log(e);
  }

  const { rows: customers } = data;

  const duration = Date.now() - startTime;

  return (
    <div>
      <div>
        <h2>Customers</h2>
        <p>
          Fetched {customers.length} customers in {duration}ms
        </p>
        <RefreshButton />
      </div>
      <div>
        {customers.map((customer) => (
          <Customer key={customer.customer_id} customer={customer} />
        ))}
      </div>
    </div>
  );
}
