// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { resendAdapter } from '@payloadcms/email-resend'
import { gcsStorage } from '@payloadcms/storage-gcs'
import { es } from '@payloadcms/translations/languages/es'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Purchase } from './collections/acq-vehicle/purchase/Purchase'
import { PurchasePayment } from './collections/acq-vehicle/purchase/PurchasePayment'
import { PurchaseCancellation } from './collections/acq-vehicle/purchase/PurchaseCancellation'
import { PurchaseRefund } from './collections/acq-vehicle/purchase/PurchaseRefund'
import { PurchaseInvoice } from './collections/acq-vehicle/purchase/PurchaseInvoice'
import { PurchaseTransportation } from './collections/acq-vehicle/purchase/PurchaseTransportation'
import { PurchaseReceptions } from './collections/acq-vehicle/purchase/PurchaseReceptions'
import { MotiveCancellationPurchase } from './collections/acq-vehicle/purchase/MotiveCancellationPurchase'
import { MediaPurchase } from './collections/acq-vehicle/purchase/MediaPurchase'
import { MediaPurchasePayment } from './collections/acq-vehicle/purchase/MediaPurchasePayment'
import { MediaPurchaseInvoice } from './collections/acq-vehicle/purchase/MediaPurchaseInvoice'
import { MediaPurchaseTransportation } from './collections/acq-vehicle/purchase/MediaPurchaseTransportation'
import { MediaPurchaseRefund } from './collections/acq-vehicle/purchase/MediaPurchaseRefund'
import { MediaPurchaseCancellation } from './collections/acq-vehicle/purchase/MediaPurchaseCancellation'
import { Company } from './collections/setting-admin/company/Company'
import { CompanyInformation } from './collections/setting-admin/company/CompanyInformation'
import { AccountCompany } from './collections/setting-admin/company/AccountCompany'
import { Establishment } from './collections/setting-admin/company/Establishment'
import { WareHouse } from './collections/setting-admin/company/WareHouse'
import { MediaCompany } from './collections/setting-admin/company/MediaCompany'
import { Collaborator } from './collections/setting-admin/RRHH/Collaborator'
import { LaborInformation } from './collections/setting-admin/RRHH/LaborInformation'
import { Driver } from './collections/setting-admin/RRHH/Driver'
import { TypeCollaborator } from './collections/setting-admin/RRHH/TypeCollaborator'
import { LaborArea } from './collections/setting-admin/RRHH/LaborArea'
import { JobPosition } from './collections/setting-admin/RRHH/JobPosition'
import { PensionSystem } from './collections/setting-admin/RRHH/PensionSystem'
import { TypeAFP } from './collections/setting-admin/RRHH/TypeAFP'
import { FamilyRelation } from './collections/setting-admin/RRHH/FamilyRelation'
import { MediaCollaborator } from './collections/setting-admin/RRHH/MediaCollaborator'
import { MediaAFP } from './collections/setting-admin/RRHH/MediaAFP'
import { MediaCTS } from './collections/setting-admin/RRHH/MediaCTS'
import { ModuleSystem } from './collections/setting-admin/users/ModuleSystem'
import { Rol } from './collections/setting-admin/users/Rol'
import { MediaUser } from './collections/setting-admin/users/MediaUser'
import { TypeIdentificationDocument } from './collections/setting-admin/identity/TypeIdentificationDocument'
import { CivilStatus } from './collections/setting-admin/identity/CivilStatus'
import { Genre } from './collections/setting-admin/identity/Genre'
import { TypeAccount } from './collections/setting-admin/financial/TypeAccount'
import { TypeBank } from './collections/setting-admin/financial/TypeBank'
import { TypeCurrency } from './collections/setting-admin/financial/TypeCurrency'
import { TypeReceipt } from './collections/setting-admin/financial/TypeReceipt'
import { TypePayment } from './collections/setting-admin/financial/TypePayment'
import { PaymentPeriod } from './collections/setting-admin/financial/PaymentPeriod'
import { Country } from './collections/setting-admin/locaction/Country'
import { Deparment } from './collections/setting-admin/locaction/Deparment'
import { Province } from './collections/setting-admin/locaction/Province'
import { District } from './collections/setting-admin/locaction/District'
import { InternalPlates } from './collections/acq-plates/internal-plates/InternalPlates'
import { ExternalPlates } from './collections/acq-plates/external-plates/ExternalPlates'
import { OwnerExternalPlates } from './collections/acq-plates/external-plates/OwnerExternalPlates'
import { MediaInternalPlates } from './collections/acq-plates/internal-plates/MediaInternalPlates'
import { MotiveCancellationInternalPlates } from './collections/acq-plates/internal-plates/MotiveCancellationInternalPlates'
import { Supplier } from './collections/administration/suppliers/Supplier'
import { SupplierAddress } from './collections/administration/suppliers/SupplierAddress'
import { SupplierContact } from './collections/administration/suppliers/SupplierContact'
import { SupplierBankAccount } from './collections/administration/suppliers/SupplierBankAccount'
import { Inventory } from './collections/acq-vehicle/inventory/Inventory'
import { Movements } from './collections/acq-vehicle/inventory/Movements'
import { Relocation } from './collections/acq-vehicle/inventory/Relocation'
import { ReceptionRelocation } from './collections/acq-vehicle/inventory/ReceptionRelocation'
import { RelocationWarehouses } from './collections/acq-vehicle/inventory/RelocationWarehouses'
import { Expense } from './collections/acq-vehicle/inventory/Expense'
import { MediaRelocation } from './collections/acq-vehicle/inventory/MediaRelocation'
import { Vehicle } from './collections/vehicles/vehicle-list/Vehicle'
import { Brand } from './collections/vehicles/vehicle-list/Brand'
import { Model } from './collections/vehicles/vehicle-list/Model'
import { Version } from './collections/vehicles/vehicle-list/Version'
import { Color } from './collections/vehicles/vehicle-list/Color'
import { Fuel } from './collections/vehicles/vehicle-list/Fuel'
import { CarBody } from './collections/vehicles/vehicle-list/CarBody'
import { Category } from './collections/vehicles/vehicle-list/Category'
import { Traction } from './collections/vehicles/vehicle-list/Traction'
import { TypeRim } from './collections/vehicles/vehicle-list/TypeRim'
import { Transmission } from './collections/vehicles/vehicle-list/Transmission'
import { TypeUse } from './collections/vehicles/vehicle-list/TypeUse'
import { BasicEquipment } from './collections/vehicles/equipment/BasicEquipment'
import { InternalEquipment } from './collections/vehicles/equipment/InternalEquipment'
import { ExternalEquipment } from './collections/vehicles/equipment/ExternalEquipment'
import { ExpenseAditionalVehicle } from './collections/vehicles/vehicle-list/ExpenseAditionalVehicle'
import { MediaExpenseVehicle } from './collections/vehicles/vehicle-list/MediaExpenseVehicle'
import { MediaEquipment } from './collections/vehicles/equipment/MediaEquiment'
import { MediaPlates } from './collections/vehicles/vehicle-list/MediaPlates'
import { MediaGallery } from './collections/vehicles/vehicle-list/MediaGallery'
import { MediaReferenceImage } from './collections/vehicles/vehicle-list/MediaReferenceImage'
import { MediaVehicle } from './collections/vehicles/vehicle-list/MediaVehicle'
import { AssignmentGPS } from './collections/acq-gps/control-gps/AssignmentGPS'
import { InstallationGps } from './collections/acq-gps/control-gps/InstallationGPS'
import { PeriodUseGPS } from './collections/acq-gps/control-gps/PeriodUseGPS'
import { RenewalsGPS } from './collections/acq-gps/control-gps/RenewalsGPS'
import { GPSCancellation } from './collections/acq-gps/control-gps/GPSCancellation'
import { DeviceGPS } from './collections/acq-gps/device-sinotrack/DeviceGPS'
import { CardSIM } from './collections/acq-gps/card-sim/CardSIM'
import { SupplierGPS } from './collections/acq-gps/device-sinotrack/SupplierGPS'
import { OwnerSIM } from './collections/acq-gps/card-sim/OwnerSIM'
import { InstallerGPS } from './collections/acq-gps/control-gps/InstallerGPS'
import { TypeSino } from './collections/acq-gps/control-gps/TypeSino'
import { TypeGPS } from './collections/acq-gps/control-gps/TypeGPS'
import { TypeOperator } from './collections/acq-gps/card-sim/TypeOperator'
import { OtherPlaceInstallation } from './collections/acq-gps/control-gps/OtherPlaceInstallation'
import { MotiveCancellationDevice } from './collections/acq-gps/device-sinotrack/MotiveCancellationDevice'
import { MotiveCancellationCardSIM } from './collections/acq-gps/card-sim/MotiveCancellationCardSIM'
import { MotiveCancellationGPS } from './collections/acq-gps/control-gps/MotiveCancellationGPS'
import { MediaGPS } from './collections/acq-gps/control-gps/MediaGPS'
import { MediaInstallation } from './collections/acq-gps/control-gps/MediaInstallation'
import { MediaGPSCancellation } from './collections/acq-gps/control-gps/MediaGPSCancellation'
import { MediaRenewal } from './collections/acq-gps/control-gps/MediaRenewal'
import { MediaTypeSino } from './collections/acq-gps/control-gps/MediaTypeSino'
import { VehicleRegistrationProcedure } from './collections/vehicles/procedure/VehicleRegistrationProcedure'
import { LicensePlateIssuanceProcedure } from './collections/vehicles/procedure/LicensePlateIssuanceProcedure'
import { VehicleTitleTransferProcedure } from './collections/vehicles/procedure/VehicleTitleTransferProcedure'
import { ProcedureSunarp } from './collections/vehicles/procedure/ProcedureSunarp'
import { ProcedureAAP } from './collections/vehicles/procedure/ProcedureAAP'
import { TypeProcedureSunarp } from './collections/vehicles/procedure/TypeProcedureSunarp'
import { TypeProcedureAAP } from './collections/vehicles/procedure/TypeProcedureAAP'
import { RegistryOfficeProcedure } from './collections/vehicles/procedure/RegistryOfficeProcedure'
import { RegistrationProcessor } from './collections/vehicles/procedure/RegistrationProcessor'
import { ExpenseProcedureSunarp } from './collections/vehicles/procedure/ExpenseProcedureSunarp'
import { ExpenseProcedureTitleTransfer } from './collections/vehicles/procedure/ExpenseProcedureTitleTransfer'
import { ExpenseProcedureAAP } from './collections/vehicles/procedure/ExpenseProcedureAAP'
import { MediaProcedureRegistration } from './collections/vehicles/procedure/MediaProcedureRegistration'
import { MediaRegistration } from './collections/vehicles/procedure/MediaRegistration'
import { MediaTive } from './collections/vehicles/procedure/MediaTive'
import { MediaProcedureTitleTransfer } from './collections/vehicles/procedure/MediaProcedureTitleTransfer'
import { MediaProcedureSunarp } from './collections/vehicles/procedure/MediaProcedureSunarp'
import { MediaExpenseProcedureSunarp } from './collections/vehicles/procedure/MediaExpenseProcedureSunarp'
import { MediaProcedureAAP } from './collections/vehicles/procedure/MediaProcedureAAP'
import { MediaExpenseProcedureAAP } from './collections/vehicles/procedure/MediaExpenseProcedureAAP'
import { Buyer } from './collections/administration/buyer/Buyer'
import { Activity } from './collections/administration/buyer/Activity'
import { MediaBuyer } from './collections/administration/buyer/MediaBuyer'
import { VehicleDelivery } from './collections/delivery/VehicleDelivery'
import { MediaVehicleDelivery } from './collections/delivery/MediaVehicleDelivery'
import { DocumentAditional } from './collections/postventa-documents/document-aditional/DocumentAditional'
import { TypeDocumentAditional } from './collections/postventa-documents/document-aditional/TypeDocumentAditional'
import { MediaDocumentAditional } from './collections/postventa-documents/document-aditional/MediaDocumentAditional'
import { MediaNotification } from './collections/postventa-documents/notification/MediaNotification'
import { VehicleTax } from './collections/postventa-documents/vehicle-tax/VehicleTax'
import { InfractionVehicle } from './collections/postventa-documents/infraction-vehicle/InfractionVehicle'
import { TypeInfraction } from './collections/postventa-documents/infraction-vehicle/TypeInfraction'
import { SanctioningEntity } from './collections/postventa-documents/infraction-vehicle/SanctioningEntity'
import { MediaVehicleTax } from './collections/postventa-documents/vehicle-tax/MediaVehicleTax'
import { MediaInfraction } from './collections/postventa-documents/infraction-vehicle/MediaInfraction'
import { CourtCases } from './collections/postventa-documents/court-cases/CoutCases'
import { CounselCourtCases } from './collections/postventa-documents/court-cases/CounselCourtCases'
import { MediaCourtCases } from './collections/postventa-documents/court-cases/MediaCourtCases'
import { TransferSale } from './collections/postventa-documents/transfer-sale/TransferSale'
import { VoucherTransferSale } from './collections/postventa-documents/transfer-sale/VoucherTransferSale'
import { Notary } from './collections/postventa-documents/transfer-sale/Notary'
import { MediaTransferSale } from './collections/postventa-documents/transfer-sale/MediaTransferSale'
import { MediaTransferVoucher } from './collections/postventa-documents/transfer-sale/MediaTransferVoucher'
import { Notification } from './collections/postventa-documents/notification/Notification'
import { InternalSales } from './collections/administration/internal-sales/InternalSales'
import { FinalSale } from './collections/administration/sales/FinalSale'
import { ReceiptSale } from './collections/administration/receipt-sale/ReceiptSale'
import { SaleReservation } from './collections/administration/sales/SaleReservation'
import { SaleOrder } from './collections/administration/sales/SaleOrder'
import { SaleHomeWarranty } from './collections/administration/sales/SaleHomeWarranty'
import { PeriodPayment } from './collections/administration/sales/PeriodPayment'
import { MotiveCancellationSale } from './collections/administration/sales/MotiveCancellationSale'
import { MotiveCancellationReservation } from './collections/administration/sales/MotiveCancellationReservation'
import { MediaInternalSale } from './collections/administration/internal-sales/MediaIntenalSale'
import { MediaSale } from './collections/administration/sales/MediaSale'
import { MediaDownPayment } from './collections/administration/sales/MediaDownPayment'
import { MediaReservation } from './collections/administration/sales/MediaReservation'
import { MediaOrderSale } from './collections/administration/sales/MediaOrderSale'
import { MediaHomeWarranty } from './collections/administration/sales/MediaHomeWarranty'
import { MotiveCancellationReceiptSale } from './collections/administration/receipt-sale/MotiveCancellationReceiptSale'
import { MediaReceipt } from './collections/administration/receipt-sale/MediaReceipt'
import { CreditInstallment } from './collections/administration/sales/sales-credit/CreditInstallment'
import { CreditPayment } from './collections/administration/sales/sales-credit/CreditPayment'
import { CreditPlan } from './collections/administration/sales/sales-credit/CreditPlan'
import { ReceiptCreditPayment } from './collections/administration/sales/sales-credit/ReceiptCreditPayment'
import { PriceAssignment } from './collections/administration/sales/PriceAssignment'
import { PriceLists } from './collections/administration/sales/PriceList'
import { Counters } from './collections/counters/Counters'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    timezones: {
      supportedTimezones: ({ defaultTimezones }) => [
        ...defaultTimezones,
        { label: '(UTC-05:00) Bogota, Lima, Quito', value: 'America/Lima' },
      ],
      defaultTimezone: 'America/Lima',
    },
  },

  email: resendAdapter({
    defaultFromAddress: 'ventas@crm.comercial-angel.com',
    defaultFromName: 'Comercial Angel',
    apiKey: process.env.RESEND_API_KEY || '',
  }),

  i18n: {
    supportedLanguages: { es },
  },

  // cors: '*', // Especifica tu frontend
  cors: ['http://localhost:3001', 'http://localhost:3000'],
  csrf: ['http://localhost:3001', 'http://localhost:3000'],

  collections: [
    //Adquisición de compras vehiculares -------
    Purchase,
    PurchasePayment,
    PurchaseCancellation,
    PurchaseRefund,
    PurchaseInvoice,
    PurchaseTransportation,
    PurchaseReceptions,
    MotiveCancellationPurchase,
    MediaPurchase,
    MediaPurchasePayment,
    MediaPurchaseInvoice,
    MediaPurchaseTransportation,
    MediaPurchaseRefund,
    MediaPurchaseCancellation,

    //Proveedores de unidades vehiculares -----
    Supplier,
    SupplierAddress,
    SupplierContact,
    SupplierBankAccount,

    //Adquisición de placas para circulación vehicular
    InternalPlates,
    ExternalPlates,
    OwnerExternalPlates,
    MediaInternalPlates,
    MotiveCancellationInternalPlates,

    //Control de inventario vehicular ---------
    Inventory,
    Movements,
    Relocation,
    ReceptionRelocation,
    RelocationWarehouses,
    Expense,
    MediaRelocation,

    //Adquisición de GPS -----------------------
    AssignmentGPS,
    InstallationGps,
    PeriodUseGPS,
    RenewalsGPS,
    GPSCancellation,
    DeviceGPS,
    CardSIM,
    SupplierGPS,
    OwnerSIM,
    InstallerGPS,
    TypeSino,
    TypeGPS,
    TypeOperator,
    OtherPlaceInstallation,
    MotiveCancellationDevice,
    MotiveCancellationCardSIM,
    MotiveCancellationGPS,
    MediaGPS,
    MediaInstallation,
    MediaGPSCancellation,
    MediaRenewal,
    MediaTypeSino,

    //Unidades vehiculares ---------------------
    Vehicle,
    PriceAssignment,
    PriceLists,
    Brand,
    Model,
    Version,
    Color,
    Fuel,
    CarBody,
    Category,
    Traction,
    TypeRim,
    Transmission,
    TypeUse,
    BasicEquipment,
    InternalEquipment,
    ExternalEquipment,
    ExpenseAditionalVehicle,
    MediaVehicle,
    MediaReferenceImage,
    MediaGallery,
    MediaPlates,
    MediaEquipment,
    MediaExpenseVehicle,

    //Trámites de SUNARP y AAP
    VehicleRegistrationProcedure,
    LicensePlateIssuanceProcedure,
    VehicleTitleTransferProcedure,
    ProcedureSunarp,
    ProcedureAAP,
    TypeProcedureSunarp,
    TypeProcedureAAP,
    RegistryOfficeProcedure,
    RegistrationProcessor,
    ExpenseProcedureSunarp,
    ExpenseProcedureTitleTransfer,
    ExpenseProcedureAAP,
    MediaProcedureRegistration,
    MediaRegistration,
    MediaTive,
    MediaProcedureTitleTransfer,
    MediaProcedureSunarp,
    MediaExpenseProcedureSunarp,
    MediaProcedureAAP,
    MediaExpenseProcedureAAP,

    //Clientes
    Buyer,
    Activity,
    MediaBuyer,

    //Gestion de ventas internas y finales -----
    InternalSales,
    FinalSale,
    SaleReservation,
    SaleOrder,
    SaleHomeWarranty,
    PeriodPayment,
    MotiveCancellationSale,
    MotiveCancellationReservation,
    MediaInternalSale,
    MediaSale,
    MediaDownPayment,
    MediaReservation,
    MediaOrderSale,
    MediaHomeWarranty,

    //Venta al crédito
    CreditInstallment,
    CreditPayment,
    CreditPlan,
    ReceiptCreditPayment,

    //Comprobante de venta
    ReceiptSale,
    MotiveCancellationReceiptSale,
    MediaReceipt,

    //Gestión de entregas de unidades
    // y equipo vehicula -----------------------
    VehicleDelivery,
    MediaVehicleDelivery,

    //Documento adicionales postventa ----------
    TransferSale,
    VoucherTransferSale,
    Notary,
    MediaTransferSale,
    MediaTransferVoucher,

    Notification,
    DocumentAditional,
    TypeDocumentAditional,
    MediaDocumentAditional,
    MediaNotification,

    VehicleTax,
    InfractionVehicle,
    TypeInfraction,
    SanctioningEntity,
    MediaVehicleTax,
    MediaInfraction,

    CourtCases,
    CounselCourtCases,
    MediaCourtCases,

    //Administración del sistema ---------------
    Company,
    CompanyInformation,
    AccountCompany,
    Establishment,
    WareHouse,
    MediaCompany,

    Collaborator,
    LaborInformation,
    Driver,
    TypeCollaborator,
    LaborArea,
    JobPosition,
    PensionSystem,
    TypeAFP,
    FamilyRelation,
    MediaCollaborator,
    MediaAFP,
    MediaCTS,

    Media,
    Users,
    ModuleSystem,
    Rol,
    MediaUser,

    TypeIdentificationDocument,
    CivilStatus,
    Genre,

    TypeAccount,
    TypeBank,
    TypeCurrency,
    TypeReceipt,
    TypePayment,
    PaymentPeriod,

    Country,
    Deparment,
    Province,
    District,
    Counters,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
    gcsStorage({
      collections: {
        media: {
          prefix: 'media',
        },
        mediapurchase: {
          prefix: 'mediapurchase',
        },
        mediapurchasepayment: {
          prefix: 'mediapurchasepayment',
        },
        mediapurchaseinvoice: {
          prefix: 'mediapurchaseinvoice',
        },
        mediapurchaserefund: {
          prefix: 'mediapurchaserefund',
        },
        mediapurchasetransportation: {
          prefix: 'mediapurchasetransportation',
        },
        mediapurchasecancellation: {
          prefix: 'mediapurchasecancellation',
        },

        //Placas de exhibición ------------------
        mediainternalplates: {
          prefix: 'mediainternalplates',
        },

        //
        mediarelocation: {
          prefix: 'mediarelocation',
        },

        //Adquisición de GPS -------------------
        mediagps: {
          prefix: 'mediagps',
        },
        mediainstallation: {
          prefix: 'mediainstallation',
        },
        mediagpscancellation: {
          prefix: 'mediagpscancellation',
        },
        mediatypesino: {
          prefix: 'mediatypesino',
        },
        mediarenewal: {
          prefix: 'mediarenewal',
        },

        //Unidades vehiculares-----------------
        mediavehicle: {
          prefix: 'mediavehicle',
        },
        mediareferenceimage: {
          prefix: 'mediareferenceimage',
        },
        mediagallery: {
          prefix: 'mediagallery',
        },
        mediaplates: {
          prefix: 'mediaplates',
        },
        mediaexpensevehicle: {
          prefix: 'mediaexpensevehicle',
        },
        mediaequipment: {
          prefix: 'mediaequipment',
        },

        //Ventas finales e internas -------------
        mediainternalsale: {
          prefix: 'mediainternalsale',
        },
        mediasale: {
          prefix: 'mediasale',
        },
        mediasaledownpayment: {
          prefix: 'mediasaledownpayment',
        },
        mediareservation: {
          prefix: 'mediareservation',
        },
        mediaordersale: {
          prefix: 'mediaordersale',
        },
        mediahomewarranty: {
          prefix: 'mediahomewarranty',
        },
        mediareceipt: {
          prefix: 'mediareceipt',
        },

        //Trámites ------------------------------
        mediaexpenseprocedureaap: {
          prefix: 'mediaexpenseprocedureaap',
        },
        mediaexpenseproceduresunarp: {
          prefix: 'mediaexpenseproceduresunarp',
        },
        mediaprocedureaap: {
          prefix: 'mediaprocedureaap',
        },
        mediaproceduresunarp: {
          prefix: 'mediaproceduresunarp',
        },
        mediaprocedureregistration: {
          prefix: 'mediaregistration',
        },
        mediaregistration: {
          prefix: 'mediaregistration',
        },
        mediaproceduretitletransfer: {
          prefix: 'mediaproceduretitletransfer',
        },
        mediative: {
          prefix: 'mediative',
        },

        //Clientes ------------------------------
        mediabuyer: {
          prefix: 'mediabuyer',
        },

        //Entregas vehiculares y de accesorios---
        mediavehicledelivery: {
          prefix: 'mediavehicledelivery',
        },

        //Documentos adicionales postventa-------
        mediavehicletax: {
          prefix: 'mediavehicletax',
        },
        mediatransfersale: {
          prefix: 'mediatransfersale',
        },
        mediatransfervoucher: {
          prefix: 'mediatransfervoucher',
        },
        medianotification: {
          prefix: 'medianotification',
        },
        mediainfraction: {
          prefix: 'mediainfraction',
        },
        mediadocumentaditional: {
          prefix: 'mediadocumentaditional',
        },
        mediacourtcases: {
          prefix: 'mediacourtcases',
        },

        //Administración del sistema------------
        mediacompany: {
          prefix: 'mediacompany',
        },
        mediacollaborator: {
          prefix: 'mediacollaborator',
        },
        mediaafp: {
          prefix: 'mediaafp',
        },
        mediacts: {
          prefix: 'mediacts',
        },
        mediauser: {
          prefix: 'mediauser',
        },
      },
      bucket: process.env.GCS_BUCKET || '',
      options: {
        credentials: JSON.parse(process.env.GCS_CREDENTIALS || '{}'),
      },
      acl: 'Public',
    }),
  ],
})
