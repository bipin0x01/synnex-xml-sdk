import axios, { AxiosInstance } from "axios";
import { parseStringPromise } from "xml2js";
import {
  SynnexB2BRequest,
  SynnexB2BResponse,
  POStatusRequest,
  POStatusResponse,
  CountryCode,
} from "./types";

/**
 * Configuration options for the SynnexClient.
 */
interface SynnexClientConfig {
  environment: "sandbox" | "production";
  country: CountryCode;
  username: string;
  password: string;
  accountNumber: string;
  accountName: string;
}

/**
 * A client for interacting with the TD SYNNEX XML API.
 */
export class SynnexClient {
  private axiosInstance: AxiosInstance;
  private config: SynnexClientConfig;

  /**
   * Constructs a new instance of the SynnexClient.
   *
   * @param config - The configuration object for the client.
   */
  constructor(config: SynnexClientConfig) {
    this.config = config;
    const baseUrl = this.getBaseUrl(config.environment, config.country);
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }

  /**
   * Build XML for the credential part of the request.
   *
   * @returns The credential XML as a string.
   */
  private buildCredentialXml(): string {
    return `
      <Credential>
        <UserID>${this.config.username}</UserID>
        <Password>${this.config.password}</Password>
      </Credential>`;
  }

  /**
   * Determine the base URL based on the environment and country.
   *
   * @param environment - The environment to use ('sandbox' or 'production').
   * @param country - The country code ('US' or 'CA').
   * @returns The base URL as a string.
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
   *
   * @param request - The purchase order request data.
   * @returns The request XML as a string.
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
        ${this.buildCredentialXml()}
        <OrderRequest>
          <accountNumber>${this.config.accountNumber}</accountNumber>
          <PONumber>${request.OrderRequest.PONumber}</PONumber>
          <DropShipFlag>${request.OrderRequest.DropShipFlag}</DropShipFlag>
          <Shipment>
            <ShipFromWarehouse>${
              request.OrderRequest.Shipment.ShipFromWarehouse
            }</ShipFromWarehouse>
            <ShipTo>
              <AddressName1>${
                request.OrderRequest.Shipment.ShipTo.AddressName1
              }</AddressName1>
              <AddressLine1>${
                request.OrderRequest.Shipment.ShipTo.AddressLine1
              }</AddressLine1>
              <City>${request.OrderRequest.Shipment.ShipTo.City}</City>
              <State>${request.OrderRequest.Shipment.ShipTo.State}</State>
              <ZipCode>${request.OrderRequest.Shipment.ShipTo.ZipCode}</ZipCode>
              <Country>${request.OrderRequest.Shipment.ShipTo.Country}</Country>
            </ShipTo>
            <ShipToContact>
              <ContactName>${
                request.OrderRequest.Shipment.ShipToContact.ContactName
              }</ContactName>
              <PhoneNumber>${
                request.OrderRequest.Shipment.ShipToContact.PhoneNumber
              }</PhoneNumber>
              <EmailAddress>${
                request.OrderRequest.Shipment.ShipToContact.EmailAddress
              }</EmailAddress>
            </ShipToContact>
            <ShipMethod>
              <Code>${request.OrderRequest.Shipment.ShipMethod.Code}</Code>
            </ShipMethod>
          </Shipment>
          <Payment>
            <BillTo code=${this.config.accountNumber}>
              <AddressName1>${
                request.OrderRequest.Payment.BillTo.AddressName1
              }</AddressName1>
              <AddressLine1>${
                request.OrderRequest.Payment.BillTo.AddressLine1
              }</AddressLine1>
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
   *
   * @param request - The PO status request data.
   * @returns The status request XML as a string.
   */
  private buildStatusRequestXml(request: POStatusRequest): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <SynnexB2B>
        ${this.buildCredentialXml()}
        <OrderStatusRequest>
          <CustomerNumber>${this.config.accountNumber}</CustomerNumber>
          <PONumber>${request.PONumber}</PONumber>
        </OrderStatusRequest>
      </SynnexB2B>`;
  }

  /**
   * Submit a purchase order.
   *
   * @param request - The purchase order request data.
   * @returns A promise that resolves to the purchase order response.
   * @throws An error if the submission fails.
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
   *
   * @param request - The PO status request data.
   * @returns A promise that resolves to the purchase order status response.
   * @throws An error if the request fails.
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
