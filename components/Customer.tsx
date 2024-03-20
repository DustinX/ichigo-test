import Link from "next/link";
import styles from "components/Customer.module.css";

type CustomerProps = {
  customer: any;
};

const Customer = ({ customer }: CustomerProps) => {
  return (
    <div key={customer.customer_id} className={styles.customer}>
      <p>{customer.customer_name}</p>
      <Link href={`./customer_info?customer_id=${customer.customer_id}`}>
        <p>Customer Info</p>
      </Link>
      <Link
        href={`./customer_order_history?customer_id=${customer.customer_id}`}
      >
        <p>Customer Orders</p>
      </Link>
    </div>
  );
};

export default Customer;
