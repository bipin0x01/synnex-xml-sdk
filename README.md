# synnex-xml-sdk

[![npm version](https://img.shields.io/npm/v/synnex-xml-sdk.svg)](https://www.npmjs.com/package/synnex-xml-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue.svg)](https://www.typescriptlang.org/)

TypeScript Node.js SDK for the [TD SYNNEX XML API](https://www.synnexcorp.com/esolutions/xml/). Submit purchase orders, check order status, query price & availability, freight quotes, and invoices.

## Features

- Fully typed TypeScript API
- Sandbox and production environments
- US and Canada (`US` / `CA`) endpoints
- Purchase orders, order status, price & availability, freight quotes, and invoices

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [API reference](#api-reference)
- [Error handling](#error-handling)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install synnex-xml-sdk
# or
pnpm add synnex-xml-sdk
# or
yarn add synnex-xml-sdk
```

**Requirements:** Node.js 14+ (TypeScript recommended).

## Quick start

```typescript
import { SynnexClient, DropShipFlag } from "synnex-xml-sdk";

const client = new SynnexClient({
  environment: "sandbox",
  country: "US",
  username: process.env.SYNNEX_USERNAME!,
  password: process.env.SYNNEX_PASSWORD!,
  accountNumber: process.env.SYNNEX_ACCOUNT_NUMBER!,
  accountName: process.env.SYNNEX_ACCOUNT_NAME!,
});

const availability = await client.getPriceAvailability(["439866", "1058926"]);
console.log(availability);
```

## Configuration

| Option          | Type                         | Description                                      |
| --------------- | ---------------------------- | ------------------------------------------------ |
| `environment`   | `"sandbox" \| "production"`  | API environment                                  |
| `country`       | `"US" \| "CA"`               | Regional endpoint                                |
| `username`      | `string`                     | TD SYNNEX API username                           |
| `password`      | `string`                     | TD SYNNEX API password                           |
| `accountNumber` | `string`                     | Your TD SYNNEX customer / account number         |
| `accountName`   | `string`                     | Account name associated with your credentials    |

Store credentials in environment variables. Never commit secrets. See [`.env.example`](./.env.example) for local development.

### Environments

| Environment   | US base URL                         | CA base URL                         |
| ------------- | ----------------------------------- | ----------------------------------- |
| `sandbox`     | `https://testec.us.tdsynnex.com`    | `https://testec.ca.tdsynnex.com`    |
| `production`  | `https://ec.us.tdsynnex.com`        | `https://ec.ca.tdsynnex.com`        |

Invoice queries use a separate websocket host (`testws` / `ws`).

## API reference

### `submitPO(request)`

Submit a purchase order.

```typescript
import { DropShipFlag, SynnexB2BRequest } from "synnex-xml-sdk";

const orderRequest: SynnexB2BRequest = {
  OrderRequest: {
    customerNumber: "123456",
    poNumber: "PO-123456",
    dropShipFlag: DropShipFlag.No,
    shipment: {
      shipTo: {
        addressName1: "Customer Name",
        addressLine1: "123 Street",
        city: "CityName",
        state: "CA",
        zipCode: "12345",
        country: "US",
      },
      shipToContact: {
        contactName: "Contact Name",
        phoneNumber: "1234567890",
        emailAddress: "email@example.com",
      },
    },
    items: [
      {
        lineNumber: "1",
        sku: "SKU123",
        unitPrice: 10.0,
        orderQuantity: 2,
      },
    ],
  },
};

const response = await client.submitPO(orderRequest);

if (response.type === "success") {
  console.log(response.poNumber, response.items);
} else {
  console.error(response.errorDetail);
}
```

### `getOrderStatus(request)`

Check the status of an existing purchase order.

```typescript
const status = await client.getOrderStatus({ poNumber: "PO-123456" });

if (status.type === "success") {
  console.log(status.orderStatusResponse.items);
}
```

### `getPriceAvailability(skus)`

Query price and availability for one or more SKUs.

```typescript
const result = await client.getPriceAvailability(["439866", "1058926"]);

if (result.type === "success") {
  console.log(result.priceAvailabilityList);
}
```

### `getMfgPnBySku(sku)`

Resolve a manufacturer part number from a TD SYNNEX SKU. Throws if the SKU is missing, discontinued, or unauthorized.

```typescript
const mfgPn = await client.getMfgPnBySku("3162902");
console.log(mfgPn);
```

### `getFreightQuote(request)`

Get a freight quote for a full ship-to address.

```typescript
const quote = await client.getFreightQuote({
  version: "2.0",
  shipFromWarehouse: "503",
  shipTo: {
    addressName1: "Test Company",
    addressLine1: "Washington Street",
    city: "Brooklyn",
    state: "NY",
    zipCode: "11201",
    country: "US",
  },
  items: [{ lineNumber: 1, SKU: "7680599", quantity: 1 }],
});
```

### `getFreightWithZip(request)`

Get a freight quote using only a destination ZIP code.

```typescript
const quote = await client.getFreightWithZip({
  shipFromWarehouse: "503",
  shipToZipCode: "11201",
  items: [{ lineNumber: 1, SKU: "7680599", quantity: 1 }],
});
```

### `getInvoice(poNumber?, orderNumber?)`

Query invoice details by PO number and/or order number. Provide at least one identifier.

```typescript
const invoice = await client.getInvoice("207271512-ESXS");

if (invoice.type === "success") {
  console.log(invoice.invoice);
}
```

## Error handling

Most methods return a discriminated union with `type: "success" | "error"`. Network and transport failures throw.

```typescript
try {
  const response = await client.submitPO(orderRequest);

  if (response.type === "error") {
    console.error("API error:", response.errorDetail);
    return;
  }

  // response is typed as success here
  console.log(response.items);
} catch (error) {
  console.error("Request failed:", error);
}
```

## Development

```bash
git clone https://github.com/bipin0x01/synnex-xml-sdk.git
cd synnex-xml-sdk
npm install
cp .env.example .env   # fill in sandbox credentials
npm run build
npm test
```

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `npm run build`     | Compile TypeScript to `dist/`        |
| `npm test`          | Run Jest tests                       |
| `npm run lint`      | Lint `src/` with ESLint              |
| `npm run format`    | Format sources with Prettier         |

> Tests are live integration tests against the TD SYNNEX sandbox. They require valid credentials in `.env` and may take 30s+ per request.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, coding standards, and the pull request process. By participating, you agree to follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

- Bug reports and feature ideas: [open an issue](https://github.com/bipin0x01/synnex-xml-sdk/issues)
- Security concerns: see [SECURITY.md](./SECURITY.md)

### Releasing

Maintainers publish by tagging (not on every PR). See [Releasing](./CONTRIBUTING.md#releasing-maintainers): bump with `npm run release:patch|minor|major`, then `git push origin main --follow-tags`. The [Publish to npm](./.github/workflows/publish.yml) workflow publishes and creates a GitHub Release. Requires the `NPM_TOKEN` repository secret.

## Related

- Official TD SYNNEX XML docs: https://www.synnexcorp.com/esolutions/xml/
- npm package: https://www.npmjs.com/package/synnex-xml-sdk

## License

[MIT](./LICENSE) © Bipin Thapa
