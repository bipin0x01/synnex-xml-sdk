import { parseStringPromise } from "xml2js";
import _ from "lodash";

// Currency-related fields that should be converted from comma-formatted strings to numbers
const CURRENCY_FIELDS = new Set([
  'unitPrice',
  'totalInvoiceAmount',
  'expenseTotal',
  'minOrderFee',
  'freight',
  'salesTax',
  'shipping',
  'discount',
  'handlingFee',
  'tax',
  'recyclingFee',
  'processingFee',
  'boxCharge',
  'rebate',
  'price',
]);

// Function to convert comma-formatted currency strings to numbers
const convertCurrencyString = (value: any, fieldName: string): any => {
  if (typeof value === "string" && CURRENCY_FIELDS.has(fieldName)) {
    // Remove commas and convert to number if it looks like a number
    const cleanedValue = value.replace(/,/g, "");
    const numValue = parseFloat(cleanedValue);
    if (!isNaN(numValue)) {
      return numValue;
    }
  }
  return value;
};

// Function to recursively transform object keys to camel case and convert currency strings
const keysToCamel = (obj: any, parentKey: string = ""): any => {
  if (_.isArray(obj)) {
    return obj.map((v) => keysToCamel(v, parentKey));
  } else if (_.isObject(obj)) {
    return _.reduce(
      obj,
      (result, value, key) => {
        const camelKey = _.camelCase(key);
        result[camelKey] = keysToCamel(value, camelKey);
        return result;
      },
      {} as any
    );
  }
  return convertCurrencyString(obj, parentKey);
};

export const parseXmlToJson = async (xml: string): Promise<any> => {
  try {
    // Configure parser options
    const options = {
      explicitArray: false, // Prevent wrapping single values in arrays
      mergeAttrs: true, // Merge attributes with child elements
      trim: true, // Trim whitespace around text nodes
      normalizeTags: false, // Convert tags to lowercase
      explicitRoot: false, // Remove the root element wrapper
    };

    const jsonResult = await parseStringPromise(xml, options);
    return keysToCamel(jsonResult);
  } catch (error: any) {
    throw new Error("Failed to parse XML: " + error.message);
  }
};
