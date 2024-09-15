import axios from "axios";
import {
  SynnexB2BRequest,
  POStatusRequest,
  FreightQuoteRequest,
  FreightWithZipRequest,
  SynnexClientConfig,
  DropShipFlag,
  USShipMethodCode,
  Address,
  Contact,
  Item,
  Payment,
  Shipment,
} from "../src/types";
import SynnexClient from "../src/client";
import dotenv from "dotenv";

dotenv.config();

const config: SynnexClientConfig = {
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

  it("should get the code of purchase order not found", async () => {
    const statusRequest: POStatusRequest = { poNumber: "PO12345" };

    const response = await client.getOrderStatus(statusRequest);
    expect(response).toBeDefined();
    expect(response.orderStatusResponse.poNumber).toBe("PO12345");
    expect(response.orderStatusResponse.code).toBe("not found");
  });

  it("should return Product PA data", async () => {
    const skus = ["3333964"];
    const response = await client.getPriceAvailability(skus);

    expect(response).toBeDefined();

    expect(response.type).toBe("success");

    if (response.type === "success") {
      expect(response.customerNo).toBeDefined();
      expect(response.customerNo).toBe(config.accountNumber);
      expect(response.priceAvailabilityList).toBeDefined();
    }
  });

  it("should return Product PA data of multiple SKU", async () => {
    const skus = ["3333964", "3333964"];
    const response = await client.getPriceAvailability(skus);

    expect(response).toBeDefined();

    expect(response.type).toBe("success");

    if (response.type === "success") {
      expect(response.customerNo).toBeDefined();
      expect(response.customerNo).toBe(config.accountNumber);
      expect(response.priceAvailabilityList).toBeDefined();
      expect(response.priceAvailabilityList.length).toBe(2);
    }
  });

  it("should return freight quote with zip", async () => {
    const request: FreightWithZipRequest = {
      shipToZipCode: "75001",
      shipFromWarehouse: "99",
      items: [
        {
          SKU: "9796463",
          quantity: 1,
          lineNumber: 1,
        },
      ],
    };

    const response = await client.getFreightWithZip(request);

    expect(response).toBeDefined();
    if (response.type === "success") {
      expect(response.customerNumber).toBeDefined();
      expect(response.availableShipMethods).toBeDefined();
    }
  });

  // it("should return invoice request", async () => {
  //   const request = {
  //     poNumber: "123456",
  //   };

  //   const response = await client.getInvoice(request.poNumber);

  //   expect(response).toBeDefined();
  //   console.log(response);
  //   if (response.type === "success") {
  //     console.log(response);
  //     expect(response.invoices).toBeDefined();
  //   }
  // });
});
