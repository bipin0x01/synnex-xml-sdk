import {
  SynnexB2BRequest,
  POStatusRequest,
  FreightQuoteRequest,
  FreightWithZipRequest,
} from "../types";

/**
 * Utility class for building XML requests for the SynnexClient.
 */
export class SynnexXmlBuilder {
  private username: string;
  private password: string;
  private accountNumber: string;
  private accountName: string;

  /**
   * Constructs a new instance of the SynnexXmlBuilder.
   *
   * @param username - The Synnex API username.
   * @param password - The Synnex API password.
   * @param accountNumber - The Synnex account number.
   * @param accountName - The Synnex account name.
   */
  constructor(
    username: string,
    password: string,
    accountNumber: string,
    accountName: string
  ) {
    this.username = username;
    this.password = password;
    this.accountNumber = accountNumber;
    this.accountName = accountName;
  }

  /**
   * Build XML for the credential part of the request.
   *
   * @returns The credential XML as a string.
   */
  private buildCredentialXml(): string {
    return `
      <Credential>
        <UserID>${this.username}</UserID>
        <Password>${this.password}</Password>
      </Credential>`;
  }

  /**
   * Build XML for the purchase order submission request.
   *
   * @param request - The purchase order request data.
   * @returns The request XML as a string.
   */
  public buildCreatePORequestXml(request: SynnexB2BRequest): string {
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
          <accountNumber>${this.accountNumber}</accountNumber>
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
            <BillTo code=${this.accountNumber}>
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
  public buildStatusRequestXml(request: POStatusRequest): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <SynnexB2B>
        ${this.buildCredentialXml()}
        <OrderStatusRequest>
          <CustomerNumber>${this.accountNumber}</CustomerNumber>
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
  public buildPriceAvailabilityRequestXml(skus: string[]): string {
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
        <customerNo>${this.accountNumber}</customerNo>
        <userName>${this.username}</userName>
        <password>${this.password}</password>
        ${skuListXml}
      </priceRequest>`;
  }

  /**
   * Build XML for the freight quote request.
   *
   * @param request - The freight quote request data.
   * @returns The request XML as a string.
   */
  public buildFreightQuoteRequestXml(request: FreightQuoteRequest): string {
    const version = request.version || "2.0";
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
        <FreightQuoteRequest version="${version}">
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
  public buildFreightWithZipRequestXml(request: FreightWithZipRequest): string {
    const version = request.version || "1.0";
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
        <FreightQuoteRequest version="${version}">
          <CustomerNumber>${this.accountNumber}</CustomerNumber>
          <CustomerName>${this.accountName}</CustomerName>
          <RequestDateTime>${new Date().toISOString()}</RequestDateTime>
          <ShipFromWarehouse>${request.shipFromWarehouse}</ShipFromWarehouse>
          <ShipToZipCode>${request.shipToZipCode}</ShipToZipCode>
          <Items>${itemsXml}</Items>
        </FreightQuoteRequest>
      </SynnexB2B>`;
  }

  /**
   * Build XML for the invoice request.
   *
   * @param poNumber - The PO number to query the invoice.
   * @param orderNumber - The order number to query the invoice.
   * @returns The request XML as a string.
   */
  public buildInvoiceRequestXml(
    poNumber?: string,
    orderNumber?: string
  ): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <SynnexB2B version="1.0">
        ${this.buildCredentialXml()}
        <InvoiceRequest>
          <CustomerNumber>${this.accountNumber}</CustomerNumber>
          ${poNumber ? `<PONumber>${poNumber}</PONumber>` : ""}
          ${orderNumber ? `<OrderNumber>${orderNumber}</OrderNumber>` : ""}
        </InvoiceRequest>
      </SynnexB2B>`;
  }
}

export default SynnexXmlBuilder;