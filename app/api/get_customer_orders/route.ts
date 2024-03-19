import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log("Start get_customer_orders");

  const { searchParams } = new URL(request.url);

  const customer_id = searchParams.get("customer_id");

  if (!customer_id) {
    return NextResponse.json("customer_id not provided", { status: 400 });
  }

  try {
    const customerOrdersRaw = await get_customer_orders(customer_id);
    const customerOrders = customerOrdersRaw.customer.rows;
    console.log("Complete get_customer_orders");
    console.log(customerOrders);

    return NextResponse.json({ customerOrders }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ e }, { status: 500 });
  }
}

export async function get_customer_orders(customer_id: string) {
  const customerOrders = await sql`
      SELECT
        order_other_id,
        order_date,
        order_total_in_cents
      FROM orders
      WHERE orders.customer_id = ${customer_id}
      AND order_date >= date_trunc('year', CURRENT_DATE - INTERVAL '1 year') -- Orders after the start of LAST year
  `;

  return { customerOrders };
}
