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
  AddressName1: string;
  AddressName2?: string;
  AddressLine1: string;
  AddressLine2?: string;
  City: string;
  State: string;
  ZipCode: string;
  Country: CountryCode;
}

export interface Contact {
  ContactName: string;
  PhoneNumber: string;
  EmailAddress: string;
}

export interface Item {
  SKU: string;
  UnitPrice: number;
  OrderQuantity: number;
  LineNumber: string;
  CustomerPartNumber?: string;
  ProductName?: string;
  Comments?: string[];
}

export interface OrderRequest {
  CustomerNumber: string;
  PONumber: string;
  DropShipFlag: DropShipFlag;
  Shipment: Shipment;
  Payment: Payment;
  Items: Item[];
}

export interface Shipment {
  ShipFromWarehouse: string;
  ShipTo: Address;
  ShipToContact: Contact;
  ShipMethod: ShipMethod;
  FreightAccountNumber?: string;
}

export interface ShipMethod {
  Code: USShipMethodCode | CAShipMethodCode;
  Description?: string;
}

export interface Payment {
  BillTo: Address;
}

export interface SynnexB2BRequest {
  OrderRequest: OrderRequest;
}

export interface SynnexB2BResponse {
  OrderResponse: {
    CustomerNumber: string;
    PONumber: string;
    Code: string;
    ResponseDateTime: string;
    Items: {
      LineNumber: string;
      SKU: string;
      OrderQuantity: number;
      Code: string;
      OrderNumber: string;
      OrderType: string;
      ShipQuantity: number;
      ShipDatetime?: string;
      MfgPN?: string;
      ProductName?: string;
      ShipFromWarehouse?: string;
      ShipFromCity?: string;
      ShipFromState?: string;
      ShipFromZip?: string;
      ShipMethod?: string;
      ShipMethodDescription?: string;
      ETADate?: string;
      Packages?: Package[];
    }[];
  };
}

export interface Package {
  TrackingNumber: string;
  Weight: number;
  ShipItemQuantity: number;
  SerialNo?: string;
  Imei?: string;
  MacAddress?: string;
}

export interface POStatusRequest {
  PONumber: string;
}

export interface POStatusResponse {
  OrderStatusResponse: {
    CustomerNumber: string;
    PONumber: string;
    Code: string;
    Reason?: string;
    PODatetime?: string;
    ResponseDateTime: string;
    Items: {
      Item: {
        LineNumber: string;
        Code: string;
        ShipDatetime?: string;
        OrderNumber: string;
        OrderType: string;
        OrderQuantity: number;
        UnitPrice: number;
        SKU: string;
        MfgPN: string;
        ProductName: string;
        ShipQuantity: number;
        ShipFromWarehouse?: string;
        ShipFromCity?: string;
        ShipFromState?: string;
        ShipFromZip?: string;
        ShipMethod?: string;
        ShipMethodDescription?: string;
        ETADate?: string;
        Freight?: number;
        HandlingFee?: number;
        Tax?: number;
        RecyclingFee?: number;
        Packages?: Package[];
        EstimatedDeliveryDate?: string;
        EstimatedShipDate?: string;
        EstimatedShipDateCode?: string;
        VendorOrderNumber?: string;
        CustPOLineNo?: string;
      }[];
    };
    ResponseElapsedTime: string;
  };
}

/**
 * Represents a request for price and availability.
 */
export interface PriceAvailabilityRequest {
  sku: string[];
}

/**
 * Represents a response for price and availability.
 */
export interface PriceAvailabilityResponse {
  customerNo: string; // Customer account number
  userName: string; // User ID making the request
  PriceAvailabilityList: Array<{
    synnexSKU: string; // The SKU number in TD SYNNEX system
    mfgPN: string; // Manufacturer Part Number
    mfgCode: string; // Manufacturer code
    status: string; // Status of the SKU (e.g., Active, Discontinued)
    description: string; // Description of the item
    GlobalProductStatusCode: string; // Global status code of the product
    price: number; // Price for the reseller
    totalQuantity: number; // Total available quantity
    AvailabilityByWarehouse: Array<{
      warehouseInfo: {
        number: string; // Warehouse number
        zipcode: string; // Zip code of the warehouse
        city: string; // City where the warehouse is located
        addr: string; // Address of the warehouse
      };
      qty: number; // Quantity available in the warehouse
    }>;
    lineNumber: number; // Line number to correlate with request
  }>;
}
