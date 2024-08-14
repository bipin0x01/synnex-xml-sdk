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
import SynnexXmlBuilder from "./utils/xmlBuilder";

/**
 * A client for interacting with the TD SYNNEX XML API.
 */
export class SynnexClient {
  private axiosInstance: AxiosInstance;
  private xmlBuilder: SynnexXmlBuilder;

  /**
   * Constructs a new instance of the SynnexClient.
   *
   * @param config - The configuration object for the client.
   */
  constructor(config: SynnexClientConfig) {
    this.xmlBuilder = new SynnexXmlBuilder(
      config.username,
      config.password,
      config.accountNumber,
      config.accountName
    );
    const baseUrl = this.getBaseUrl(config.environment, config.country);
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/xml",
      },
    });
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
   * Submit a purchase order.
   *
   * @param request - The purchase order request data.
   * @returns A promise that resolves to the purchase order response.
   * @throws An error if the submission fails.
   */
  public async submitPO(request: SynnexB2BRequest): Promise<SynnexB2BResponse> {
    try {
      const requestXml = this.xmlBuilder.buildCreatePORequestXml(request);
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
      const requestXml = this.xmlBuilder.buildStatusRequestXml(request);
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
   * @param skus - The list of SKUs to query price and availability for.
   * @returns A promise that resolves to the price and availability response.
   * @throws An error if the request fails.
   */
  public async getPriceAvailability(
    skus: string[]
  ): Promise<PriceAvailabilityResponse> {
    try {
      const requestXml = this.xmlBuilder.buildPriceAvailabilityRequestXml(skus);
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
      const requestXml = this.xmlBuilder.buildFreightQuoteRequestXml(request);
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
    request: FreightWithZipRequest
  ): Promise<FreightWithZipResponse> {
    try {
      const requestXml = this.xmlBuilder.buildFreightWithZipRequestXml(request);
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

  /**
   * Query invoices based on PO number or Order number.
   *
   * @param poNumber - The PO number to query the invoice.
   * @param orderNumber - The order number to query the invoice.
   * @returns A promise that resolves to the invoice details.
   * @throws An error if the request fails.
   */
  public async getInvoice(
    poNumber?: string,
    orderNumber?: string
  ): Promise<any> {
    try {
      const requestXml = this.xmlBuilder.buildInvoiceRequestXml(
        poNumber,
        orderNumber
      );
      const response = await this.axiosInstance.post(
        "/webservice/invoice/query",
        requestXml
      );
      const result = await parseXmlToJson(response.data);
      return result;
    } catch (error: any) {
      throw new Error(`Failed to get invoice: ${error.message}`);
    }
  }
}

export default SynnexClient;
