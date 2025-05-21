import { POStatusRequest } from "../src/types";
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
});
