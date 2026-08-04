import { parseXmlToJson, ensureArray } from "../src/utils/parser";

/**
 * These tests run offline against fixture XML. They do not need TD SYNNEX
 * sandbox credentials, so they execute in CI on every push.
 *
 * The behaviour under test is the single-element list collapse: xml2js is
 * configured with `explicitArray: false`, so a list containing one child
 * parses to an object while the same list containing two children parses to
 * an array. Consumers that iterate the result break on the one-item case.
 */

const priceAvailabilityXml = (skus: string[]) => `<?xml version="1.0" encoding="UTF-8"?>
<priceAvailabilityResponse>
  <customerNo>123456</customerNo>
  <userName>testuser</userName>
  ${skus
    .map(
      (sku, i) => `<PriceAvailabilityList>
    <synnexSKU>${sku}</synnexSKU>
    <mfgPN>MFG-${sku}</mfgPN>
    <status>Active</status>
    <price>1,234.56</price>
    <totalQuantity>10</totalQuantity>
    <lineNumber>${i + 1}</lineNumber>
  </PriceAvailabilityList>`
    )
    .join("\n  ")}
</priceAvailabilityResponse>`;

describe("parseXmlToJson single-element list handling", () => {
  it("returns an array for a multi-SKU price availability response", async () => {
    const result = await parseXmlToJson(priceAvailabilityXml(["111", "222"]));
    expect(Array.isArray(result.priceAvailabilityList)).toBe(true);
    expect(result.priceAvailabilityList).toHaveLength(2);
  });

  it("returns an array for a single-SKU price availability response", async () => {
    const result = await parseXmlToJson(priceAvailabilityXml(["111"]));

    // Before the fix this is a bare object, so `.map` throws and the
    // declared `priceAvailabilityList: Array<...>` type is wrong at runtime.
    expect(Array.isArray(result.priceAvailabilityList)).toBe(true);
    expect(result.priceAvailabilityList).toHaveLength(1);
    expect(result.priceAvailabilityList[0].synnexSku).toBe("111");
  });

  it("lets callers iterate a single-SKU response without a type guard", async () => {
    const result = await parseXmlToJson(priceAvailabilityXml(["111"]));
    const skus = result.priceAvailabilityList.map((p: any) => p.synnexSku);
    expect(skus).toEqual(["111"]);
  });

  it("still parses comma-formatted currency into numbers", async () => {
    const result = await parseXmlToJson(priceAvailabilityXml(["111"]));
    expect(result.priceAvailabilityList[0].price).toBe(1234.56);
  });

  // Note: `explicitRoot: false` strips the root element, so these assertions
  // start below the response wrapper.
  it("normalizes nested order status items and packages", async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<orderStatusResponse>
  <Items>
    <Item>
      <sku>999</sku>
      <Packages>
        <Package><trackingNumber>1Z999</trackingNumber></Package>
      </Packages>
    </Item>
  </Items>
</orderStatusResponse>`;
    const result = await parseXmlToJson(xml);

    const items = result.items[0].item;
    expect(Array.isArray(items)).toBe(true);
    expect(items).toHaveLength(1);

    // The nested single <Package> is normalized at depth too.
    expect(Array.isArray(items[0].packages)).toBe(true);
    expect(Array.isArray(items[0].packages[0].package)).toBe(true);
    expect(items[0].packages[0].package[0].t ?? items[0].packages[0].package[0].trackingNumber)
      .toBe("1Z999");
  });

  it("normalizes a single invoice into an array", async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<invoiceResponse>
  <Invoice>
    <invoiceNumber>INV-1</invoiceNumber>
    <Items>
      <Item><sku>1</sku></Item>
    </Items>
  </Invoice>
</invoiceResponse>`;
    const result = await parseXmlToJson(xml);
    expect(Array.isArray(result.invoice)).toBe(true);
    expect(result.invoice).toHaveLength(1);
    expect(Array.isArray(result.invoice[0].items[0].item)).toBe(true);
  });

  it("leaves an absent list absent rather than inventing an empty array", async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<priceAvailabilityResponse>
  <customerNo>123456</customerNo>
</priceAvailabilityResponse>`;
    const result = await parseXmlToJson(xml);
    expect(result.priceAvailabilityList).toBeUndefined();
  });
});

describe("ensureArray", () => {
  it("wraps a single object", () => {
    expect(ensureArray({ a: 1 })).toEqual([{ a: 1 }]);
  });

  it("passes an array through unchanged", () => {
    expect(ensureArray([{ a: 1 }, { a: 2 }])).toHaveLength(2);
  });

  it("maps undefined and null to an empty array", () => {
    expect(ensureArray(undefined)).toEqual([]);
    expect(ensureArray(null)).toEqual([]);
  });

  it("preserves falsy scalars that are genuinely present", () => {
    expect(ensureArray(0)).toEqual([0]);
    expect(ensureArray("")).toEqual([""]);
    expect(ensureArray(false)).toEqual([false]);
  });
});
