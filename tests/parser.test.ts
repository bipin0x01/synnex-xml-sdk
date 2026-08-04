import { parseXmlToJson } from "../src/utils/parser";

describe("parseXmlToJson currency conversion", () => {
  it("parses TotalInvoiceAmount with CR suffix as a negative number", async () => {
    const xml = `
      <SynnexB2B>
        <InvoiceResponse>
          <Invoice>
            <Summary>
              <TotalInvoiceAmount>711.64CR</TotalInvoiceAmount>
              <Freight>12.87</Freight>
            </Summary>
          </Invoice>
        </InvoiceResponse>
      </SynnexB2B>
    `;

    const result = await parseXmlToJson(xml);
    const summary = result.invoiceResponse.invoice.summary;

    expect(summary.totalInvoiceAmount).toBe(-711.64);
    expect(summary.freight).toBe(12.87);
  });

  it("parses comma-formatted currency and lowercase cr", async () => {
    const xml = `
      <Summary>
        <TotalInvoiceAmount>1,234.50cr</TotalInvoiceAmount>
        <UnitPrice>177.9100</UnitPrice>
      </Summary>
    `;

    const result = await parseXmlToJson(xml);

    expect(result.totalInvoiceAmount).toBe(-1234.5);
    expect(result.unitPrice).toBe(177.91);
  });
});
