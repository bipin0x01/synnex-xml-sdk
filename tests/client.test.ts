// import {
//   SynnexClient,
//   SynnexB2BRequest,
//   POStatusRequest,
//   CountryCode,
//   USWarehouseLocation,
//   DropShipFlag,
//   USShipMethodCode,
// } from "../src";
// import axios from "axios";
// import MockAdapter from "axios-mock-adapter";

// describe("SynnexClient", () => {
//   let mock: MockAdapter;
//   let client: SynnexClient;

//   beforeEach(() => {
//     mock = new MockAdapter(axios);
//     client = new SynnexClient(
//       "sandbox",
//       "US",
//       "username",
//       "password",
//       "123456",
//       "Example Company"
//     );
//   });

//   afterEach(() => {
//     mock.restore();
//   });

//   it("should submit a purchase order", async () => {
//     const poRequest: SynnexB2BRequest = {
//       Credential: {
//         UserID: "username",
//         Password: "password",
//         CustomerNumber: "123456",
//         CusomerName: "Example Company",
//       },
//       OrderRequest: {
//         CustomerNumber: "123456",
//         PONumber: "PO12345",
//         DropShipFlag: DropShipFlag.No,
//         Shipment: {
//           ShipFromWarehouse: USWarehouseLocation.FremontCA,
//           ShipTo: {
//             AddressName1: "Example Company",
//             AddressLine1: "123 Main St",
//             City: "City",
//             State: "State",
//             ZipCode: "12345",
//             Country: "US" as CountryCode,
//           },
//           ShipToContact: {
//             ContactName: "John Doe",
//             PhoneNumber: "123-456-7890",
//             EmailAddress: "john.doe@example.com",
//           },
//           ShipMethod: {
//             Code: USShipMethodCode.FedExGround,
//           },
//         },
//         Payment: {
//           BillTo: {
//             AddressName1: "Billing Company",
//             AddressLine1: "456 Another St",
//             City: "City",
//             State: "State",
//             ZipCode: "67890",
//             Country: "US" as CountryCode,
//           },
//         },
//         Items: [
//           {
//             LineNumber: "1",
//             SKU: "SKU123",
//             UnitPrice: 10.99,
//             OrderQuantity: 5,
//           },
//         ],
//       },
//     };

//     mock
//       .onPost("/po/submit")
//       .reply(200, "<OrderResponse><Code>Success</Code></OrderResponse>");

//     const response = await client.submitPO(poRequest);
//     expect(response.OrderResponse.Code).toBe("Success");
//   });

//   it("should get the order status", async () => {
//     const statusRequest: POStatusRequest = {
//       Credential: {
//         UserID: "username",
//         Password: "password",
//         CusomerName: "Example Company",
//         CustomerNumber: "123456",
//       },
//       OrderStatusRequest: {
//         CustomerNumber: "123456",
//         PONumber: "PO12345",
//       },
//     };

//     mock
//       .onPost("/po/status")
//       .reply(
//         200,
//         "<OrderStatusResponse><Code>Success</Code></OrderStatusResponse>"
//       );

//     const response = await client.getOrderStatus(statusRequest);
//     expect(response.OrderStatusResponse.Code).toBe("Success");
//   });
// });
