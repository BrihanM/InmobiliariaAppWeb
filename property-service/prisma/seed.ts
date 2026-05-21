import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

// ── Fixed IDs — idempotentes ─────────────────────────────────────────────────
const TYPE_IDS = {
  house:      "a1000000-0000-0000-0000-000000000001",
  apartment:  "a2000000-0000-0000-0000-000000000002",
  land:       "a3000000-0000-0000-0000-000000000003",
  commercial: "a4000000-0000-0000-0000-000000000004",
};

const TXN_IDS = {
  sale: "b1000000-0000-0000-0000-000000000001",
  rent: "b2000000-0000-0000-0000-000000000002",
};

const STATUS_IDS = {
  available:   "c1000000-0000-0000-0000-000000000001",
  sold:        "c2000000-0000-0000-0000-000000000002",
  rented:      "c3000000-0000-0000-0000-000000000003",
  unavailable: "c4000000-0000-0000-0000-000000000004",
};

// ID del agente creado en auth-service
const AGENT_ID = "22222222-2222-2222-2222-222222222222";

// ── Imágenes de Unsplash (variadas, temática inmobiliaria) ────────────────────
const IMG = {
  house: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&auto=format&fit=crop",
  ],
  apartment: [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80&auto=format&fit=crop",
  ],
  land: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=800&q=80&auto=format&fit=crop",
  ],
  commercial: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80&auto=format&fit=crop",
  ],
};

// ── Definición de propiedades ─────────────────────────────────────────────────
interface PropSeed {
  title: string;
  description: string;
  typeKey: keyof typeof TYPE_IDS;
  txnKey:  keyof typeof TXN_IDS;
  statusKey: keyof typeof STATUS_IDS;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  city: string;
  state: string;
  neighborhood: string;
  street: string;
  postalCode: string;
  lat: number;
  lng: number;
  images: string[];
}

const PROPERTIES: PropSeed[] = [
  // ── BOGOTÁ ──────────────────────────────────────────────────────────────────
  {
    title: "Casa campestre en La Calera",
    description: "Hermosa casa campestre con jardín privado, piscina y vista a las montañas. Ideal para familias que buscan tranquilidad cerca de Bogotá. Acabados de lujo, cocina integral y zona de BBQ.",
    typeKey: "house", txnKey: "sale", statusKey: "available",
    price: 950_000_000, bedrooms: 5, bathrooms: 4, area: 380,
    city: "Bogotá", state: "Cundinamarca", neighborhood: "La Calera", street: "Vereda El Salitre Km 4", postalCode: "250010", lat: 4.7110, lng: -73.9710,
    images: [IMG.house[0], IMG.house[1], IMG.house[2]],
  },
  {
    title: "Apartamento moderno en Chapinero",
    description: "Moderno apartamento en el corazón de Chapinero con vista panorámica de la ciudad. Sala de juegos, gimnasio y seguridad 24h. Excelente ubicación para jóvenes profesionales.",
    typeKey: "apartment", txnKey: "sale", statusKey: "available",
    price: 480_000_000, bedrooms: 2, bathrooms: 2, area: 85,
    city: "Bogotá", state: "Cundinamarca", neighborhood: "Chapinero", street: "Cra 7 # 62-45", postalCode: "110221", lat: 4.6476, lng: -74.0655,
    images: [IMG.apartment[0], IMG.apartment[1]],
  },
  {
    title: "Penthouse en El Chicó",
    description: "Espectacular penthouse en exclusivo sector del Chicó. Terraza privada de 80 m², acabados de primera y parqueadero doble. Proyecto de lujo con conserjería 24h y salón social.",
    typeKey: "apartment", txnKey: "sale", statusKey: "available",
    price: 1_850_000_000, bedrooms: 4, bathrooms: 3, area: 210,
    city: "Bogotá", state: "Cundinamarca", neighborhood: "El Chicó", street: "Cra 15 # 90-12", postalCode: "110221", lat: 4.6770, lng: -74.0530,
    images: [IMG.apartment[2], IMG.apartment[3], IMG.apartment[4]],
  },
  {
    title: "Local comercial en Usaquén",
    description: "Local comercial en pleno centro histórico de Usaquén, ideal para restaurante, café o boutique. Alta afluencia de público y turismo, con vitrina en zona peatonal.",
    typeKey: "commercial", txnKey: "rent", statusKey: "available",
    price: 8_500_000, bedrooms: 0, bathrooms: 2, area: 120,
    city: "Bogotá", state: "Cundinamarca", neighborhood: "Usaquén", street: "Calle 119B # 6-25", postalCode: "110111", lat: 4.6960, lng: -74.0313,
    images: [IMG.commercial[0], IMG.commercial[1]],
  },
  {
    title: "Apartamento en arriendo en Suba",
    description: "Cómodo apartamento en conjunto cerrado con portería 24h, parque infantil y zona de BBQ. Cerca al Portal de Suba y centros comerciales. Tranquilo y seguro.",
    typeKey: "apartment", txnKey: "rent", statusKey: "available",
    price: 2_100_000, bedrooms: 3, bathrooms: 2, area: 72,
    city: "Bogotá", state: "Cundinamarca", neighborhood: "Suba", street: "Cra 91 # 145-60", postalCode: "111111", lat: 4.7410, lng: -74.0900,
    images: [IMG.apartment[5], IMG.apartment[0]],
  },

  // ── MEDELLÍN ─────────────────────────────────────────────────────────────────
  {
    title: "Casa en El Poblado",
    description: "Elegante casa en la mejor zona residencial de Medellín. Amplia sala comedor, cocina abierta tipo gourmet, terraza y jardín. A pasos de restaurantes y parques del sector.",
    typeKey: "house", txnKey: "sale", statusKey: "available",
    price: 1_200_000_000, bedrooms: 4, bathrooms: 3, area: 260,
    city: "Medellín", state: "Antioquia", neighborhood: "El Poblado", street: "Calle 10 # 33-20", postalCode: "050021", lat: 6.2087, lng: -75.5693,
    images: [IMG.house[3], IMG.house[4], IMG.house[5]],
  },
  {
    title: "Apartamento con vista al río en Laureles",
    description: "Apartamento de diseño contemporáneo en Laureles. Balcón con vista panorámica, cocina integral equipada y parqueadero cubierto. Conjunto con piscina y gimnasio.",
    typeKey: "apartment", txnKey: "sale", statusKey: "available",
    price: 620_000_000, bedrooms: 3, bathrooms: 2, area: 115,
    city: "Medellín", state: "Antioquia", neighborhood: "Laureles", street: "Cra 76 # 32A-15", postalCode: "050034", lat: 6.2355, lng: -75.5900,
    images: [IMG.apartment[1], IMG.apartment[2], IMG.apartment[3]],
  },
  {
    title: "Terreno urbanizable en Rionegro",
    description: "Lote plano de 2.500 m² con todos los servicios públicos disponibles en los límites. Excelente oportunidad para proyecto residencial o comercial. A 20 min del aeropuerto.",
    typeKey: "land", txnKey: "sale", statusKey: "available",
    price: 750_000_000, bedrooms: 0, bathrooms: 0, area: 2500,
    city: "Medellín", state: "Antioquia", neighborhood: "Rionegro", street: "Vereda La Fe Lote 12", postalCode: "054040", lat: 6.1533, lng: -75.3740,
    images: [IMG.land[0], IMG.land[1]],
  },
  {
    title: "Oficina en Edificio Empresarial El Centro",
    description: "Oficina lista para entregar en reconocido edificio empresarial de Medellín. Incluye sala de reuniones, área de coworking, cafetería y vigilancia permanente.",
    typeKey: "commercial", txnKey: "rent", statusKey: "available",
    price: 4_200_000, bedrooms: 0, bathrooms: 1, area: 65,
    city: "Medellín", state: "Antioquia", neighborhood: "Centro", street: "Calle 52 # 43-120", postalCode: "050010", lat: 6.2518, lng: -75.5636,
    images: [IMG.commercial[2], IMG.commercial[0]],
  },

  // ── CALI ─────────────────────────────────────────────────────────────────────
  {
    title: "Casa con piscina en Ciudad Jardín",
    description: "Lujosa residencia en Ciudad Jardín con amplia zona social, piscina climatizada y jardín de 400 m². Acabados europeos, domótica integrada y depósito independiente.",
    typeKey: "house", txnKey: "sale", statusKey: "available",
    price: 1_550_000_000, bedrooms: 5, bathrooms: 5, area: 420,
    city: "Cali", state: "Valle del Cauca", neighborhood: "Ciudad Jardín", street: "Calle 16 # 122-45", postalCode: "760044", lat: 3.3726, lng: -76.5326,
    images: [IMG.house[6], IMG.house[7], IMG.house[0]],
  },
  {
    title: "Apartamento en Salomia",
    description: "Apartamento funcional en sector tranquilo, cerca de colegios, supermercados y transporte. Conjunto residencial con zona verde y cancha deportiva. Ideal para familia joven.",
    typeKey: "apartment", txnKey: "rent", statusKey: "rented",
    price: 1_600_000, bedrooms: 2, bathrooms: 1, area: 58,
    city: "Cali", state: "Valle del Cauca", neighborhood: "Salomia", street: "Cra 3 # 58N-20", postalCode: "760001", lat: 3.4627, lng: -76.4913,
    images: [IMG.apartment[4], IMG.apartment[5]],
  },
  {
    title: "Casa en venta en el barrio Granada",
    description: "Casa remodelada en el histórico barrio Granada, famoso por su gastronomía y vida nocturna. Puede utilizarse como vivienda o convertirse en negocio gastronómico o cultural.",
    typeKey: "house", txnKey: "sale", statusKey: "sold",
    price: 890_000_000, bedrooms: 4, bathrooms: 3, area: 200,
    city: "Cali", state: "Valle del Cauca", neighborhood: "Granada", street: "Cra 24 # 4C-12", postalCode: "760020", lat: 3.4419, lng: -76.5278,
    images: [IMG.house[1], IMG.house[2]],
  },

  // ── CARTAGENA ────────────────────────────────────────────────────────────────
  {
    title: "Villa frente al mar en Bocagrande",
    description: "Impresionante villa con acceso directo a la playa, piscina infinita y vista al mar Caribe. Amoblada de lujo, sistema de climatización central y área de servicio. Perfecta para inversión turística.",
    typeKey: "house", txnKey: "sale", statusKey: "available",
    price: 3_200_000_000, bedrooms: 6, bathrooms: 6, area: 580,
    city: "Cartagena", state: "Bolívar", neighborhood: "Bocagrande", street: "Av. San Martín # 8-146", postalCode: "130001", lat: 10.3960, lng: -75.5540,
    images: [IMG.house[0], IMG.house[3], IMG.house[5]],
  },
  {
    title: "Apartamento en el Centro Histórico",
    description: "Exclusivo apartamento en el corazón amurallado de Cartagena. Techos altos, vigas de madera y balcón colonial restaurado. Rodeado de arte, cultura y la mejor gastronomía de la ciudad.",
    typeKey: "apartment", txnKey: "sale", statusKey: "available",
    price: 780_000_000, bedrooms: 2, bathrooms: 2, area: 95,
    city: "Cartagena", state: "Bolívar", neighborhood: "Centro Histórico", street: "Calle del Arsenal # 5-62", postalCode: "130001", lat: 10.4236, lng: -75.5503,
    images: [IMG.apartment[0], IMG.apartment[2]],
  },
  {
    title: "Lote en Zona Franca para desarrollo",
    description: "Terreno de gran extensión en zona industrial estratégica de Cartagena, apto para bodegas, centros de distribución o proyectos agroindustriales. Acceso a vías principales.",
    typeKey: "land", txnKey: "sale", statusKey: "available",
    price: 1_100_000_000, bedrooms: 0, bathrooms: 0, area: 8000,
    city: "Cartagena", state: "Bolívar", neighborhood: "Zona Industrial", street: "Vía Mamonal Km 8", postalCode: "130015", lat: 10.3500, lng: -75.4700,
    images: [IMG.land[2], IMG.land[0]],
  },

  // ── BARRANQUILLA ────────────────────────────────────────────────────────────
  {
    title: "Casa en El Prado",
    description: "Señorial casa en el exclusivo barrio El Prado, zona residencial más distinguida de Barranquilla. Amplias habitaciones, patio interior con jardín y piscina. Ideal para familia grande o consultorios.",
    typeKey: "house", txnKey: "sale", statusKey: "available",
    price: 1_050_000_000, bedrooms: 5, bathrooms: 4, area: 350,
    city: "Barranquilla", state: "Atlántico", neighborhood: "El Prado", street: "Carrera 54 # 70-35", postalCode: "080020", lat: 10.9966, lng: -74.8041,
    images: [IMG.house[4], IMG.house[6], IMG.house[7]],
  },
  {
    title: "Apartamento nuevo en Alameda del Río",
    description: "Apartamento estrenar en proyecto de lujo frente al río Magdalena. Vista panorámica, piscina, área de coworking y zonas húmedas. Entrega inmediata con cocina integrada de última generación.",
    typeKey: "apartment", txnKey: "sale", statusKey: "available",
    price: 540_000_000, bedrooms: 3, bathrooms: 2, area: 98,
    city: "Barranquilla", state: "Atlántico", neighborhood: "Puerto Colombia", street: "Calle 93 # 46-55", postalCode: "080007", lat: 10.9910, lng: -74.8210,
    images: [IMG.apartment[3], IMG.apartment[4]],
  },
  {
    title: "Local comercial en Buenavista",
    description: "Local en el corazón del sector comercial de Buenavista, con 5 metros de vitrina a calle principal. Ideal para café, tienda de ropa o franquicia. Alta densidad de tráfico peatonal.",
    typeKey: "commercial", txnKey: "rent", statusKey: "available",
    price: 6_800_000, bedrooms: 0, bathrooms: 1, area: 90,
    city: "Barranquilla", state: "Atlántico", neighborhood: "Buenavista", street: "Calle 98 # 58-30", postalCode: "080020", lat: 11.0170, lng: -74.8440,
    images: [IMG.commercial[1], IMG.commercial[2]],
  },

  // ── SANTA MARTA ──────────────────────────────────────────────────────────────
  {
    title: "Casa de playa en El Rodadero",
    description: "Hermosa casa a 200 metros de la playa El Rodadero, con acceso privado, piscina y terraza tipo solarium. Completamente amoblada y lista para disfrute o renta vacacional de alta rentabilidad.",
    typeKey: "house", txnKey: "sale", statusKey: "available",
    price: 2_100_000_000, bedrooms: 5, bathrooms: 4, area: 310,
    city: "Santa Marta", state: "Magdalena", neighborhood: "El Rodadero", street: "Calle 12 # 3-40", postalCode: "470004", lat: 11.2088, lng: -74.2336,
    images: [IMG.house[2], IMG.house[0], IMG.house[3]],
  },
  {
    title: "Terreno en Gaira para proyecto turístico",
    description: "Lote de 3.000 m² en Gaira, ideal para hostal, glamping o complejo vacacional. Agua, luz y vía de acceso disponibles. A 10 minutos del Aeropuerto Simón Bolívar y del Parque Tayrona.",
    typeKey: "land", txnKey: "sale", statusKey: "available",
    price: 420_000_000, bedrooms: 0, bathrooms: 0, area: 3000,
    city: "Santa Marta", state: "Magdalena", neighborhood: "Gaira", street: "Vía a Gaira Lote 8", postalCode: "470006", lat: 11.1720, lng: -74.2180,
    images: [IMG.land[1], IMG.land[2]],
  },
];

// ── Main seed ────────────────────────────────────────────────────────────────
async function main() {
  // 1. Tipos de propiedad
  const types = [
    { id: TYPE_IDS.house,      name: "House" },
    { id: TYPE_IDS.apartment,  name: "Apartment" },
    { id: TYPE_IDS.land,       name: "Land" },
    { id: TYPE_IDS.commercial, name: "Commercial" },
  ];
  for (const t of types) {
    await prisma.property_types.upsert({ where: { name: t.name }, update: {}, create: t });
  }
  console.log("✅ Tipos de propiedad creados");

  // 2. Tipos de transacción
  const txns = [
    { id: TXN_IDS.sale, name: "Sale" },
    { id: TXN_IDS.rent, name: "Rent" },
  ];
  for (const t of txns) {
    await prisma.transaction_types.upsert({ where: { name: t.name }, update: {}, create: t });
  }
  console.log("✅ Tipos de transacción creados");

  // 3. Estados
  const statuses = [
    { id: STATUS_IDS.available,   name: "AVAILABLE" },
    { id: STATUS_IDS.sold,        name: "SOLD" },
    { id: STATUS_IDS.rented,      name: "RENTED" },
    { id: STATUS_IDS.unavailable, name: "UNAVAILABLE" },
  ];
  for (const s of statuses) {
    await prisma.property_status.upsert({ where: { name: s.name }, update: {}, create: s });
  }
  console.log("✅ Estados creados");

  // 4. Propiedades + imágenes
  let created = 0;
  for (const p of PROPERTIES) {
    const addressId = randomUUID();
    const propertyId = randomUUID();

    await prisma.addresses.create({
      data: {
        id: addressId,
        country: "Colombia",
        state: p.state,
        city: p.city,
        neighborhood: p.neighborhood,
        street: p.street,
        postal_code: p.postalCode,
        latitude: p.lat,
        longitude: p.lng,
      },
    });

    await prisma.properties.create({
      data: {
        id: propertyId,
        title: p.title,
        description: p.description,
        property_type_id: TYPE_IDS[p.typeKey],
        transaction_type_id: TXN_IDS[p.txnKey],
        status_id: STATUS_IDS[p.statusKey],
        address_id: addressId,
        agent_id: AGENT_ID,
        price: p.price,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
      },
    });

    const images = p.images.map((url, i) => ({
      id: randomUUID(),
      property_id: propertyId,
      image_url: url,
      is_primary: i === 0,
    }));

    await prisma.property_images.createMany({ data: images });
    created++;
  }

  console.log(`✅ ${created} propiedades colombianas creadas con imágenes`);
  console.log("");
  console.log("🗺️  Ciudades: Bogotá, Medellín, Cali, Cartagena, Barranquilla, Santa Marta");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());

