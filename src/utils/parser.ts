import { parseStringPromise } from "xml2js";
import _ from "lodash";

// Function to convert string numbers with commas to decimal numbers
const convertStringToNumber = (value: any): any => {
  if (typeof value === "string") {
    // Remove commas and convert to number if it looks like a number
    const cleanedValue = value.replace(/,/g, "");
    const numValue = parseFloat(cleanedValue);
    if (!isNaN(numValue)) {
      return numValue;
    }
  }
  return value;
};

// Function to recursively transform object keys to camel case and convert numeric strings
const keysToCamel = (obj: any): any => {
  if (_.isArray(obj)) {
    return obj.map((v) => keysToCamel(v));
  } else if (_.isObject(obj)) {
    return _.reduce(
      obj,
      (result, value, key) => {
        const camelKey = _.camelCase(key);
        result[camelKey] = keysToCamel(value);
        return result;
      },
      {} as any
    );
  }
  return convertStringToNumber(obj);
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
