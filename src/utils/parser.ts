import { parseStringPromise } from "xml2js";

export const parseXmlToJson = async (xml: string): Promise<any> => {
  try {
    // Configure parser options
    const options = {
      explicitArray: false, // Prevent wrapping single values in arrays
      mergeAttrs: true, // Merge attributes with child elements
      trim: true, // Trim whitespace around text nodes
      normalizeTags: true, // Convert tags to lowercase
      explicitRoot: false, // Remove the root element wrapper
    };

    return await parseStringPromise(xml, options);
  } catch (error: any) {
    throw new Error("Failed to parse XML: " + error.message);
  }
};
