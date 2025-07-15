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
  ErrorResponse,
  PriceAvailabilityApiResponse,
  SynnexFreightAPIResponse,
  SynnexFreightWithZipAPIResponse,
  SynnexInvoiceAPIResponse,
  SynnexB2BResponseSuccess,
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
  constructor(private config: SynnexClientConfig) {
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
   * Determine the base URL based on the environment, country, and API type.
   *
   * @param environment - The environment to use ('sandbox' or 'production').
   * @param country - The country code ('US' or 'CA').
   * @param apiType - The type of API being used ('default' or 'invoice').
   * @returns The base URL as a string.
   */
  private getBaseUrl(
    environment: "sandbox" | "production",
    country: CountryCode,
    apiType: "default" | "invoice" = "default"
  ): string {
    const urls = {
      sandbox: {
        default: {
          US: "https://testec.us.tdsynnex.com",
          CA: "https://testec.ca.tdsynnex.com",
        },
        invoice: {
          US: "https://testws.us.tdsynnex.com/webservice/invoice/query",
          CA: "https://testws.ca.tdsynnex.com/webservice/invoice/query",
        },
      },
      production: {
        default: {
          US: "https://ec.us.tdsynnex.com",
          CA: "https://ec.ca.tdsynnex.com",
        },
        invoice: {
          US: "https://ws.us.tdsynnex.com/webservice/invoice/query",
          CA: "https://ws.ca.tdsynnex.com/webservice/invoice/query",
        },
      },
    };
    return urls[environment][apiType][country];
  }

  /**
   * Submit a purchase order.
   *
   * @param request - The purchase order request data.
   * @returns A promise that resolves to the purchase order response.
   * @throws An error if the submission fails.
   */
  public async submitPO(
    request: SynnexB2BRequest
  ): Promise<SynnexB2BResponse | ErrorResponse> {
    try {
      const requestXml = this.xmlBuilder.buildCreatePORequestXml(request);
      const response = await this.axiosInstance.post(
        "/SynnexXML/PO",
        requestXml
      );
      const { orderResponse } = await parseXmlToJson(response.data);

      // TODO: hotfix for array iteration
      if (orderResponse.items) {
        if (Array.isArray(orderResponse.items)) {
          orderResponse.items = orderResponse.items.map((obj: any) => obj.item);
        } else {
          orderResponse.items = [
            orderResponse.items.item || orderResponse.items,
          ];
        }
      }

      if (orderResponse.errorDetail) {
        orderResponse.type = "error";
        return orderResponse as ErrorResponse;
      }
      orderResponse.type = "success";
      return orderResponse as SynnexB2BResponseSuccess;
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
  ): Promise<POStatusResponse | ErrorResponse> {
    try {
      const requestXml = this.xmlBuilder.buildStatusRequestXml(request);
      const response = await this.axiosInstance.post(
        "/SynnexXML/PO",
        requestXml
      );
      const result = await parseXmlToJson(response.data);

      if (result.errorDetail) {
        result.type = "error";
        return result as ErrorResponse;
      }
      result.type = "success";

      // TODO : hotfix for array iteration
      // Handle case where orderStatusResponse might not exist
      if (!result.orderStatusResponse) {
        result.orderStatusResponse = { items: [] };
      }

      // Handle case where items might not exist
      if (!result.orderStatusResponse.items) {
        result.orderStatusResponse.items = [];
      } else {
        // Normalize items to always be an array
        result.orderStatusResponse.items = Array.isArray(
          result.orderStatusResponse.items.item
        )
          ? result.orderStatusResponse.items.item
          : result.orderStatusResponse.items.item
          ? [result.orderStatusResponse.items.item]
          : [];

        // Ensure each item's packages.package is always an array
        result.orderStatusResponse.items = result.orderStatusResponse.items.map(
          (item: { packages?: any }) => {
            if (!item.packages) {
              item.packages = [];
            } else {
              item.packages = !item.packages.package
                ? []
                : Array.isArray(item.packages.package)
                ? item.packages.package
                : [item.packages.package];
            }
            return item;
          }
        );
      }

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to get PO status: ${error.message}`);
      }
      throw new Error("Failed to get PO status: Unknown error");
    }
  }

  /**
   * Retrieves the price and availability for a list of SKUs.
   *
   * @param skus - The list of SKUs to query price and availability for.
   * @returns A promise that resolves to the price and availability response or an error response.
   */
  public async getPriceAvailability(
    skus: string[]
  ): Promise<PriceAvailabilityApiResponse> {
    try {
      const requestXml = this.xmlBuilder.buildPriceAvailabilityRequestXml(skus);
      const { data } = await this.axiosInstance.post(
        "/SynnexXML/PriceAvailability",
        requestXml
      );
      const result = await parseXmlToJson(data);
      console.log(result);
      if (
        result.errorDetail ||
        result.priceAvailabilityList?.items?.item?.length === 0 ||
        result.priceAvailabilityList?.status === "Discontinued" ||
        result.priceAvailabilityList?.status === "Not found"
      ) {
        result.type = "error";
        return result as ErrorResponse;
      }
      result.type = "success";
      return result as PriceAvailabilityResponse;
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
  ): Promise<SynnexFreightAPIResponse> {
    try {
      const requestXml = this.xmlBuilder.buildFreightQuoteRequestXml(request);
      const response = await this.axiosInstance.post(
        "/SynnexXML/FreightQuote",
        requestXml
      );
      const result = await parseXmlToJson(response.data);
      if (result.errorDetail) {
        result.type = "error";
        return result as ErrorResponse;
      }
      result.type = "success";
      return result.freightQuoteResponse as FreightQuoteResponse;
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
  ): Promise<SynnexFreightWithZipAPIResponse> {
    try {
      const requestXml = this.xmlBuilder.buildFreightWithZipRequestXml(request);
      const response = await this.axiosInstance.post(
        "/SynnexXML/FreightQuote",
        requestXml
      );
      const result = await parseXmlToJson(response.data);
      if (result.errorDetail) {
        result.type = "error";
        return result as ErrorResponse;
      }
      result.type = "success";
      return result.freightQuoteResponse as FreightWithZipResponse;
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
  ): Promise<SynnexInvoiceAPIResponse> {
    try {
      const baseUrl = this.getBaseUrl(
        this.config.environment,
        this.config.country,
        "invoice"
      );
      const requestXml = this.xmlBuilder.buildInvoiceRequestXml(
        poNumber,
        orderNumber
      );
      const response = await this.axiosInstance.post(baseUrl, requestXml);

      const result = await parseXmlToJson(response.data);

      if (
        result.errorDetail ||
        result.invoiceResponse?.errorCode ||
        result.invoiceResponse?.errorReason
      ) {
        result.invoiceResponse = {
          type: "error",
          errorDetail:
            result.errorDetail ||
            result.invoiceResponse?.errorReason ||
            "Unknown error",
        };
        return result.invoiceResponse;
      }

      // Transform the response structure
      if (result.invoiceResponse?.invoice) {
        // Ensure invoice is an array
        const invoices = Array.isArray(result.invoiceResponse.invoice)
          ? result.invoiceResponse.invoice
          : [result.invoiceResponse.invoice];

        // Transform each invoice in the array
        result.invoiceResponse.invoice = invoices.map((invoice: any) => {
          // Convert items to array if it's not already
          if (invoice.items) {
            const items = invoice.items;
            invoice.items = Array.isArray(items.item)
              ? items.item
              : items.item
              ? [items.item]
              : [];

            // Normalize serialNo within each item
            invoice.items = invoice.items.map((item: any) => {
              if (item.serialNo) {
                item.serialNo = Array.isArray(item.serialNo)
                  ? item.serialNo
                  : [item.serialNo];
              }
              return item;
            });
          }

          // Transform tracking to trackingNumber array
          if (invoice.tracking?.trackNumber) {
            const trackNumbers = invoice.tracking.trackNumber;
            invoice.trackingNumbers = Array.isArray(trackNumbers)
              ? trackNumbers
              : trackNumbers.split(",").map((num: string) => num.trim());
            // Remove the old tracking object
            delete invoice.tracking;
          }

          return invoice;
        });
      }

      result.invoiceResponse.type = "success";
      return result.invoiceResponse;
    } catch (error: any) {
      throw new Error(`Failed to get invoice: ${error.message}`);
    }
  }
}

export default SynnexClient;
