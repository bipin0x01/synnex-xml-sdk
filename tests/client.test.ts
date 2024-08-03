import {
  CountryCode,
  DropShipFlag,
  SynnexB2BRequest,
  SynnexClient,
  USShipMethodCode,
  USWarehouseLocation,
} from "../src";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

describe("SynnexClient Basic Functionality", () => {
  let mock: MockAdapter;
  let client: SynnexClient;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    client = new SynnexClient({
      environment: "sandbox",
      country: "US",
      username: "test",
      password: "test",
      accountNumber: "test",
      accountName: "test",
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it("should create an instance of SynnexClient", () => {
    expect(client).toBeInstanceOf(SynnexClient);
  });

  it("should have a method to submit a purchase order", () => {
    expect(typeof client.submitPO).toBe("function");
  });

  it("should have a method to get order status", () => {
    expect(typeof client.getOrderStatus).toBe("function");
  });
});
