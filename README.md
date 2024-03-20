---
name: Ichigo coding test
description: Dustin DeHaven's submission for the Ichigo coding test
framework: Next.js
css: vanilla
database: Vercel Postgres
demoUrl: https://ichigo-test.vercel.app/
---

# Ichigo coding test - Dustin DeHaven

## Demo

<https://ichigo-test.vercel.app/>

## How to start local

```bash
yarn dev
```

## API endpoints

### submit a completed order

<https://ichigo-test.vercel.app/api/complete_order>

```bash
curl -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
  "customerId": "3",
  "customerName": "Dustin 3",
  "orderId": "5",
  "totalInCents": 5000,
  "date": "2024-03-04T07:29:59.850Z"
}' \
 'https://ichigo-test.vercel.app/api/complete_order'
```

### get customer info

<http://localhost:3000/api/get_customer_info?customer_id=[customer_id]>

```bash
curl -i -X GET \
 'https://ichigo-test.vercel.app/api/get_customer_info?customer_id=1'
```

### get customer orders

<https://ichigo-test.vercel.app/api/get_customer_orders?customer_id=[customer_id]>

```bash
curl -i -X GET \
 'https://ichigo-test.vercel.app/api/get_customer_orders?customer_id=1'
```

### trigger recalculate tiers (used by cron job)

<https://ichigo-test.vercel.app/api/cron/recalculate_tiers>

```bash
curl -i -X GET \
   -H "Authorization:Bearer oiugualuyelrkjaslhfdkjahsdflkj" \
 'https://ichigo-test.vercel.app/api/cron/recalculate_tiers'
```

## Notes

### Tech stack

Backend storage is done using a PostgreSQL database.
The structure of the database is a 'customers' table and an 'orders' table, related via 'customer_id'.

The frontend framework is React / Next.js

The backend is also done using Next.js v14 'app routing', deployed via Vercel.

### Completed orders

A new customer will be added if the customer in the order does not already exist, based on the value of 'customer_id'

A new order will be added only if the order does not already exist, based on the value of 'order_other_id'

Recalculating tiers is done by a PostgreSQL function. This function is triggered by an insert into the 'orders' table, and operates only on the customer associated with the order.

There is another endpoint that recalculates all customers. This is triggered via a cron job at the start of each year. This endpoint requires authentication to successfully trigger.

### Other notes

The CSS styling is very simple. In a real project I would use a component library like MUI, and a CSS library like tailwind. The focus of this project for me was on functionality and clean code.

Edge cases are considered to some degree, but not exhaustively, for the sake of time.
