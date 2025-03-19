/**
 * Configuration options for the SynnexClient.
 */
export interface SynnexClientConfig {
  environment: "sandbox" | "production";
  country: CountryCode;
  username: string;
  password: string;
  accountNumber: string;
  accountName: string;
}

export enum DropShipFlag {
  Yes = "Y",
  No = "N",
}

export enum USShipMethodCode {
  AAACooper = "AAAC",
  ABFCustShip = "ABFC",
  ABFTimekeeper = "ABFT",
  AITWhitegloveTVB2C = "AIP",
  AITThresholdB2CTV = "AIPT",
  AITDeferredEconomy = "AIT",
  AITOneDay = "AIT1",
  AITTwoDay = "AIT2",
  AITGuaranteed3Day = "AIT3",
  AsocGlobalOneDay = "ASA1",
  AsocGlobalTwoDay = "ASA2",
  AsocGlobalDefer = "ASAF",
  ATLCourier = "ATLC",
  AverittExpressTL = "AVTL",
  BAXSchenkerOneDayGlobal = "BAX1",
  BAXSchenkerTwoDayGlobal = "BAX2",
  CircleDelivery = "CD",
  CHRobinson = "CHR",
  CeladonTrucking = "CLDN",
  ColumnLogistics = "CLG",
  CorTransOneDay = "COO1",
  CorTransTwoDay = "COO2",
  CorTransThreeDay = "COO3",
  CorTransDeferred = "COOG",
  CustomerPickUp = "CPU",
  CSXTrucking = "CSX",
  LocalDelivery = "DE",
  DynamexLocalDelyPallets = "DETR",
  DynamexLocalDelyVans = "DEVN",
  DHL = "DH",
  DHLInternational = "DHI",
  DHLTwoDay = "DHL2",
  DotlineTransportation = "DOTL",
  DawesTransportation = "DW",
  CEVANextDay = "E1",
  CEVASecondDay = "E2",
  CEVAThreeFiveDay = "E3",
  ElectronicDelivery = "EDEL",
  ExpeditorsInternational = "EXDO",
  ExpeditorsSpot = "EXPS",
  EagleUSAInternational = "EUSA",
  EdgeLogistics = "ELOB",
  FedExTwoDay = "F2",
  FedExTwoDayFreight = "F2F",
  FedExInternational = "FI",
  FedExFridaySatDel = "FFS",
  FedExGround = "FG",
  FedExGroundCanada = "FGC",
  FedExHomeDelivery = "FHD",
  FedExIntl = "FI",
  FedExMultiWeight = "FMWT",
  FedExStandardOvernight = "FO",
  FedExStandardOvernightFreight = "FOF",
  FedExPriorityOvernight = "FP",
  FedExPriorityOvernightFreight = "FPF",
  FedExHvyPriorityIntl = "FPFI",
  FedExPriorityInternational = "FPI",
  FedExIntlPriorityCWT = "FPIC",
  FedExIntlPriority = "FPIN",
  FedExSaturdayDelivery = "FS",
  ForwardedWillCall = "FWC",
  FedExExpressSaver = "FX",
  FedExExpressSaverFreight = "FXF",
  FedExFreightEconomyIntl = "FXFI",
  FedExIntlEconomyCWT = "FXIC",
  FedExIntlEconomy = "FXIN",
  FedExLTLEconomy = "FXLE",
  FedExLTLPriority = "FXLP",
  FedExNationalLTLSpot = "FXNL",
  HoldShip = "HS",
  HubGroup = "HUBG",
  HorizonAlliance = "HZA",
  JBHuntTruckload = "JBHT",
  JetDelService = "JET",
  JITTransportation = "JIT",
  JITLTGround = "JITG",
  KLSAirExpress = "KAE",
  // Add more as needed
}

export enum CAShipMethodCode {
  CEVALogistics = "CEV",
  CEVATHService = "CEVT",
  CEVAWHService = "CEVW",
  CanadaPostCorporation = "CPC",
  CanadaPostExpeditedParcel = "CPCE",
  CanadaPostPriorityNextAM = "CPCP",
  CanadaPostRegularParcel = "CPCR",
  CanadaPostXpresspost = "CPCX",
  DayAndRossCalgary = "DARC",
  DayAndRossGuelph = "DARG",
  DayAndRossHalifax = "DARH",
  DayAndRossVancouver = "DARV",
  DayAndRossSmallOrders = "DARX",
  DropShipVendor = "DSV",
  ElectronicDelivery = "EDEL",
  FedExExpress = "FDXH",
  ForwardedWillCall = "FWC",
  KHDispatch = "KNH",
  KHSSpecial = "KNHS",
  OnwardExpressRush = "OXR",
  PurolatorExpress1030am = "P10X",
  PurolatorExpress900am = "P9X",
  PurolatorSaturday = "PSA",
  PurolatorExpressAir = "PUA",
  PurolatorGround = "PUG",
  PurolatorExpressGround = "PUX",
  QuickRunOvernight = "QR2",
  RoutesDisplayDist1Pallet = "ROD1",
  RoutesDisplayDist2Pallet = "ROD2",
  RoutesDisplayDist3Pallet = "ROD3",
  RoutesDistributionQuarters = "RODQ",
  RoutesLTL = "ROU",
  RoutesInbound = "ROUI",
  RoutesQuartersGuelph = "ROUQ",
  RoutesDisplaySpecial = "ROUS",
  RoutesTruckLoad = "ROUT",
  Schenker40FTHighCubeCont = "S40H",
  SchenkerAirfreight = "SAIR",
  Schenker20Container = "SC20",
  Schenker40Container = "SC40",
  Schenker45Container = "SC45",
  Schenker40HighCubeContnr = "SC4H",
  DynamexExpSameDayLocal = "SDL",
  DynamexExpSameDayDirect = "SDS",
  SamedayTruck = "SDT",
  SchenkerFullTruckload = "SFTL",
  SchenkerLessThanContainer = "SLCL",
  SchenkerLessThanTruckload = "SLTL",
  StraitConsolidateStx = "ST2",
  StraitExpress = "STX",
  UPSStandard = "UPG",
  UPSGroundForCollect = "UPGC",
  UPSExpressSaver = "UPSS",
  UPSExpressSaver2 = "UPX",
  CustomerPickUp = "WC",
  PickUpInEtobicoke = "WCET",
  PickUpGuelph = "WCGU",
  CustomerPickUp2 = "WCMI",
  LogitecDisplayShipment = "WCRO",
  WarehouseSelect = "WHS",
  // Add more as needed
}

export type CountryCode = "US" | "CA"; // Support for only US and CA

export enum USWarehouseLocation {
  MiamiFL = "16",
  FremontCA = "3",
  FortWorthTX = "503",
  GlendaleHeightsIL = "6",
  OliveBranchMS = "7",
  KeasbyNJ = "8",
  BeavertonOR = "10",
  NorcrossGA = "4",
  OntarioCA = "12",
  ColumbusOH = "14",
  OliveBranchMSNew = "79",
  KeasbyNJNew = "89",
  OntarioCANew = "129",
  ColumbusOHNew = "149",
}

export enum CAWarehouseLocation {
  USJoint = "US",
  HalifaxNS = "26",
  GuelphON = "29",
  CalgaryAB = "31",
  RichmondBC = "81",
}

export interface Address {
  addressName1: string;
  addressName2?: string;
  addressLine1?: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: CountryCode;
}

export interface Contact {
  contactName: string;
  phoneNumber: string;
  emailAddress: string;
}

export interface Item {
  sku: string;
  unitPrice: number;
  orderQuantity: number;
  lineNumber: string;
  shipFromWarehouse?: string;
  customerPartNumber?: string;
  productName?: string;
  comments?: string[];
}

export interface OrderRequest {
  customerNumber: string;
  poNumber: string;
  dropShipFlag: DropShipFlag;
  shipFromWarehouse?: string;
  shipment: Shipment;
  payment?: Payment;
  items: Item[];
  endUserPoNumber?: string;
  softWareLicense?: SoftwareLicense;
  comment?: string;
  backOrderFlag?: "Y" | "N";
  specialHandle?: "Y" | "N";
  specialPriceType?: SpecialPriceType;
  specialPriceReferenceNumber?: string;
}

export enum SpecialPriceType {
  VENDOR_PROMOTION = "VendorPromotion",
  FEDERAL_GOVERNMENT = "FederalGovernment",
  STATE_GOVERNMENT = "StateGovernment",
  EDUCATION = "Education",
}

export interface SoftwareLicense {
  authorizationNumber: string;
  reOrder: string;
  licensee: Licensee;
}

export interface Licensee {
  addressName1: string;
  addressName2?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: CountryCode;
  licenseeContact: LicenseeContact;
}

export interface LicenseeContact {
  contactName: string;
  phoneNumber: string;
  faxNumber: string;
  emailAddress: string;
}

export interface Shipment {
  shipTo: Address;
  shipToContact?: Contact;
  shipMethod?: ShipMethod;
  freightAccountNumber?: string;
}

export interface ShipMethod {
  code: USShipMethodCode | CAShipMethodCode;
  description?: string;
}

export interface Payment {
  billTo: Address;
}

export interface Package {
  trackingNumber: string;
  weight: number;
  shipItemQuantity: number;
  serialNo?: string;
  imei?: string;
  macAddress?: string;
}

export interface SynnexB2BRequest {
  OrderRequest: OrderRequest;
}

interface SynnexB2BResponseData {
  type: "success";
  customerNumber: string;
  poNumber: string;
  code: string;
  responseDateTime: string;
  items: {
    lineNumber: string;
    sku: string;
    orderQuantity: number;
    code: string;
    orderNumber: string;
    orderType: string;
    shipQuantity: number;
    shipDatetime?: string;
    mfgPn?: string;
    productName?: string;
    shipFromWarehouse?: string;
    shipFromCity?: string;
    shipFromState?: string;
    shipFromZip?: string;
    shipMethod?: string;
    shipMethodDescription?: string;
    etaDate?: string;
    packages?: Package[];
  }[];
}
export interface SynnexB2BResponse {
  orderResponse: SynnexB2BResponseData | ErrorResponse;
}
export interface POStatusRequest {
  poNumber: string;
}

export interface POStatusResponse {
  type: "success";
  orderStatusResponse: {
    customerNumber: string;
    poNumber: string;
    code: string;
    reason?: string;
    poDatetime?: string;
    responseDateTime: string;
    items: {
      lineNumber: string;
      code: string;
      shipDatetime?: string;
      orderNumber: string;
      orderType: string;
      orderQuantity: number;
      unitPrice: number;
      sku: string;
      mfgPn: string;
      productName: string;
      shipQuantity: number;
      shipFromWarehouse?: string;
      shipFromCity?: string;
      shipFromState?: string;
      shipFromZip?: string;
      shipMethod?: string;
      shipMethodDescription?: string;
      etaDate?: string;
      freight?: number;
      handlingFee?: number;
      tax?: number;
      recyclingFee?: number;
      packages?: Package[];
      estimatedDeliveryDate?: string;
      estimatedShipDate?: string;
      estimatedShipDateCode?: string;
      vendorOrderNumber?: string;
      custPoLineNo?: string;
    }[];
    responseElapsedTime: string;
  };
}

// types.ts

export interface FreightQuoteRequest {
  version?: string;
  customerNumber?: string;
  customerName?: string;
  requestDateTime?: string;
  shipFromWarehouse: string;
  shipToZipCode?: string;
  shipTo: {
    addressName1: string;
    addressName2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shipMethodCode?: string;
  serviceLevel?: number;
  items: Array<{
    lineNumber: number;
    SKU: string;
    mfgPartNumber?: string;
    description?: string;
    quantity: number;
  }>;
}

export interface FreightQuoteResponse {
  customerNumber: string;
  responseDateTime: string;
  responseElapsedTime: string;
  totalWeight: string;
  totalSales: string;
  freeFreightThreshold: string;
  shipFromWarehouse: {
    number: string;
    zipCode: string;
    city: string;
    addr: string;
  };
  shipTo: {
    addressName1: string;
    addressName2?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    addressType: string;
  };
  shipMethodCode: string;
  shipMethodDescription: string;
  serviceLevel: number;
  items: Array<{
    lineNumber: number;
    SKU: string;
    mfgPartNumber: string;
    description: string;
    quantity: number;
  }>;
  availableShipMethods: Array<{
    code: string;
    shipMethodDescription: string;
    serviceLevel: number;
    freight: string;
  }>;
  otherCharges: {
    minOrderFee: string;
    CODFee: string;
  };
  synnexInternalReference: string;
}

export interface PriceAvailabilityResponse {
  type: "success";
  customerNo: string; // Customer account number
  userName: string; // User ID making the request
  priceAvailabilityList: Array<{
    synnexSku: string; // The SKU number in TD SYNNEX system
    mfgPn: string; // Manufacturer Part Number
    mfgCode: string; // Manufacturer code
    status: string; // Status of the SKU (e.g., Active, Discontinued)
    description: string; // Description of the item
    globalProductStatusCode: string; // Global status code of the product
    price: number; // Price for the reseller
    totalQuantity: number; // Total available quantity
    availabilityByWarehouse: Array<{
      warehouseInfo: {
        number: string; // Warehouse number
        zipCode: string; // Zip code of the warehouse
        city: string; // City where the warehouse is located
        address: string; // Address of the warehouse
      };
      qty: number; // Quantity available in the warehouse
    }>;
    lineNumber: number; // Line number to correlate with request
  }>;
}

export interface FreightWithZipRequest {
  version?: string;
  customerNumber?: string;
  customerName?: string;
  requestDateTime?: string;
  shipFromWarehouse: string;
  shipToZipCode: string;
  items: Array<{
    lineNumber: number;
    SKU: string;
    quantity: number;
  }>;
}

export interface FreightWithZipResponse {
  type: "success";
  customerNumber: string;
  responseDateTime: string;
  responseElapsedTime: string;
  totalWeight: string;
  totalSales: string;
  freeFreightThreshold: string;
  shipFromWarehouse: {
    number: string;
    zipCode: string;
    city: string;
    addr: string;
  };
  shipToZipCode: string;
  availableShipMethods: {
    availableShipMethod: Array<{
      code: string;
      shipMethodDescription: string;
      serviceLevel: number;
      freight: string;
    }>;
  };
  otherCharges: {
    minOrderFee: string;
    CODFee: string;
  };
  synnexInternalReference: string;
}

export interface InvoiceResponse {
  type: "success";
  customerPoNumber: string;
  invoices: Invoice[];
}

export interface Invoice {
  invoiceDate: string; // YYYY-MM-DD
  invoiceNumber: string; // TD SYNNEX Invoice Number
  orderType: string; // Order Type
  approvalNumber?: string;
  shipTo: Address;
  billTo: Address;
  discount: number;
  discountDays: number;
  paymentTermDays: number;
  paymentTermDesc: string;
  shipMethodCode: string;
  shipDate: string; // YYYY-MM-DD
  comments?: string;
  internalReferenceNumber: string; // Invoice, Credit Memo or RMA Number
  tracking?: Tracking;
  items: Item[];
  summary: Summary;
}

export interface Tracking {
  trackNumber: string; // Package Tracking Number
}

export interface Item {
  sku: string;
  unitPrice: number;
  orderQuantity: number;
  lineNumber: string;
}

export interface Summary {
  totalInvoiceAmount: number;
  allowanceOrCharge: string; // 'A' for Allowance, 'C' for Charge
  expenseTotal: number;
  minOrderFee: number;
  rebate: number;
  freight: number;
  processingFee: number;
  boxCharge: number;
  totalWeight: number;
  boxCount: number;
  salesTax: number;
}

export interface ErrorResponse {
  type: "error";
  errorResponse: string;
  errorDetail: string;
}

export type PriceAvailabilityApiResponse =
  | PriceAvailabilityResponse
  | ErrorResponse;

export type SynnexFreightAPIResponse = FreightQuoteResponse | ErrorResponse;

export type SynnexFreightWithZipAPIResponse =
  | FreightWithZipResponse
  | ErrorResponse;

export type SynnexInvoiceAPIResponse = InvoiceResponse | ErrorResponse;

