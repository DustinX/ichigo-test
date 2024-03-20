import React from "react";
import "./page.css";

async function getCustomerInfo(customer_id: string) {
  const urlPrefix = process.env.API_URL;

  const res = await fetch(
    `${urlPrefix}/api/get_customer_info?customer_id=${customer_id}`
  );
  // The return value is *not* serialized

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export type CustomerInfo = {
  customerInfo: {
    current_tier: string;
    date_cutoff: string;
    total_spent: number;
    cents_till_next_tier: number;
    next_tier_cents_required: number;
    tier_next_year: string;
    downgrade_date: string;
    cents_to_maintain_tier_next_year: number;
  }[];
};

export default async function CustomerInfoPage({
  params,
}: {
  params: { customer_id: string };
}) {
  const customer_id = params.customer_id;

  let data: CustomerInfo = { customerInfo: [] };

  try {
    data = await getCustomerInfo(customer_id);
  } catch (e: any) {
    console.error(e);
  }

  const customerInfo = data.customerInfo[0] || {};

  let percentToNextTier = 0;
  if (customerInfo.next_tier_cents_required === 0) {
    percentToNextTier = 100;
  } else {
    percentToNextTier = Math.round(
      (customerInfo.total_spent / customerInfo.next_tier_cents_required) * 100
    );
  }

  return (
    <div className="customer-info">
      <h2>Customer Information</h2>
      <ul>
        {Object.entries(customerInfo).map(([key, value]) => (
          <li key={key}>
            <strong>{key}: </strong>
            {value}
          </li>
        ))}
      </ul>
      <div className="progress-bar">
        <p>Progress towards next tier: {percentToNextTier}%</p>
        <div
          className="progress-bar-fill"
          style={{
            width: `${percentToNextTier}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
