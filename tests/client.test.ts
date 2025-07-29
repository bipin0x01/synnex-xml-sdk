import {
  POStatusRequest,
  SynnexB2BRequest,
  DropShipFlag,
  SynnexB2BResponse,
} from "../src/types";
import SynnexClient from "../src/client";
import dotenv from "dotenv";

dotenv.config();

const config = {
  environment: process.env.SYNNEX_ENVIRONMENT as "sandbox" | "production",
  country: process.env.SYNNEX_COUNTRY as "US" | "CA",
  username: process.env.SYNNEX_USERNAME || "",
  password: process.env.SYNNEX_PASSWORD || "",
  accountNumber: process.env.SYNNEX_ACCOUNT_NUMBER || "",
  accountName: process.env.SYNNEX_ACCOUNT_NAME || "",
};

describe("SynnexClient", () => {
  let client: SynnexClient;

  beforeEach(() => {
    client = new SynnexClient(config);
  });

  it(" should check order status of a valid PO", async () => {
    const request: POStatusRequest = {
      poNumber: "111-8807765-8985036",
    };

    const response = await client.getOrderStatus(request);

    expect(response).toBeDefined();
    expect(response.type).toBe("success");
  });

  it("should check price and availability of a valid SKU", async () => {
    const skus = ["6544282"];
    const response = await client.getPriceAvailability(skus);
    expect(response).toBeDefined();
    expect(response.type).toBe("success");
  });

  // check PA for a discontinued product
  it("should check price and availability of a discontinued SKU", async () => {
    const skus = ["3791326"];
    const response = await client.getPriceAvailability(skus);
    expect(response).toBeDefined();
    expect(response.type).toBe("error");
  });

  // not found product
  it("should check price and availability of a not found SKU", async () => {
    const skus = ["1234567890"];
    const response = await client.getPriceAvailability(skus);
    expect(response).toBeDefined();
    expect(response.type).toBe("error");
  });

  // it("should create PO", async () => {
  //   const request: SynnexB2BRequest = {
  //     OrderRequest: {
  //       customerNumber: "123456",
  //       poNumber: "111-8807765-8985036",
  //       dropShipFlag: DropShipFlag.No,
  //       shipment: {
  //         shipTo: {
  //           addressName1: "Test Company",
  //           addressLine1: "123 Test St",
  //           city: "Test City",
  //           state: "CA",
  //           zipCode: "12345",
  //           country: "US",
  //         },
  //       },
  //       items: [
  //         {
  //           sku: "6544282",
  //           unitPrice: 100.0,
  //           orderQuantity: 1,
  //           lineNumber: "1",
  //         },
  //       ],
  //     },
  //   };

  //   const response = await client.submitPO(request);
  //   expect(response).toBeDefined();
  //   expect(response.type).toBe("success");
  //   if (response.type === "error") {
  //     expect(response.errorDetail).toBeDefined();
  //   }
  // });

  it("retrieve invoice", async () => {
    const response = await client.getInvoice("295054788-7W0AN");

    expect(response).toBeDefined();
    expect(response.type).toBe("success");
  }, 10000);

  it("retrieve invoice with invalid PO number", async () => {
    const response = await client.getInvoice("113-1285573-0397898");
    expect(response).toBeDefined();
    expect(response.type).toBe("error");
  });
});
