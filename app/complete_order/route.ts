import { sql } from "@vercel/postgres";

export async function POST() {
  console.log("Start complete_order");

  // TODOd get this from api params
  const insertedData = complete_order({
    customerId: "123",
    customerName: "Taro Suzuki",
    orderId: "T123",
    totalInCents: 3450,
    date: "2022-03-04T05:29:59.850Z",
  });

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
  const customers = await sql`
    INSERT INTO customers (customer_id, customer_name)
    SELECT '${completeOrderArgs.customerId}', '${completeOrderArgs.customerName}'
    WHERE NOT EXISTS (
        SELECT 1 FROM customers WHERE customer_id = '${completeOrderArgs.customerId}'
    );
`;

  const orders = await sql`
    INSERT INTO orders (customer_id, order_date, order_total_in_cents, order_other_id)
    SELECT '${completeOrderArgs.customerId}','${completeOrderArgs.date}', ${completeOrderArgs.totalInCents}, '${completeOrderArgs.orderId}'
    WHERE NOT EXISTS (
    SELECT 1 FROM orders WHERE order_other_id = '${completeOrderArgs.orderId}'
);
`;

  return { customers, orders };
}
