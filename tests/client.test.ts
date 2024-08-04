import { SynnexClient, SynnexClientConfig } from "../src"; // Adjust the import path as necessary
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

describe("getFreightQuoteWithZipcode", () => {
  it("should return the expected response from getFreightWithZip", async () => {
    const synnexClient = new SynnexClient(config);

    const data = {
      shipFromWarehouse: "50",
      shipToZipCode: "75001",
      items: [
        {
          lineNumber: 1,
          SKU: "2426708",
          quantity: 1,
        },
      ],
    };

    const response = await synnexClient.getFreightWithZip(data);
    console.log("Response:", response);

    // Add assertions to validate the response
    expect(response.availableShipMethods).toHaveProperty("availableShipMethod");
    expect(response.availableShipMethods.availableShipMethod).toBeInstanceOf(
      Array
    );
    expect(response.customerNumber).toBe("780980");
  });
});
