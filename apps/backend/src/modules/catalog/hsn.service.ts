import { IHSNLookupResult } from '@repo/shared-types';

interface HSNRule {
  categoryMatch?: RegExp | string;
  subCategoryMatch?: RegExp | string;
  productTypeMatch?: RegExp | string;
  hsnCode: string;
  gstRate: number;
  description: string;
}

const HSN_RULES: HSNRule[] = [
  // ── Electronics & Gadgets ───────────────────────────────────────────
  {
    categoryMatch: /electronic/i,
    productTypeMatch: /smart\s*phone|mobile|cellular/i,
    hsnCode: '8517',
    gstRate: 18,
    description: 'Telephone sets, smartphones, and other apparatus for transmission of voice/data',
  },
  {
    categoryMatch: /electronic/i,
    productTypeMatch: /laptop|notebook|computer|desktop|tablet/i,
    hsnCode: '8471',
    gstRate: 18,
    description: 'Automatic data processing machines, laptops, and microcomputers',
  },
  {
    categoryMatch: /electronic/i,
    productTypeMatch: /television|tv|monitor|display/i,
    hsnCode: '8528',
    gstRate: 18,
    description: 'Monitors, projectors, and television reception apparatus',
  },
  {
    categoryMatch: /electronic/i,
    productTypeMatch: /headphone|earphone|audio|speaker|soundbar|mic/i,
    hsnCode: '8518',
    gstRate: 18,
    description: 'Microphones, loudspeakers, headphones, earphones, and audio amplifiers',
  },
  {
    categoryMatch: /electronic/i,
    productTypeMatch: /charger|adapter|power\s*bank/i,
    hsnCode: '8504',
    gstRate: 18,
    description: 'Electrical transformers, static converters (rectifiers), and power banks',
  },
  {
    categoryMatch: /electronic/i,
    productTypeMatch: /cable|cord|wire|hdmi|usb/i,
    hsnCode: '8544',
    gstRate: 18,
    description: 'Insulated wire, cable, optical fibre cables, and connector cords',
  },
  {
    categoryMatch: /electronic/i,
    productTypeMatch: /smart\s*watch|fitness\s*band/i,
    hsnCode: '8517',
    gstRate: 18,
    description: 'Smart wearable devices with data transmission and wireless communication',
  },
  {
    categoryMatch: /electronic|gaming/i,
    productTypeMatch: /gaming|console|playstation|xbox|joystick/i,
    hsnCode: '9504',
    gstRate: 18,
    description: 'Video game consoles and amusement machines',
  },

  // ── Men's, Women's, Kids' Apparel & Clothing ──────────────────────────
  {
    categoryMatch: /men|women|baby|kid|apparel|clothing/i,
    productTypeMatch: /t-?shirt|polo|tank\s*top|vest/i,
    hsnCode: '6109',
    gstRate: 5,
    description: 'T-shirts, singlets, and other vests, knitted or crocheted',
  },
  {
    categoryMatch: /men|women|baby|kid/i,
    productTypeMatch: /shirt/i,
    hsnCode: '6205',
    gstRate: 5,
    description: "Men's or boys' woven shirts",
  },
  {
    categoryMatch: /men|women|baby|kid/i,
    productTypeMatch: /jean|denim|trouser|pant|chinos|jogger/i,
    hsnCode: '6203',
    gstRate: 5,
    description: "Men's or boys' suits, ensembles, trousers, bib and brace overalls, breeches",
  },
  {
    categoryMatch: /women|girl/i,
    productTypeMatch: /saree|sari/i,
    hsnCode: '5208',
    gstRate: 5,
    description: 'Woven fabrics of cotton containing 85% or more by weight, sarees',
  },
  {
    categoryMatch: /women|girl/i,
    productTypeMatch: /kurti|kurta|salwar|ethnic|lehenga/i,
    hsnCode: '6211',
    gstRate: 5,
    description: "Women's or girls' suits, dresses, skirts, divided skirts, ethnic garments",
  },
  {
    categoryMatch: /women|girl/i,
    productTypeMatch: /dress|frock|gown/i,
    hsnCode: '6204',
    gstRate: 5,
    description: "Women's or girls' dresses, skirts, divided skirts, trousers",
  },
  {
    categoryMatch: /men|women|baby|kid/i,
    productTypeMatch: /jacket|hoodie|sweater|sweatshirt|cardigan/i,
    hsnCode: '6110',
    gstRate: 12,
    description: 'Jerseys, pullovers, cardigans, waistcoats, and similar articles, knitted',
  },
  {
    categoryMatch: /men|women|baby|kid/i,
    productTypeMatch: /innerwear|brief|boxer|underwear|bra|lingerie/i,
    hsnCode: '6107',
    gstRate: 5,
    description: "Underpants, briefs, nightshirts, pyjamas, bathrobes, dressing gowns",
  },

  // ── Footwear ────────────────────────────────────────────────────────
  {
    productTypeMatch: /shoe|sneaker|loafer|boot|sandal|slipper|flip\s*flop|clog/i,
    hsnCode: '6403',
    gstRate: 12,
    description: 'Footwear with outer soles of rubber, plastics, leather, or composition leather',
  },

  // ── Food Essentials & Grocery ───────────────────────────────────────
  {
    categoryMatch: /food|grocery/i,
    productTypeMatch: /rice/i,
    hsnCode: '1006',
    gstRate: 5,
    description: 'Rice (semi-milled or wholly milled, pre-packaged and labelled)',
  },
  {
    categoryMatch: /food|grocery/i,
    productTypeMatch: /flour|atta|maida|besan/i,
    hsnCode: '1101',
    gstRate: 5,
    description: 'Wheat or meslin flour, cereal flours, pre-packaged and labelled',
  },
  {
    categoryMatch: /food|grocery/i,
    productTypeMatch: /dal|pulse|lentil/i,
    hsnCode: '0713',
    gstRate: 5,
    description: 'Dried leguminous vegetables, shelled, whether or not skinned or split',
  },
  {
    categoryMatch: /food|grocery/i,
    productTypeMatch: /oil|ghee|butter/i,
    hsnCode: '1512',
    gstRate: 5,
    description: 'Vegetable oils, sunflower, mustard, olive oils, and clarified butter',
  },
  {
    categoryMatch: /food|grocery/i,
    productTypeMatch: /spice|masala|turmeric|chilli|coriander/i,
    hsnCode: '0910',
    gstRate: 5,
    description: 'Ginger, saffron, turmeric (curcuma), thyme, bay leaves, curry and other spices',
  },
  {
    categoryMatch: /food|grocery/i,
    productTypeMatch: /tea/i,
    hsnCode: '0902',
    gstRate: 5,
    description: 'Tea, whether or not flavoured',
  },
  {
    categoryMatch: /food|grocery/i,
    productTypeMatch: /coffee/i,
    hsnCode: '0901',
    gstRate: 5,
    description: 'Coffee, whether or not roasted or decaffeinated',
  },
  {
    categoryMatch: /food|grocery/i,
    productTypeMatch: /biscuit|cookie|cracker|rusk/i,
    hsnCode: '1905',
    gstRate: 18,
    description: 'Bread, pastry, cakes, biscuits, and other bakers wares',
  },
  {
    categoryMatch: /food|grocery/i,
    productTypeMatch: /chocolate|candy|confectionery/i,
    hsnCode: '1806',
    gstRate: 18,
    description: 'Chocolate and other food preparations containing cocoa',
  },
  {
    categoryMatch: /food|grocery/i,
    productTypeMatch: /noodle|pasta|snack|chips/i,
    hsnCode: '1902',
    gstRate: 12,
    description: 'Pasta, whether or not cooked or stuffed, and instant noodles',
  },

  // ── Health, Nutrition & Medical Supplies ────────────────────────────
  {
    categoryMatch: /health|medical|pharmacy/i,
    productTypeMatch: /medicine|tablet|capsule|syrup|ointment/i,
    hsnCode: '3004',
    gstRate: 12,
    description: 'Medicaments consisting of mixed or unmixed products for therapeutic uses',
  },
  {
    categoryMatch: /health|medical/i,
    productTypeMatch: /mask|bandage|gauze|first\s*aid/i,
    hsnCode: '3005',
    gstRate: 12,
    description: 'Wadding, gauze, bandages, and similar medical articles',
  },
  {
    categoryMatch: /health|nutrition/i,
    productTypeMatch: /protein|supplement|vitamin|multivitamin|creatine/i,
    hsnCode: '2106',
    gstRate: 18,
    description: 'Food preparations and dietary health supplements not elsewhere specified',
  },
  {
    categoryMatch: /medical/i,
    productTypeMatch: /thermometer|oximeter|bp\s*monitor|stethoscope|glucometer/i,
    hsnCode: '9018',
    gstRate: 12,
    description: 'Instruments and appliances used in medical, surgical, or veterinary sciences',
  },

  // ── Beauty & Personal Care ──────────────────────────────────────────
  {
    categoryMatch: /beauty|personal/i,
    productTypeMatch: /soap|body\s*wash|shower\s*gel/i,
    hsnCode: '3401',
    gstRate: 18,
    description: 'Soap, organic surface-active products and preparations for use as soap',
  },
  {
    categoryMatch: /beauty|personal/i,
    productTypeMatch: /shampoo|conditioner|hair\s*oil/i,
    hsnCode: '3305',
    gstRate: 18,
    description: 'Preparations for use on the hair',
  },
  {
    categoryMatch: /beauty|personal/i,
    productTypeMatch: /perfume|deodorant|fragrance|cologne/i,
    hsnCode: '3303',
    gstRate: 18,
    description: 'Perfumes and toilet waters, personal deodorants and antiperspirants',
  },
  {
    categoryMatch: /beauty|personal/i,
    productTypeMatch: /cream|lotion|serum|sunscreen|moisturizer/i,
    hsnCode: '3304',
    gstRate: 18,
    description: 'Beauty or make-up preparations and preparations for the care of the skin',
  },

  // ── Books & Stationery ──────────────────────────────────────────────
  {
    categoryMatch: /book/i,
    productTypeMatch: /book|novel|textbook|biography/i,
    hsnCode: '4901',
    gstRate: 0,
    description: 'Printed books, brochures, leaflets, and similar printed matter (Exempt from GST)',
  },
  {
    categoryMatch: /stationery/i,
    productTypeMatch: /notebook|register|diary|journal/i,
    hsnCode: '4820',
    gstRate: 12,
    description: 'Registers, account books, note books, order books, receipt books',
  },
  {
    categoryMatch: /stationery/i,
    productTypeMatch: /pen|pencil|marker|highlighter/i,
    hsnCode: '9608',
    gstRate: 18,
    description: 'Ball point pens, felt tipped pens, markers, fountain pens',
  },

  // ── Home & Furniture ────────────────────────────────────────────────
  {
    categoryMatch: /home|furniture/i,
    productTypeMatch: /sofa|bed|chair|table|desk|wardrobe|cabinet/i,
    hsnCode: '9403',
    gstRate: 18,
    description: 'Other furniture and parts thereof',
  },
  {
    categoryMatch: /home|furniture/i,
    productTypeMatch: /mattress|pillow|cushion/i,
    hsnCode: '9404',
    gstRate: 18,
    description: 'Mattress supports, articles of bedding and similar furnishing',
  },
  {
    categoryMatch: /home|furniture/i,
    productTypeMatch: /curtain|bedsheet|blanket|towel/i,
    hsnCode: '6302',
    gstRate: 5,
    description: 'Bed linen, table linen, toilet linen, and kitchen linen',
  },

  // ── Auto Accessories & Spares ───────────────────────────────────────
  {
    categoryMatch: /auto/i,
    productTypeMatch: /helmet/i,
    hsnCode: '6506',
    gstRate: 18,
    description: 'Safety headgear and motorcycle helmets',
  },
  {
    categoryMatch: /auto/i,
    productTypeMatch: /part|spare|mirror|brake|spark|plug|filter/i,
    hsnCode: '8714',
    gstRate: 18,
    description: 'Parts and accessories of vehicles of headings 8711 to 8713',
  },
  {
    categoryMatch: /auto/i,
    productTypeMatch: /engine\s*oil|lubricant/i,
    hsnCode: '2710',
    gstRate: 18,
    description: 'Petroleum oils, lubricating oils, and greases',
  },

  // ── Sports, Fitness & Toys ──────────────────────────────────────────
  {
    categoryMatch: /sport|fitness/i,
    productTypeMatch: /bat|racket|ball|glove|shuttlecock/i,
    hsnCode: '9506',
    gstRate: 12,
    description: 'Articles and equipment for general physical exercise, gymnastics, athletics, other sports',
  },
  {
    categoryMatch: /baby|kid|toy/i,
    productTypeMatch: /toy|doll|board\s*game|puzzle/i,
    hsnCode: '9503',
    gstRate: 12,
    description: 'Tricycles, scooters, pedal cars, dolls, other toys, scale models and puzzles',
  },
];

/**
 * Intelligent HSN & GST slab resolution service.
 * Matches category, subcategory, and product type against statutory Indian GST schedules.
 */
export function resolveHSNAndGST(
  category: string,
  subcategory: string = '',
  productType: string = '',
): IHSNLookupResult {
  const combined = `${category} ${subcategory} ${productType}`.trim();

  for (const rule of HSN_RULES) {
    const catMatch = !rule.categoryMatch || (rule.categoryMatch instanceof RegExp
      ? rule.categoryMatch.test(category) || rule.categoryMatch.test(combined)
      : combined.toLowerCase().includes(rule.categoryMatch.toLowerCase()));

    const prodMatch = !rule.productTypeMatch || (rule.productTypeMatch instanceof RegExp
      ? rule.productTypeMatch.test(productType) || rule.productTypeMatch.test(combined)
      : combined.toLowerCase().includes(rule.productTypeMatch.toLowerCase()));

    if (catMatch && prodMatch) {
      return {
        hsnCode: rule.hsnCode,
        gstRate: rule.gstRate,
        description: rule.description,
        category,
      };
    }
  }

  // Broad Vertical Fallbacks
  const catLower = category.toLowerCase();
  if (catLower.includes('electronic') || catLower.includes('gaming')) {
    return { hsnCode: '8517', gstRate: 18, description: 'Electronic items and accessories', category };
  }
  if (catLower.includes('men') || catLower.includes('women') || catLower.includes('kid') || catLower.includes('fashion')) {
    return { hsnCode: '6203', gstRate: 5, description: 'Apparel and textiles (Standard slab)', category };
  }
  if (catLower.includes('food') || catLower.includes('grocery')) {
    return { hsnCode: '2106', gstRate: 5, description: 'Food preparations and grocery staples', category };
  }
  if (catLower.includes('health') || catLower.includes('medical')) {
    return { hsnCode: '3004', gstRate: 12, description: 'Medical and healthcare formulations', category };
  }
  if (catLower.includes('book')) {
    return { hsnCode: '4901', gstRate: 0, description: 'Printed books and educational literature', category };
  }
  if (catLower.includes('auto')) {
    return { hsnCode: '8708', gstRate: 18, description: 'Motor vehicle parts and accessories', category };
  }

  // General default Indian GST rate
  return {
    hsnCode: '9983',
    gstRate: 18,
    description: 'General merchandise and consumer goods',
    category,
  };
}
