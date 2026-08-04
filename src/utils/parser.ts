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

/**
 * Keys whose value is a repeatable element in the TD SYNNEX schema.
 *
 * `explicitArray: false` keeps single values unwrapped, which is what we want
 * for scalars, but it also collapses a one-item list into a bare object. The
 * same endpoint then returns an object for one result and an array for two,
 * so callers that iterate break on the single-item case.
 *
 * Normalizing here keeps every call site free of `Array.isArray` guards.
 */
const LIST_FIELDS = new Set([
  "priceAvailabilityList",
  "items",
  "item",
  "packages",
  "package",
  "availabilityByWarehouse",
  "availableShipMethods",
  "availableShipMethod",
  "invoice",
  "serialNo",
]);

/**
 * Coerce a parsed XML value into an array.
 *
 * `undefined` and `null` mean the element was absent and become `[]`. Other
 * falsy values (0, "", false) are genuinely present and are preserved.
 */
export const ensureArray = <T>(value: T | T[] | undefined | null): T[] => {
  if (value === undefined || value === null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

// Recursively wrap known repeatable elements so their shape is stable.
const normalizeLists = (obj: any): any => {
  if (_.isArray(obj)) {
    return obj.map(normalizeLists);
  }
  if (!_.isObject(obj)) {
    return obj;
  }
  return _.reduce(
    obj,
    (result, value, key) => {
      const normalized = normalizeLists(value);
      result[key] =
        LIST_FIELDS.has(key) && !_.isArray(normalized)
          ? [normalized]
          : normalized;
      return result;
    },
    {} as any
  );
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
    return normalizeLists(keysToCamel(jsonResult));
  } catch (error: any) {
    throw new Error("Failed to parse XML: " + error.message);
  }
};
