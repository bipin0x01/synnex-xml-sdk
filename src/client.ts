import axios, { AxiosInstance } from "axios";
import {
  SynnexB2BRequest,
  SynnexB2BResponse,
  POStatusRequest,
  POStatusResponse,
  CountryCode,
  PriceAvailabilityResponse,
  FreightQuoteRequest,
  FreightQuoteResponse,
  FreightWithZipRequest,
  FreightWithZipResponse,
  SynnexClientConfig,
} from "./types";
import { parseXmlToJson } from "./utils/parser";

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
   * Build XML for the price and availability request.
   *
   * @param skus - The array of SKUs.
   * @returns The request XML as a string.
   */
  private buildPriceAvailabilityRequestXml(skus: string[]): string {
    const skuListXml = skus
      .map(
        (sku, index) => `
        <skuList>
          <synnexSKU>${sku}</synnexSKU>
          <lineNumber>${index + 1}</lineNumber>
        </skuList>`
      )
      .join("");

    return `<?xml version="1.0" encoding="UTF-8" ?>
      <priceRequest>
        <customerNo>${this.config.accountNumber}</customerNo>
        <userName>${this.config.username}</userName>
        <password>${this.config.password}</password>
        ${skuListXml}
      </priceRequest>`;
  }

  /**
   * Build XML for the freight quote request.
   *
   * @param request - The freight quote request data.
   * @returns The request XML as a string.
   */
  private buildFreightQuoteRequestXml(request: FreightQuoteRequest): string {
    const itemsXml = request.items
      .map(
        (item) => `
        <Item lineNumber="${item.lineNumber}">
          <SKU>${item.SKU}</SKU>
          <MfgPartNumber>${item.mfgPartNumber}</MfgPartNumber>
          <Description>${item.description}</Description>
          <Quantity>${item.quantity}</Quantity>
        </Item>`
      )
      .join("");

    const shipToXml = `<ShipTo>
          <AddressName1>${request.shipTo.addressName1}</AddressName1>
          <AddressName2>${request.shipTo.addressName2 || ""}</AddressName2>
          <AddressLine1>${request.shipTo.addressLine1}</AddressLine1>
          <AddressLine2>${request.shipTo.addressLine2 || ""}</AddressLine2>
          <City>${request.shipTo.city}</City>
          <State>${request.shipTo.state}</State>
          <ZipCode>${request.shipTo.zipCode}</ZipCode>
          <Country>${request.shipTo.country}</Country>
        </ShipTo>`;
    return `<?xml version="1.0" encoding="UTF-8"?>
      <SynnexB2B>
        ${this.buildCredentialXml()}
        <FreightQuoteRequest version="${request.version}">
          <CustomerNumber>${request.customerNumber}</CustomerNumber>
          <CustomerName>${request.customerName}</CustomerName>
          <RequestDateTime>${request.requestDateTime}</RequestDateTime>
          <ShipFromWarehouse>${request.shipFromWarehouse}</ShipFromWarehouse>
          ${shipToXml}
          <ShipMethodCode>${request.shipMethodCode || ""}</ShipMethodCode>
          <ServiceLevel>${request.serviceLevel || ""}</ServiceLevel>
          <Items>${itemsXml}</Items>
        </FreightQuoteRequest>
      </SynnexB2B>`;
  }

  /**
   * Build XML for the freight quote request using zip code.
   *
   * @param request - The freight quote request data using zip code.
   * @returns The request XML as a string.
   */
  private buildFreightWithZipRequestXml(
    request: FreightWithZipRequest
  ): string {
    const itemsXml = request.items
      .map(
        (item, index) => `
        <Item lineNumber="${index}">
          <SKU>${item.SKU}</SKU>
          <Quantity>${item.quantity}</Quantity>
        </Item>`
      )
      .join("");

    return `<?xml version="1.0" encoding="UTF-8"?>
      <SynnexB2B>
        ${this.buildCredentialXml()}
        <FreightQuoteRequest version="${request.version}">
          <CustomerNumber>${this.config.accountNumber}</CustomerNumber>
          <CustomerName>${this.config.accountName}</CustomerName>
          <RequestDateTime>${new Date().toISOString()}</RequestDateTime>
          <ShipFromWarehouse>${request.shipFromWarehouse}</ShipFromWarehouse>
          <ShipToZipCode>${request.shipToZipCode}</ShipToZipCode>
          <Items>${itemsXml}</Items>
        </FreightQuoteRequest>
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
      const result = await parseXmlToJson(response.data);
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
      const result = await parseXmlToJson(response.data);
      return result;
    } catch (error: any) {
      throw new Error(`Failed to get PO status: ${error.message}`);
    }
  }

  /**
   * Get price and availability for a list of SKUs.
   *
   * @param request - The price and availability request data.
   * @returns A promise that resolves to the price and availability response.
   * @throws An error if the request fails.
   */
  public async getPriceAvailability(
    skus: string[]
  ): Promise<PriceAvailabilityResponse> {
    try {
      const requestXml = this.buildPriceAvailabilityRequestXml(skus);
      const response = await this.axiosInstance.post(
        "/SynnexXML/PriceAvailability",
        requestXml
      );
      const result = await parseXmlToJson(response.data);
      return result;
    } catch (error: any) {
      throw new Error(`Failed to get price and availability: ${error.message}`);
    }
  }

  /**
   * Get a freight quote.
   *
   * @param request - The freight quote request data.
   * @returns A promise that resolves to the freight quote response.
   * @throws An error if the request fails.
   */
  public async getFreightQuote(
    request: FreightQuoteRequest
  ): Promise<FreightQuoteResponse> {
    try {
      const fullRequest: FreightQuoteRequest = {
        ...request,
        version: "2.0",
        customerNumber: this.config.accountNumber,
        customerName: this.config.accountName,
        requestDateTime: new Date().toISOString(),
      };
      const requestXml = this.buildFreightQuoteRequestXml(fullRequest);
      const response = await this.axiosInstance.post(
        "/SynnexXML/FreightQuote",
        requestXml
      );
      const result = await parseXmlToJson(response.data);
      if (!result.freightquoteresponse) {
        throw new Error(result.errordetail);
      }
      return result.freightquoteresponse;
    } catch (error: any) {
      throw new Error(`Failed to get freight quote: ${error.message}`);
    }
  }

  /**
   * Get a freight quote using zip code.
   *
   * @param request - The freight quote request data using zip code.
   * @returns A promise that resolves to the freight quote response.
   * @throws An error if the request fails.
   */
  public async getFreightWithZip(
    request: Omit<
      FreightWithZipRequest,
      "customerNumber" | "customerName" | "requestDateTime" | "version"
    >
  ): Promise<FreightWithZipResponse> {
    try {
      // Automatically populate customer details and request time
      const fullRequest: FreightWithZipRequest = {
        ...request,
        version: "1.0",
        customerNumber: this.config.accountNumber,
        customerName: this.config.accountName,
        requestDateTime: new Date().toISOString(),
      };

      const requestXml = this.buildFreightWithZipRequestXml(fullRequest);
      const response = await this.axiosInstance.post(
        "/SynnexXML/FreightQuote",
        requestXml
      );
      const result = await parseXmlToJson(response.data);
      if (!result.freightQuoteResponse) {
        throw new Error(result.errorDetail);
      }
      return result.freightQuoteResponse;
    } catch (error: any) {
      throw new Error(
        `Failed to get freight quote with zip code: ${error.message}`
      );
    }
  }
}

export default SynnexClient;
