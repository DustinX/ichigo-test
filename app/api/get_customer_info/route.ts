import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.info("Start get_customer_info");

  const { searchParams } = new URL(request.url);

  const customer_id = searchParams.get("customer_id");

  if (!customer_id) {
    return NextResponse.json("customer_id not provided", { status: 400 });
  }

  try {
    const customerInfoRaw = await get_customer_info(customer_id);
    const customerInfo = customerInfoRaw.customer.rows;
    console.info("Complete get_customer_info");

    return NextResponse.json({ customerInfo }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ e }, { status: 500 });
  }
}

export async function get_customer_info(customer_id: string) {
  const customerInfo = await sql`
      SELECT 
        current_tier,
        
        date_trunc('year', CURRENT_DATE - INTERVAL '1 year') AT TIME ZONE 'UTC' AS date_cutoff,
        
        total_spent,
        
      CASE
        WHEN current_tier = 'BRONZE' THEN 10000 - total_spent
        WHEN current_tier = 'SILVER' THEN 50000 - total_spent
        WHEN current_tier = 'GOLD' THEN 0
      END  AS cents_till_next_tier,
      
      CASE
        WHEN current_tier = 'BRONZE' THEN 10000
        WHEN current_tier = 'SILVER' THEN 50000
        WHEN current_tier = 'GOLD' THEN 0
      END  AS next_tier_cents_required,
      
      CASE
        WHEN total_spent_this_year BETWEEN 0 AND 9999 THEN 'BRONZE'
        WHEN total_spent_this_year BETWEEN 10000 AND 49999 THEN 'SILVER'
        WHEN total_spent_this_year >= 50000 THEN 'GOLD'
      END  AS tier_next_year,
      
      (date_trunc('year', CURRENT_DATE + INTERVAL '1 year') - INTERVAL '1 second') AT TIME ZONE 'UTC' AS downgrade_date,
      
      CASE
        WHEN current_tier = 'BRONZE' THEN 5
        WHEN current_tier = 'SILVER' THEN GREATEST(10000 - total_spent_this_year, 0)
        WHEN current_tier = 'GOLD' THEN GREATEST(50000 - total_spent_this_year, 0)
      END AS cents_to_maintain_tier_next_year
      
      FROM customers
      WHERE customers.customer_id = ${customer_id};
  `;

  return { customer: customerInfo };
}
