import Link from "next/link";
import "./Customer.css";

type CustomerProps = {
  customer: any;
};

const Customer = ({ customer }: CustomerProps) => {
  return (
    <div key={customer.customer_id} className="customer">
      <p className={customer.current_tier}>{customer.customer_name}</p>
      <Link href={`./customer_info/${customer.customer_id}`}>
        <p>Customer Info</p>
      </Link>
      <Link href={`./customer_order_history/${customer.customer_id}`}>
        <p>Customer Orders</p>
      </Link>
    </div>
  );
};

export default Customer;
