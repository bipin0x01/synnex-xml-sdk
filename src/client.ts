import axios, { AxiosInstance } from "axios";
import { parseStringPromise } from "xml2js";
import {
  SynnexB2BRequest,
  SynnexB2BResponse,
  POStatusRequest,
  POStatusResponse,
  CountryCode,
} from "./types";

class SynnexClient {
  private axiosInstance: AxiosInstance;

  constructor(
    private environment: "sandbox" | "production",
    private country: CountryCode,
    private username: string,
    private password: string
  ) {
    const baseUrl = this.getBaseUrl(environment, country);
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }

  /**
   * Determine the base URL based on the environment and country.
   */
  private getBaseUrl(
    environment: "sandbox" | "production",
    country: CountryCode
  ): string {
    const urls = {
      sandbox: {
        US: "https://testec.us.tdsynnex.com",
        CA: "https://testec.ca.tdsynnex.com",
      },
      production: {
        US: "https://ec.us.tdsynnex.com",
        CA: "https://ec.ca.tdsynnex.com",
      },
    };
    return urls[environment][country];
  }

  /**
   * Build XML for the purchase order submission request.
   */
  private buildRequestXml(request: SynnexB2BRequest): string {
    const itemsXml = request.OrderRequest.Items.map(
      (item) => `
        <Item lineNumber="${item.LineNumber}">
          <SKU>${item.SKU}</SKU>
          <UnitPrice>${item.UnitPrice}</UnitPrice>
          <OrderQuantity>${item.OrderQuantity}</OrderQuantity>
        </Item>`
    ).join("");

    return `<?xml version="1.0" encoding="UTF-8"?>
      <SynnexB2B>
        <Credential>
          <UserID>${request.Credential.UserID}</UserID>
          <Password>${request.Credential.Password}</Password>
          <CustomerNumber>${request.Credential.CustomerNumber}</CustomerNumber>
        </Credential>
        <OrderRequest>
          <PONumber>${request.OrderRequest.PONumber}</PONumber>
          <DropShipFlag>${request.OrderRequest.DropShipFlag}</DropShipFlag>
          <Shipment>
            <ShipFromWarehouse>${request.OrderRequest.Shipment.ShipFromWarehouse}</ShipFromWarehouse>
            <ShipTo>
              <AddressName1>${request.OrderRequest.Shipment.ShipTo.AddressName1}</AddressName1>
              <AddressLine1>${request.OrderRequest.Shipment.ShipTo.AddressLine1}</AddressLine1>
              <City>${request.OrderRequest.Shipment.ShipTo.City}</City>
              <State>${request.OrderRequest.Shipment.ShipTo.State}</State>
              <ZipCode>${request.OrderRequest.Shipment.ShipTo.ZipCode}</ZipCode>
              <Country>${request.OrderRequest.Shipment.ShipTo.Country}</Country>
            </ShipTo>
            <ShipToContact>
              <ContactName>${request.OrderRequest.Shipment.ShipToContact.ContactName}</ContactName>
              <PhoneNumber>${request.OrderRequest.Shipment.ShipToContact.PhoneNumber}</PhoneNumber>
              <EmailAddress>${request.OrderRequest.Shipment.ShipToContact.EmailAddress}</EmailAddress>
            </ShipToContact>
            <ShipMethod>
              <Code>${request.OrderRequest.Shipment.ShipMethod.Code}</Code>
            </ShipMethod>
          </Shipment>
          <Payment>
            <BillTo>
              <AddressName1>${request.OrderRequest.Payment.BillTo.AddressName1}</AddressName1>
              <AddressLine1>${request.OrderRequest.Payment.BillTo.AddressLine1}</AddressLine1>
              <City>${request.OrderRequest.Payment.BillTo.City}</City>
              <State>${request.OrderRequest.Payment.BillTo.State}</State>
              <ZipCode>${request.OrderRequest.Payment.BillTo.ZipCode}</ZipCode>
              <Country>${request.OrderRequest.Payment.BillTo.Country}</Country>
            </BillTo>
          </Payment>
          <Items>${itemsXml}</Items>
        </OrderRequest>
      </SynnexB2B>`;
  }

  /**
   * Build XML for the purchase order status request.
   */
  private buildStatusRequestXml(request: POStatusRequest): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <SynnexB2B>
        <Credential>
          <UserID>${request.Credential.UserID}</UserID>
          <Password>${request.Credential.Password}</Password>
          <CustomerNumber>${request.Credential.CustomerNumber}</CustomerNumber>
        </Credential>
        <OrderStatusRequest>
          <PONumber>${request.OrderStatusRequest.PONumber}</PONumber>
        </OrderStatusRequest>
      </SynnexB2B>`;
  }

  /**
   * Submit a purchase order.
   */
  public async submitPO(request: SynnexB2BRequest): Promise<SynnexB2BResponse> {
    try {
      const requestXml = this.buildRequestXml(request);
      const response = await this.axiosInstance.post(
        "/SynnexXML/PO",
        requestXml
      );
      const result = await parseStringPromise(response.data);
      return result;
    } catch (error: any) {
      throw new Error(`Failed to submit PO: ${error.message}`);
    }
  }

  /**
   * Get the status of a purchase order.
   */
  public async getOrderStatus(
    request: POStatusRequest
  ): Promise<POStatusResponse> {
    try {
      const requestXml = this.buildStatusRequestXml(request);
      const response = await this.axiosInstance.post(
        "/SynnexXML/PO",
        requestXml
      );
      const result = await parseStringPromise(response.data);
      return result;
    } catch (error: any) {
      throw new Error(`Failed to get PO status: ${error.message}`);
    }
  }
}

export default SynnexClient;
