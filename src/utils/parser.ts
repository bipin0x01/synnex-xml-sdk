import { parseStringPromise } from "xml2js";
import _ from "lodash";

// Function to recursively transform object keys to camel case
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
  return obj;
};

export const parseXmlToJson = async (xml: string): Promise<any> => {
  try {
    // Configure parser options
    console.log(xml);
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
