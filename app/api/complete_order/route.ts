import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.info("Start complete_order");

  try {
    const bodyString = await request.text();

    const body = JSON.parse(bodyString);

    const insertedData = await complete_order(body);

    return NextResponse.json({ insertedData }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ e }, { status: 500 });
  }
}

type CompleteOrderArgs = {
  customerId: string;
  customerName: string;
  orderId: string;
  totalInCents: number;
  date: string;
};

async function complete_order(completeOrderArgs: CompleteOrderArgs) {
  const customer_id = completeOrderArgs.customerId;
  const customer_name = completeOrderArgs.customerName;

  const customers = await sql`
      INSERT INTO customers (customer_id, customer_name)
      SELECT ${customer_id}, ${customer_name}
      WHERE NOT EXISTS (
          SELECT 1 FROM customers WHERE customer_id = ${customer_id}
      );
  `;

  const orders = await sql`
      INSERT INTO orders (customer_id, order_date, order_total_in_cents, order_other_id)
      SELECT ${completeOrderArgs.customerId},${completeOrderArgs.date}, ${completeOrderArgs.totalInCents}, ${completeOrderArgs.orderId}
      WHERE NOT EXISTS (
      SELECT 1 FROM orders WHERE order_other_id = ${completeOrderArgs.orderId}
  );
  `;

  // NOTE:  There is a SQL database function and trigger that runs whenever a new order is added, and recalculates the customer's "total spent" field.

  /**
   *   
    CREATE OR REPLACE FUNCTION update_customer_total_spent()
    RETURNS TRIGGER AS $$
    BEGIN
        -- Calculate the total spent 
        
        WITH spent_calculation AS (
          SELECT COALESCE(SUM(order_total_in_cents), 0) AS calculated_total_spent
          FROM orders
          WHERE customer_id = NEW.customer_id
          AND order_date >= date_trunc('year', CURRENT_DATE - INTERVAL '1 year') -- Orders after the start of LAST year
        ), spent_calculation_this_year AS (
          SELECT COALESCE(SUM(order_total_in_cents), 0) AS calculated_total_spent
          FROM orders
          WHERE customer_id = NEW.customer_id
          AND order_date >= date_trunc('year', CURRENT_DATE) -- Orders after the start of CURRENT year
        )
        
        -- Use calculated_total_spent to set field total_spent and determine current_tier 

        UPDATE customers
        SET total_spent = (SELECT calculated_total_spent FROM spent_calculation),
            total_spent_this_year = (SELECT calculated_total_spent FROM spent_calculation_this_year),
            current_tier = CASE
                WHEN (SELECT calculated_total_spent FROM spent_calculation) BETWEEN 0 AND 9999 THEN 'BRONZE'
                WHEN (SELECT calculated_total_spent FROM spent_calculation) BETWEEN 10000 AND 49999 THEN 'SILVER'
                WHEN (SELECT calculated_total_spent FROM spent_calculation) >= 50000 THEN 'GOLD'
            END
        WHERE customers.customer_id = NEW.customer_id;
        
        RETURN NEW;
        
    END;
    $$ LANGUAGE plpgsql;
   */

  /**
     
    CREATE TRIGGER trigger_update_customer_spent
    AFTER INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_total_spent();

    */

  return { customers: customers.rowCount, orders: orders.rowCount };
}
