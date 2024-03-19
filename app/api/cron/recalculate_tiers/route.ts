import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const authHeader = req.headers.get("authorization");

  console.log("Start recalculate_tiers");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log("Unauthorized recalculate_tiers");

    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    recalculateTiers();

    console.log("Complete recalculate_tiers");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ e }, { status: 500 });
  }
}

export async function recalculateTiers() {
  const recalculateTiers = await sql`SELECT recalculate_customer_tiers();`;

  return recalculateTiers;
}

// NOTE:  There is a SQL database function for recalculating the customer tiers.  A SQL function was used to be able to use operations like "LOOP"

/**
 
CREATE OR REPLACE FUNCTION recalculate_customer_tiers()
RETURNS void AS $$
DECLARE
    customer_record RECORD;
BEGIN
    FOR customer_record IN SELECT DISTINCT customer_id FROM orders LOOP
        WITH spent_calculation AS (
            SELECT customer_id, SUM(order_total_in_cents) AS total_spent
            FROM orders
            WHERE customer_id = customer_record.customer_id
            AND order_date >= date_trunc('year', CURRENT_DATE) -- Considering orders from the start of the current year
            GROUP BY customer_id
        )
        UPDATE customers
        SET 
          total_spent = spent_calculation.total_spent,
          current_tier = CASE
            WHEN spent_calculation.total_spent BETWEEN 0 AND 9999 THEN 'BRONZE'
            WHEN spent_calculation.total_spent BETWEEN 10000 AND 49999 THEN 'SILVER'
            WHEN spent_calculation.total_spent >= 50000 THEN 'GOLD'
            ELSE current_tier -- In case no orders or calculation does not fit any tier
          END
        FROM spent_calculation
        WHERE customers.customer_id = spent_calculation.customer_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

 */
