import {
  SynnexB2BRequest,
  POStatusRequest,
  FreightQuoteRequest,
  FreightWithZipRequest,
  SpecialPriceType,
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
    const itemsXml = request.OrderRequest.items
      .map(
        (item) => `
        <Item lineNumber="${item.lineNumber}">
          <SKU>${item.sku}</SKU>
          <UnitPrice>${item.unitPrice}</UnitPrice>
          <OrderQuantity>${item.orderQuantity}</OrderQuantity>
        </Item>`
      )
      .join("");

    const softwareLicenseXml = `
        <SoftWareLicense>
          <AuthorizationNumber>${request.OrderRequest.softWareLicense?.authorizationNumber}</AuthorizationNumber>
          <ReOrder>Y</ReOrder>
          <Licensee>
            <AddressName1>${request.OrderRequest.softWareLicense?.licensee.addressName1}</AddressName1>
            <AddressName2>${request.OrderRequest.softWareLicense?.licensee.addressName2}</AddressName2>
            <AddressLine1>${request.OrderRequest.softWareLicense?.licensee.addressLine1}</AddressLine1>
            <AddressLine2>${request.OrderRequest.softWareLicense?.licensee.addressLine2}</AddressLine2>
            <City>${request.OrderRequest.softWareLicense?.licensee.city}</City>
            <State>${request.OrderRequest.softWareLicense?.licensee.state}</State>
            <ZipCode>${request.OrderRequest.softWareLicense?.licensee.zipCode}</ZipCode>
            <Country>${request.OrderRequest.softWareLicense?.licensee.country}</Country>
            <LicenseeContact>
              <ContactName>${request.OrderRequest.softWareLicense?.licensee.licenseeContact.contactName}</ContactName>
              <PhoneNumber>${request.OrderRequest.softWareLicense?.licensee.licenseeContact.phoneNumber}</PhoneNumber>
              <FaxNumber>${request.OrderRequest.softWareLicense?.licensee.licenseeContact.faxNumber}</FaxNumber>
              <EmailAddress>${request.OrderRequest.softWareLicense?.licensee.licenseeContact.emailAddress}</EmailAddress>
            </LicenseeContact>
          </Licensee>
        </SoftWareLicense>`;

    const endUserPoXml = `<EndUserPONumber>${request.OrderRequest.endUserPoNumber}</EndUserPONumber>`;

    const commentXml = `<Comment>${request.OrderRequest.comment}</Comment>`;

    const specialPriceTypeXml = `<SpecialPriceType>${request.OrderRequest.specialPriceType}</SpecialPriceType>`;
    const specialPriceReferenceNumberXml = `<SpecialPriceReferenceNumber>${request.OrderRequest.specialPriceReferenceNumber}</SpecialPriceReferenceNumber>`;

    const paymentXmlWithAddress = `
      <Payment>
      <BillTo code="${this.accountNumber}">
        <AddressName1>${request.OrderRequest.payment?.billTo.addressName1}</AddressName1>
        <AddressName2>${request.OrderRequest.payment?.billTo.addressName2}</AddressName2>
        <AddressLine1>${request.OrderRequest.payment?.billTo.addressLine1}</AddressLine1>
        <AddressLine2>${request.OrderRequest.payment?.billTo.addressLine2}</AddressLine2>
        <City>${request.OrderRequest.payment?.billTo.city}</City>
        <State>${request.OrderRequest.payment?.billTo.state}</State>
        <ZipCode>${request.OrderRequest.payment?.billTo.zipCode}</ZipCode>
      </BillTo>
    </Payment>`;

    const paymentXml = `
      <Payment>
      <BillTo code="${this.accountNumber || request.OrderRequest.customerNumber}">
      </BillTo>
    </Payment>`;


    return `<?xml version="1.0" encoding="UTF-8"?>
      <SynnexB2B>
        ${this.buildCredentialXml()}
        <OrderRequest>
          <CustomerNumber>${this.accountNumber || request.OrderRequest.customerNumber}</CustomerNumber>
          <PONumber>${request.OrderRequest.poNumber}</PONumber>
          <DropShipFlag>${request.OrderRequest.dropShipFlag}</DropShipFlag>
          <Shipment>
            <ShipFromWarehouse>${
              request.OrderRequest.shipment.shipFromWarehouse
            }</ShipFromWarehouse>
            <ShipTo>
              <AddressName1>${
                request.OrderRequest.shipment.shipTo.addressName1
              }</AddressName1>
              <AddressLine1>${
                request.OrderRequest.shipment.shipTo.addressLine1
              }</AddressLine1>
              <City>${request.OrderRequest.shipment.shipTo.city}</City>
              <State>${request.OrderRequest.shipment.shipTo.state}</State>
              <ZipCode>${request.OrderRequest.shipment.shipTo.zipCode}</ZipCode>
              <Country>${request.OrderRequest.shipment.shipTo.country}</Country>
            </ShipTo>
            <ShipToContact>
              <ContactName>${
                request.OrderRequest.shipment.shipToContact.contactName
              }</ContactName>
              <PhoneNumber>${
                request.OrderRequest.shipment.shipToContact.phoneNumber
              }</PhoneNumber>
              <EmailAddress>${
                request.OrderRequest.shipment.shipToContact.emailAddress
              }</EmailAddress>
            </ShipToContact>

            <ShipMethod>
              <Code>${
                request.OrderRequest.shipment?.shipMethod?.code || "FX"
              }</Code>
            </ShipMethod>
          </Shipment>
          ${request.OrderRequest.payment ? paymentXmlWithAddress : paymentXml}
          <Items>${itemsXml}</Items>
          ${request.OrderRequest.softWareLicense && softwareLicenseXml}
          ${request.OrderRequest.endUserPoNumber && endUserPoXml}
          ${request.OrderRequest.comment && commentXml}
          ${request.OrderRequest.specialPriceType && specialPriceTypeXml}
          ${
            request.OrderRequest.specialPriceReferenceNumber &&
            request.OrderRequest.specialPriceType ==
              SpecialPriceType.VENDOR_PROMOTION &&
            specialPriceReferenceNumberXml
          }
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
          <PONumber>${request.poNumber}</PONumber>
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
    const requestDateTime = new Date().toISOString();
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
          <RequestDateTime>${requestDateTime}</RequestDateTime>
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
    const requestDateTime = new Date().toISOString();
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
          <RequestDateTime>${requestDateTime}</RequestDateTime>
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
