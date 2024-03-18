import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  console.log("Start complete_order");

  const bodyString = await request.text();

  const body = JSON.parse(bodyString);

  const insertedData = await complete_order(body);

  console.log("%cinsertedData:", "color:yellow", insertedData);

  return insertedData;
}

export type CompleteOrderArgs = {
  customerId: string;
  customerName: string;
  orderId: string;
  totalInCents: number;
  date: string;
};

export async function complete_order(completeOrderArgs: CompleteOrderArgs) {
  const customer_id = completeOrderArgs.customerId;
  const customer_name = completeOrderArgs.customerName;

  console.log("%ccustomerId:", "color:yellow", customer_id);
  console.log("%ccustomerName:", "color:yellow", customer_name);

  const customers = await sql`
      INSERT INTO customers (customer_id, customer_name)
      SELECT ${customer_id}, ${customer_name}
      WHERE NOT EXISTS (
          SELECT 1 FROM customers WHERE customer_id = ${customer_id}
      );
  `;

  //   const orders = await sql`
  //     INSERT INTO orders (customer_id, order_date, order_total_in_cents, order_other_id)
  //     SELECT '${completeOrderArgs.customerId}','${completeOrderArgs.date}', ${completeOrderArgs.totalInCents}, '${completeOrderArgs.orderId}'
  //     WHERE NOT EXISTS (
  //     SELECT 1 FROM orders WHERE order_other_id = '${completeOrderArgs.orderId}'
  // );
  // `;

  // return { customers, orders };
}
