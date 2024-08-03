import { parseStringPromise } from "xml2js";

export const parseXmlToJson = async (xml: string): Promise<any> => {
  try {
    return await parseStringPromise(xml);
  } catch (error: any) {
    throw new Error("Failed to parse XML: " + error.message);
  }
};
