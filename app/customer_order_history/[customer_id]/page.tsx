import React from "react";
import "./page.css";

export const dynamic = "force-dynamic"; // turn off caching for this page

async function getCustomerOrders(customer_id: string) {
  const urlPrefix = process.env.API_URL;

  const res = await fetch(
    `${urlPrefix}/api/get_customer_orders?customer_id=${customer_id}`
  );
  // The return value is *not* serialized

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export type CustomerOrders = {
  customerOrders: {
    order_other_id: string;
    order_date: string;
    order_total_in_cents: string;
  }[];
};

export default async function CustomerOrdersPage({
  params,
}: {
  params: { customer_id: string };
}) {
  const customer_id = params.customer_id;

  let data: CustomerOrders = { customerOrders: [] };

  try {
    data = await getCustomerOrders(customer_id);
  } catch (e: any) {
    console.error(e);
  }

  const customerOrders = data.customerOrders || [];

  return (
    <div className="customer-orders">
      <h2>Customer Orders</h2>
      <ul>
        {customerOrders.map((order, index) => (
          <li key={index}>
            <strong>order_other_id: </strong>
            {order.order_other_id}
            <br />
            <strong>order_date: </strong>
            {order.order_date}
            <br />
            <strong>order_total_in_cents: </strong>
            {order.order_total_in_cents}
          </li>
        ))}
      </ul>
    </div>
  );
}
