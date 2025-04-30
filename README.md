# Synnex XML SDK Documentation

## Overview

The `SynnexClient` class provides a simple interface to interact with the TD SYNNEX XML API. It allows users to submit purchase orders and check the status of existing orders through the API.

## Installation

To use the `SynnexClient`, first install the SDK package:

```bash
npm install synnex-xml-sdk
```

## Usage

### Importing the Client

To use the `SynnexClient`, import it from the package:

```typescript
import { SynnexClient } from "synnex-xml-sdk";
```

### Creating an Instance

Create an instance of `SynnexClient` by providing the necessary configuration options. These options include the environment, country, and authentication credentials.

#### Configuration Options

- `environment`: Specifies the environment to use (`"sandbox"` or `"production"`).
- `country`: The country code (`"US"` or `"CA"`).
- `username`: Your API username.
- `password`: Your API password.
- `accountNumber`: Your account number with SYNNEX.
- `accountName`: The name associated with your SYNNEX account.

### Example: Creating an Instance

```typescript
const synnexClient = new SynnexClient({
  environment: "sandbox",
  country: "US",
  username: "your-username",
  password: "your-password",
  accountNumber: "your-account-number",
  accountName: "Your Account Name",
});
```

### Submitting a Purchase Order

To submit a purchase order, use the `submitPO` method. This method requires a `SynnexB2BRequest` object containing the order details.

#### Example: Submitting a Purchase Order

```typescript
const orderRequest = {
  OrderRequest: {
    PONumber: "PO123456",
    DropShipFlag: "N",
    Shipment: {
      ShipFromWarehouse: "WarehouseCode",
      ShipTo: {
        AddressName1: "Customer Name",
        AddressLine1: "123 Street",
        City: "CityName",
        State: "StateCode",
        ZipCode: "12345",
        Country: "US",
      },
      ShipToContact: {
        ContactName: "Contact Name",
        PhoneNumber: "1234567890",
        EmailAddress: "email@example.com",
      },
      ShipMethod: {
        Code: "UPS",
      },
    },
    Payment: {
      BillTo: {
        AddressName1: "Billing Name",
        AddressLine1: "456 Billing St",
        City: "BillingCity",
        State: "BillingState",
        ZipCode: "67890",
        Country: "US",
      },
    },
    Items: [
      {
        LineNumber: 1,
        SKU: "SKU123",
        UnitPrice: 10.0,
        OrderQuantity: 2,
      },
    ],
  },
};

async function submitOrder() {
  try {
    const response = await synnexClient.submitPO(orderRequest);
  } catch (error) {
    console.error("Error submitting order:", error);
  }
}

submitOrder();
```

### Checking Purchase Order Status

To check the status of a purchase order, use the `getOrderStatus` method. This method requires a `POStatusRequest` object containing the purchase order number.

#### Example: Checking Purchase Order Status

```typescript
async function checkOrderStatus() {
  try {
    const statusResponse = await synnexClient.getOrderStatus("");
  } catch (error) {
    console.error("Error retrieving order status:", error);
  }
}

checkOrderStatus();
```

#### Example: Checking Price and Availability of given SKU

```typescript
async function checkPriceAvailability() {
  const skus = ["439866", "1058926"];

  try {
    const priceAvailabilityResponse = await synnexClient.getPriceAvailability(
      skus
    );
  } catch (error) {
    console.error("Error fetching price and availability:", error);
  }
}

checkPriceAvailability();
```

## Environment Configuration

You can switch between the sandbox and production environments using the `environment` option in the configuration. Here are examples for both environments:

### Sandbox Environment

```typescript
const sandboxClient = new SynnexClient({
  environment: "sandbox",
  country: "US",
  username: "sandbox-username",
  password: "sandbox-password",
  accountNumber: "sandbox-account-number",
  accountName: "Sandbox Account",
});
```

### Production Environment

```typescript
const productionClient = new SynnexClient({
  environment: "production",
  country: "US",
  username: "production-username",
  password: "production-password",
  accountNumber: "production-account-number",
  accountName: "Production Account",
});
```

## Conclusion

This SDK provides a straightforward interface for interacting with the TD SYNNEX XML API. Ensure you have the correct credentials and environment setup to use the client effectively. For more detailed information on request and response structures, please refer to the [official TD SYNNEX API documentation](https://www.synnexcorp.com/esolutions/xml/).
