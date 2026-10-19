"use client";

import { useState, useMemo } from "react";
import { branding } from "@repo/shared-types";
import {
  Info,
  Shield,
  Store,
  Lock,
  RotateCcw,
  Scale,
  Mail,
  Phone,
  MapPin,
  Clock,
  UserCheck,
} from "lucide-react";

export type PolicyTab =
  | "customer"
  | "seller"
  | "privacy"
  | "refund"
  | "grievance";

interface PolicySection {
  id: string;
  number: number;
  title: string;
  items: {
    num: string;
    text: string | React.ReactNode;
  }[];
}

interface PolicyCategory {
  id: PolicyTab;
  title: string;
  badge: string;
  icon: typeof Shield;
  preamble: string;
  sections: PolicySection[];
}

const policiesData: Record<PolicyTab, PolicyCategory> = {
  customer: {
    id: "customer",
    title: "Customer Terms & Conditions",
    badge: "For Shoppers",
    icon: Shield,
    preamble:
      'These Customer Terms & Conditions ("Terms`) govern your access to and use of ${branding.appName}, including the ${branding.appName} website, mobile application, store pages, product listings, ordering features and related services (collectively, the `Platform"). The Platform is operated by ${branding.legalEntity} (`${branding.appName}`, "we", "us" or "our"). By accessing or using the Platform, placing an order, creating an account or otherwise using our Services, you agree to these Terms and applicable law.',
    sections: [
      {
        id: "cust-acceptance",
        number: 1,
        title: "Acceptance of Terms",
        items: [
          {
            num: "1.1",
            text: "You may use the Platform only if you can legally enter into a binding contract under applicable law. By using the Platform, you confirm that the information provided by you is accurate and that you will comply with these Terms, applicable laws and any additional terms displayed for a particular service.",
          },
        ],
      },
      {
        id: "cust-definitions",
        number: 2,
        title: "Definitions",
        items: [
          {
            num: "2.1",
            text: '"Customer", "you" or "your" means a person who accesses the Platform or purchases products through it.',
          },
          {
            num: "2.2",
            text: `"Seller" or "Retailer" means a store or business listing products on ${branding.appName}.`,
          },
          {
            num: "2.3",
            text: '"Product" means any product displayed or offered by a Seller through the Platform.',
          },
          {
            num: "2.4",
            text: '"Order" means a request submitted by a Customer to purchase one or more Products.',
          },
          {
            num: "2.5",
            text: `"Services" means the Platform, discovery, ordering, payment facilitation, delivery/pickup coordination and other services offered by ${branding.appName}.`,
          },
          {
            num: "2.6",
            text: `"Delivery Partner" means a third party engaged by ${branding.appName}, a Seller or another service provider to facilitate delivery, where applicable.`,
          },
        ],
      },
      {
        id: "cust-marketplace",
        number: 3,
        title: `${branding.appName} as a Marketplace`,
        items: [
          {
            num: "3.1",
            text: `${branding.appName} is a marketplace and technology platform connecting Customers with participating local retailers. Unless expressly stated otherwise, ${branding.appName} does not manufacture, own, stock or independently sell the Products listed by Sellers.`,
          },
          {
            num: "3.2",
            text: `The Seller is primarily responsible for the accuracy of product information, availability, pricing, quality, authenticity, packaging, invoicing, warranties (where applicable) and fulfilment of the Product. ${branding.appName} may facilitate discovery, ordering, payments, support and delivery coordination.`,
          },
          {
            num: "3.3",
            text: "Nothing in these Terms removes or limits any responsibility or consumer right that cannot lawfully be excluded under applicable law.",
          },
        ],
      },
      {
        id: "cust-account-security",
        number: 4,
        title: "Account Registration and Security",
        items: [
          {
            num: "4.1",
            text: "You may be required to create an account or provide a mobile number, email address or other information to use certain features.",
          },
          {
            num: "4.2",
            text: "You must provide accurate, current and complete information and update it when necessary.",
          },
          {
            num: "4.3",
            text: "You are responsible for maintaining the confidentiality of passwords, OTPs and account credentials.",
          },
          {
            num: "4.4",
            text: `You must immediately notify ${branding.appName} if you suspect unauthorised access or misuse of your account.`,
          },
          {
            num: "4.5",
            text: `${branding.appName} may suspend or restrict an account where there is reasonable evidence of fraud, misuse, security risk or material violation of these Terms.`,
          },
        ],
      },
      {
        id: "cust-store-product-info",
        number: 5,
        title: "Store and Product Information",
        items: [
          {
            num: "5.1",
            text: `Sellers are responsible for the information displayed on their store and product pages. ${branding.appName} may display product names, images, descriptions, sizes, colours, variants, prices, discounts, taxes, availability and other information supplied by Sellers.`,
          },
          {
            num: "5.2",
            text: "Product images are intended for representation and actual colour, appearance or packaging may vary.",
          },
          {
            num: "5.3",
            text: "Availability may change before an Order is accepted or fulfilled.",
          },
          {
            num: "5.4",
            text: `${branding.appName} may correct obvious errors, update information or remove listings that appear inaccurate, unlawful or misleading.`,
          },
          {
            num: "5.5",
            text: "A listing does not guarantee that a Product will remain available or that an Order will necessarily be accepted.",
          },
        ],
      },
      {
        id: "cust-pricing-taxes-offers",
        number: 6,
        title: "Pricing, Taxes and Offers",
        items: [
          {
            num: "6.1",
            text: "The applicable price, taxes, delivery charges and other disclosed charges will be shown during the ordering process, where applicable. Prices may change without prior notice, but changes will not ordinarily affect an Order that has already been accepted except where correction or cancellation is required by law or due to an obvious error.",
          },
          {
            num: "6.2",
            text: "Coupons, discounts and promotional offers may have additional conditions, validity periods, minimum order values, store/category restrictions or usage limits. Unless stated otherwise, offers cannot be exchanged for cash.",
          },
        ],
      },
      {
        id: "cust-orders-acceptance",
        number: 7,
        title: "Placing and Accepting Orders",
        items: [
          {
            num: "7.1",
            text: "You select Products, provide required information and submit an Order through the Platform.",
          },
          {
            num: "7.2",
            text: "The Platform may display an acknowledgement that your Order has been received. This acknowledgement does not necessarily mean the Seller has accepted the Order.",
          },
          {
            num: "7.3",
            text: "An Order becomes accepted when the Platform or Seller confirms acceptance through the applicable process.",
          },
          {
            num: "7.4",
            text: "The Seller may reject or cancel an Order for reasons including lack of stock, pricing or listing errors, inability to fulfil, suspected fraud, store closure or other legitimate reasons.",
          },
          {
            num: "7.5",
            text: `Where an Order is cancelled and a refund is due, ${branding.appName} will process or facilitate the refund in accordance with the Refund & Cancellation Policy.`,
          },
        ],
      },
      {
        id: "cust-delivery-pickup",
        number: 8,
        title: "Delivery and Pickup",
        items: [
          {
            num: "8.1",
            text: `Where delivery is available, delivery may be performed by a Seller, ${branding.appName} or a third-party Delivery Partner. Estimated delivery times are indicative and may be affected by store preparation, traffic, weather, location, demand and other circumstances.`,
          },
          {
            num: "8.2",
            text: "You must provide a correct delivery address and contact details and remain reasonably available to receive the Order.",
          },
          {
            num: "8.3",
            text: "Additional delivery attempts or charges may apply where permitted and clearly disclosed.",
          },
          {
            num: "8.4",
            text: "For pickup Orders, you may be required to collect the Order from the relevant store within the applicable collection period.",
          },
          {
            num: "8.5",
            text: `${branding.appName} may use location information, where permitted and enabled, to assist with store discovery, delivery and service functionality.`,
          },
        ],
      },
      {
        id: "cust-payments",
        number: 9,
        title: "Payments",
        items: [
          {
            num: "9.1",
            text: "Payments may be processed through third-party payment gateways or other payment providers. You authorise the applicable provider to process the transaction for the amount displayed at checkout.",
          },
          {
            num: "9.2",
            text: `${branding.appName} does not ask Customers to disclose OTPs, PINs, CVVs or full payment credentials to customer-support personnel.`,
          },
          {
            num: "9.3",
            text: "If a transaction fails, is reversed or is debited without a corresponding successful Order, the transaction will be handled according to the payment provider's status and applicable refund process.",
          },
          {
            num: "9.4",
            text: "You must not use stolen, unauthorised or fraudulent payment instruments.",
          },
        ],
      },
      {
        id: "cust-cancellations-returns",
        number: 10,
        title: "Cancellation, Returns and Refunds",
        items: [
          {
            num: "10.1",
            text: `Cancellation, return, replacement and refund rights depend on the Order status, Product category, Seller policy and applicable law. Please refer to the ${branding.appName} Refund & Cancellation Policy, which forms part of these Terms.`,
          },
          {
            num: "10.2",
            text: "Products that are damaged, defective, incorrect or materially different may qualify for a return/replacement/refund subject to applicable conditions.",
          },
          {
            num: "10.3",
            text: "Certain Products may be non-returnable or subject to special conditions where permitted by law.",
          },
          {
            num: "10.4",
            text: "Where evidence is reasonably required, Customers may be asked to provide photographs, videos, packaging information or other Order details.",
          },
          {
            num: "10.5",
            text: "Approved refunds may be returned to the original payment method or another permitted method and may take additional time to reflect due to banks/payment providers.",
          },
        ],
      },
      {
        id: "cust-reviews-content",
        number: 11,
        title: "Reviews, Ratings and Customer Content",
        items: [
          {
            num: "11.1",
            text: "Customers may be permitted to submit ratings, reviews, photographs or other content. Content must be genuine, relevant and based on the Customer's actual experience.",
          },
          {
            num: "11.2",
            text: "Do not post false, misleading, abusive, threatening, defamatory, discriminatory, obscene or unlawful content.",
          },
          {
            num: "11.3",
            text: "Do not publish personal information, payment details, OTPs, passwords or other confidential information.",
          },
          {
            num: "11.4",
            text: "Do not copy another person's photographs, reviews or other protected content without permission.",
          },
          {
            num: "11.5",
            text: "Do not manipulate ratings, create fake Orders or offer/accept benefits in exchange for reviews.",
          },
          {
            num: "11.6",
            text: `${branding.appName} may moderate, remove or restrict content or review activity that violates these rules or applicable law.`,
          },
          {
            num: "11.7",
            text: `By submitting content, you grant ${branding.appName} a non-exclusive, royalty-free, worldwide licence to host, display, reproduce and use that content for operating, improving and promoting the Platform, subject to applicable law and our Privacy Policy.`,
          },
        ],
      },
      {
        id: "cust-prohibited-activities",
        number: 12,
        title: "Prohibited Activities",
        items: [
          {
            num: "12.1",
            text: "Fraudulent Orders, payment fraud, fake accounts or identity misrepresentation.",
          },
          {
            num: "12.2",
            text: "Abuse of coupons, refunds, cancellations or customer-support processes.",
          },
          {
            num: "12.3",
            text: "Unauthorised scraping, automated access, reverse engineering or interference with Platform security.",
          },
          {
            num: "12.4",
            text: "Uploading malicious code or attempting to access another user's account or non-public data.",
          },
          {
            num: "12.5",
            text: "Using the Platform to sell, promote or facilitate unlawful goods or activities.",
          },
          {
            num: "12.6",
            text: `Harassment, threats, hate speech or unlawful conduct directed at Customers, Sellers, Delivery Partners or ${branding.appName} personnel.`,
          },
        ],
      },
      {
        id: "cust-intellectual-property",
        number: 13,
        title: "Intellectual Property",
        items: [
          {
            num: "13.1",
            text: `The Platform and its software, design, branding, logos, text, graphics and other ${branding.appName}-created materials are owned by or licensed to ${branding.appName} and may not be copied, modified, distributed or commercially exploited without permission. Seller and third-party trademarks remain the property of their respective owners.`,
          },
        ],
      },
      {
        id: "cust-third-party-services",
        number: 14,
        title: "Third-Party Services and Links",
        items: [
          {
            num: "14.1",
            text: `The Platform may integrate payment services, maps, analytics, delivery services, social features or other third-party services. Their availability and use may be subject to their own terms and privacy policies. ${branding.appName} is not responsible for independent third-party systems beyond the extent required by applicable law.`,
          },
        ],
      },
      {
        id: "cust-availability-changes",
        number: 15,
        title: "Availability and Changes",
        items: [
          {
            num: "15.1",
            text: `${branding.appName} may modify, suspend or discontinue features, stores, categories or other parts of the Platform from time to time. We may also update these Terms. Material changes may be communicated through the Platform or other appropriate means. Continued use after the effective date of revised Terms constitutes acceptance to the extent permitted by law.`,
          },
        ],
      },
      {
        id: "cust-disclaimer-limitation",
        number: 16,
        title: "Disclaimer and Limitation",
        items: [
          {
            num: "16.1",
            text: `${branding.appName} aims to provide accurate and reliable Platform services but does not guarantee uninterrupted availability or that every listing, price, image, stock status or delivery estimate will always be error-free.`,
          },
          {
            num: "16.2",
            text: `To the maximum extent permitted by law, ${branding.appName} will not be responsible for losses arising solely from matters outside its reasonable control. Nothing in these Terms excludes liability that cannot legally be excluded or limits statutory consumer rights.`,
          },
        ],
      },
      {
        id: "cust-indemnity",
        number: 17,
        title: "Indemnity",
        items: [
          {
            num: "17.1",
            text: `To the extent permitted by law, you agree to indemnify ${branding.appName} against claims, losses or expenses arising from your unlawful use of the Platform, fraud, violation of these Terms or infringement of third-party rights.`,
          },
        ],
      },
      {
        id: "cust-suspension-termination",
        number: 18,
        title: "Suspension and Termination",
        items: [
          {
            num: "18.1",
            text: `${branding.appName} may suspend or terminate access for fraud, misuse, security concerns, unlawful conduct or material breach. Where appropriate, we may provide notice or an opportunity to remedy the issue. Termination does not affect rights or obligations that accrued before termination.`,
          },
        ],
      },
      {
        id: "cust-governing-law",
        number: 19,
        title: "Governing Law and Disputes",
        items: [
          {
            num: "19.1",
            text: "These Terms are governed by the laws of India. Subject to applicable consumer-protection and other mandatory laws, disputes will be subject to the competent courts having jurisdiction over Durg, Chhattisgarh, India.",
          },
        ],
      },
      {
        id: "cust-contact-grievance",
        number: 20,
        title: "Contact and Grievance",
        items: [
          {
            num: "20.1",
            text: (
              <span>
                For support, please contact{" "}
                <a
                  href={`mailto:${branding.supportEmail}`}
                  className="text-blue-600 font-semibold underline"
                >
                  ${branding.supportEmail}
                </a>
                . For escalation, please refer to our Grievance Redressal Policy
                and the Grievance Officer details published below.
              </span>
            ),
          },
        ],
      },
    ],
  },
  seller: {
    id: "seller",
    title: "Seller Terms & Conditions",
    badge: "For Retailers",
    icon: Store,
    preamble:
      `These Seller Terms govern the onboarding and use of ${branding.appName} by retailers, stores, brands and other businesses ("Seller", "you" or "your"). They apply to your store profile, product catalogue, inventory, orders, customer interactions, payments/settlements and other Seller services.`,
    sections: [
      {
        id: "seller-eligibility",
        number: 1,
        title: "Seller Eligibility and Verification",
        items: [
          {
            num: "1.1",
            text: `The Seller must be legally capable of operating the relevant retail/business activity and must provide accurate registration, ownership, tax, bank and contact information requested by ${branding.appName}.`,
          },
          {
            num: "1.2",
            text: `${branding.appName} may conduct KYC, business verification or other checks and may request supporting documents.`,
          },
          {
            num: "1.3",
            text: "The person registering a store represents that they are authorised to act for the business.",
          },
          {
            num: "1.4",
            text: "Sellers must maintain all licences, registrations, permissions and tax registrations required for their business and Products.",
          },
        ],
      },
      {
        id: "seller-account-profile",
        number: 2,
        title: "Seller Account and Store Profile",
        items: [
          {
            num: "2.1",
            text: "Sellers are responsible for maintaining accurate store name, address, contact details, business hours, service areas and other store information.",
          },
          {
            num: "2.2",
            text: "Login credentials and Seller PINs must be kept secure.",
          },
          {
            num: "2.3",
            text: "Sellers must promptly report unauthorised access or suspected misuse.",
          },
          {
            num: "2.4",
            text: `${branding.appName} may restrict access if account information is false, incomplete or creates a security or compliance risk.`,
          },
        ],
      },
      {
        id: "seller-listings-catalogue",
        number: 3,
        title: "Product Listings and Catalogue",
        items: [
          {
            num: "3.1",
            text: "Sellers must ensure that every listing is accurate, current and sufficiently descriptive for Customers to make informed purchasing decisions.",
          },
          {
            num: "3.2",
            text: "Product title, category, images, description, size, colour, variant, material, quantity and other relevant attributes must be accurate.",
          },
          {
            num: "3.3",
            text: "Images must represent the actual Product and must not infringe third-party rights.",
          },
          {
            num: "3.4",
            text: "Prices, discounts, taxes and other charges must be displayed accurately.",
          },
          {
            num: "3.5",
            text: "Sellers must promptly remove or update discontinued, unavailable or incorrectly listed Products.",
          },
          {
            num: "3.6",
            text: `${branding.appName} may edit formatting, categorisation or presentation for Platform consistency without changing the substance of a listing.`,
          },
        ],
      },
      {
        id: "seller-legality-quality",
        number: 4,
        title: "Product Legality, Authenticity and Quality",
        items: [
          {
            num: "4.1",
            text: `The Seller is responsible for ensuring that Products listed on ${branding.appName} are genuine, lawful, safe where applicable and compliant with all applicable standards, labelling, packaging, consumer-protection and tax requirements.`,
          },
          {
            num: "4.2",
            text: `Counterfeit, stolen, prohibited, unlawful or materially misrepresented Products must not be listed. ${branding.appName} may remove such listings and take account-level action.`,
          },
        ],
      },
      {
        id: "seller-inventory-fulfilment",
        number: 5,
        title: "Inventory and Order Fulfilment",
        items: [
          {
            num: "5.1",
            text: "Sellers must maintain reasonably accurate inventory.",
          },
          {
            num: "5.2",
            text: "Accepted Orders should be prepared, packed and handed over within the applicable time communicated through the Platform.",
          },
          {
            num: "5.3",
            text: "Sellers must not knowingly accept Orders for unavailable Products.",
          },
          {
            num: "5.4",
            text: `If a Product becomes unavailable after an Order is placed, the Seller must promptly update ${branding.appName} and cooperate with cancellation/refund procedures.`,
          },
          {
            num: "5.5",
            text: "Repeated stock-related cancellations or non-fulfilment may lead to restrictions.",
          },
        ],
      },
      {
        id: "seller-packaging-delivery",
        number: 6,
        title: "Packaging, Delivery and Pickup",
        items: [
          {
            num: "6.1",
            text: "Sellers must package Products appropriately for the Product type and hand them over in a condition reasonably suitable for delivery or pickup.",
          },
          {
            num: "6.2",
            text: "For delivery Orders, the Seller must cooperate with the applicable Delivery Partner and follow handover procedures.",
          },
          {
            num: "6.3",
            text: "For pickup Orders, the Seller must keep the accepted Order ready for collection.",
          },
          {
            num: "6.4",
            text: "The Seller must not collect undisclosed charges from Customers for a confirmed Order.",
          },
          {
            num: "6.5",
            text: "Delivery charges, where applicable, will be communicated through the relevant commercial or customer-facing flow.",
          },
        ],
      },
      {
        id: "seller-cancellations-returns",
        number: 7,
        title: "Cancellations, Returns and Refunds",
        items: [
          {
            num: "7.1",
            text: `Sellers must follow the applicable ${branding.appName} Refund & Cancellation Policy, category rules and applicable law.`,
          },
          {
            num: "7.2",
            text: "Sellers must cooperate with requests relating to damaged, defective, incorrect or materially different Products.",
          },
          {
            num: "7.3",
            text: "Where the Seller is responsible for a valid refund or replacement, the Seller may be responsible for the corresponding amount or adjustment under the applicable commercial arrangement.",
          },
          {
            num: "7.4",
            text: "Sellers must not improperly reject legitimate consumer rights.",
          },
          {
            num: "7.5",
            text: "Repeated or unreasonable cancellation, return or refund disputes may be investigated.",
          },
        ],
      },
      {
        id: "seller-customer-info",
        number: 8,
        title: "Customer Information",
        items: [
          {
            num: "8.1",
            text: `Customer information received through ${branding.appName} must be used only for legitimate purposes connected with the Order, fulfilment, support, returns or other authorised activities.`,
          },
          {
            num: "8.2",
            text: "Do not use Customer information for unrelated marketing without an appropriate legal basis or required consent.",
          },
          {
            num: "8.3",
            text: "Do not sell, rent or disclose Customer information to unauthorised third parties.",
          },
          {
            num: "8.4",
            text: "Do not retain Customer information longer than reasonably required for legitimate business or legal purposes.",
          },
          {
            num: "8.5",
            text: "Protect Customer information against unauthorised access, disclosure or misuse.",
          },
        ],
      },
      {
        id: "seller-fees-settlements",
        number: 9,
        title: "Seller Fees and Settlements",
        items: [
          {
            num: "9.1",
            text: "Subscription fees, platform fees, commissions, transaction charges, delivery-related charges and settlement terms, if any, will be governed by the Seller's applicable commercial plan or order form displayed/agreed separately.",
          },
          {
            num: "9.2",
            text: `${branding.appName} may make deductions or adjustments where contractually permitted, including for refunds, chargebacks, applicable fees or other amounts properly due under the commercial arrangement.`,
          },
        ],
      },
      {
        id: "seller-taxes-invoicing",
        number: 10,
        title: "Taxes and Invoicing",
        items: [
          {
            num: "10.1",
            text: "Sellers are responsible for issuing legally compliant invoices and maintaining their own books, tax records, GST registrations and statutory filings as applicable to their business.",
          },
          {
            num: "10.2",
            text: `Where ${branding.appName} provides billing or invoicing tools, the Seller remains responsible for verifying the correctness of the information used in invoices and statutory documents.`,
          },
        ],
      },
      {
        id: "seller-content-ip",
        number: 11,
        title: "Seller Content and Intellectual Property",
        items: [
          {
            num: "11.1",
            text: `The Seller retains ownership of its trademarks, product images, catalogue content and other materials supplied to ${branding.appName}, subject to the rights granted below.`,
          },
          {
            num: "11.2",
            text: `The Seller grants ${branding.appName} a non-exclusive, royalty-free, worldwide licence to host, reproduce, resize, format, display and use Seller content for operating, marketing and improving the Platform and facilitating sales, subject to applicable law.`,
          },
          {
            num: "11.3",
            text: "The Seller represents that it has the rights necessary to provide such content.",
          },
        ],
      },
      {
        id: "seller-reviews-feedback",
        number: 12,
        title: "Reviews and Customer Feedback",
        items: [
          {
            num: "12.1",
            text: "Sellers must not create, purchase, manipulate or incentivise fake reviews. Sellers must not threaten or pressure Customers to change ratings. Genuine customer feedback may be displayed and moderated in accordance with Platform rules.",
          },
        ],
      },
      {
        id: "seller-prohibited-conduct",
        number: 13,
        title: "Prohibited Seller Conduct",
        items: [
          {
            num: "13.1",
            text: "Counterfeit, stolen, prohibited or unlawful Products.",
          },
          {
            num: "13.2",
            text: "False business information, misleading product descriptions or deceptive pricing.",
          },
          {
            num: "13.3",
            text: "Fake Orders, self-orders, review manipulation or promotional abuse.",
          },
          {
            num: "13.4",
            text: `Circumvention of ${branding.appName} systems to divert Customers in breach of an applicable commercial agreement.`,
          },
          {
            num: "13.5",
            text: "Misuse of Customer information.",
          },
          {
            num: "13.6",
            text: `Harassment, threats, discrimination or unlawful conduct toward Customers, Delivery Partners or ${branding.appName} personnel.`,
          },
          {
            num: "13.7",
            text: "Unauthorised attempts to access Platform systems or other Seller accounts.",
          },
        ],
      },
      {
        id: "seller-suspension-termination",
        number: 14,
        title: "Monitoring, Suspension and Termination",
        items: [
          {
            num: "14.1",
            text: `${branding.appName} may investigate Seller activity and may temporarily restrict, suspend or terminate an account where there is suspected fraud, repeated non-fulfilment, unlawful Products, material misrepresentation, security risk or material breach of these Terms.`,
          },
          {
            num: "14.2",
            text: `Where appropriate, ${branding.appName} may request clarification or corrective action before taking final action. Suspension or termination does not remove obligations relating to pending Orders, refunds, customer complaints, payments, taxes or applicable law.`,
          },
        ],
      },
      {
        id: "seller-indemnity",
        number: 15,
        title: "Indemnity and Responsibility",
        items: [
          {
            num: "15.1",
            text: "To the extent permitted by law, the Seller is responsible for claims, losses, penalties or expenses arising from its Products, listings, business operations, unlawful conduct, tax non-compliance, infringement of third-party rights or breach of these Terms.",
          },
        ],
      },
      {
        id: "seller-governing-law",
        number: 16,
        title: "Governing Law and Seller Grievance",
        items: [
          {
            num: "16.1",
            text: (
              <span>
                These Terms are governed by Indian law. Subject to mandatory law
                and the parties&apos; applicable commercial agreement, disputes
                will be subject to the competent courts having jurisdiction over
                Durg, Chhattisgarh, India. Seller complaints may be raised
                through{" "}
                <a
                  href={`mailto:${branding.supportEmail}`}
                  className="text-blue-600 font-semibold underline"
                >
                  ${branding.supportEmail}
                </a>{" "}
                and escalated under the Grievance Redressal Policy.
              </span>
            ),
          },
        ],
      },
    ],
  },
  privacy: {
    id: "privacy",
    title: "Privacy Policy",
    badge: "Data Protection",
    icon: Lock,
    preamble:
      `Your privacy matters to ${branding.appName}. This Privacy Policy explains how ${branding.appName} collects, uses, stores, shares and protects information when you use the ${branding.appName} Platform and Services. This Policy applies to Customers, Sellers and other users of the Platform. It should be read together with the applicable Terms and other notices presented at the time information is collected.`,
    sections: [
      {
        id: "priv-acceptance",
        number: 1,
        title: "Acceptance and Applicable Law",
        items: [
          {
            num: "1.1",
            text: `By accessing or using the Platform, you acknowledge this Policy. ${branding.appName} processes personal data in accordance with applicable Indian data-protection, consumer-protection and other laws as applicable from time to time. Where consent or another legal basis is required, ${branding.appName} will process data accordingly.`,
          },
        ],
      },
      {
        id: "priv-info-collected",
        number: 2,
        title: "Information We May Collect",
        items: [
          {
            num: "2.1",
            text: "Information You Provide: Name, mobile number, email address and account/login information; delivery, billing and pickup addresses; order, transaction, payment status and refund information; seller business details, tax/business identifiers, bank details and KYC documents; communications, reviews, ratings and support requests.",
          },
          {
            num: "2.2",
            text: "Information Collected Automatically: IP address, browser type, device type, operating system; searches, pages/screens visited and interaction data; approximate or precise location where enabled; cookies and similar technologies used for login, preferences and security.",
          },
          {
            num: "2.3",
            text: "Information From Third Parties: We may receive information from payment providers, delivery partners, analytics providers, identity verification services and fraud-prevention providers where permitted by law.",
          },
        ],
      },
      {
        id: "priv-use-info",
        number: 3,
        title: "How We Use Information",
        items: [
          {
            num: "3.1",
            text: "Create and manage accounts and verify identity or business information.",
          },
          {
            num: "3.2",
            text: "Display stores and products and provide discovery functionality.",
          },
          {
            num: "3.3",
            text: "Process Orders, payments, delivery, pickup, returns, replacements and refunds.",
          },
          {
            num: "3.4",
            text: "Share necessary Order information with the relevant Seller and delivery/service provider.",
          },
          {
            num: "3.5",
            text: "Provide customer and seller support and resolve disputes or complaints.",
          },
          {
            num: "3.6",
            text: "Prevent and detect fraud, abuse, security incidents and unlawful activity.",
          },
          {
            num: "3.7",
            text: "Analyse Platform performance, fix errors and improve products, services and user experience.",
          },
          {
            num: "3.8",
            text: "Send service-related notifications, transactional messages and, where permitted, promotional communications.",
          },
          {
            num: "3.9",
            text: "Comply with applicable law, legal processes, government requests and regulatory obligations.",
          },
          {
            num: "3.10",
            text: "Enforce our Terms, protect user rights and establish or defend legal claims.",
          },
        ],
      },
      {
        id: "priv-sharing-info",
        number: 4,
        title: "Sharing of Information",
        items: [
          {
            num: "4.1",
            text: `${branding.appName} does not sell personal information as a commercial commodity. Information is shared strictly when necessary with Sellers (order processing), Delivery Partners (delivery), Payment Providers (settlements), operational service providers (cloud hosting, security), and government authorities when required by law.`,
          },
        ],
      },
      {
        id: "priv-cookies",
        number: 5,
        title: "Cookies and Similar Technologies",
        items: [
          {
            num: "5.1",
            text: `${branding.appName} may use cookies, local storage, pixels or similar technologies to keep users signed in, remember preferences, measure performance, understand usage, improve security and provide relevant functionality. Browser settings allow controlling cookies, though disabling them may impact features.`,
          },
        ],
      },
      {
        id: "priv-communications",
        number: 6,
        title: "Communications and Marketing",
        items: [
          {
            num: "6.1",
            text: "We send transactional and service communications such as order updates, account notices, security alerts and support messages. Promotional communications may be sent where permitted by law and include an unsubscribe mechanism.",
          },
        ],
      },
      {
        id: "priv-retention",
        number: 7,
        title: "Data Retention",
        items: [
          {
            num: "7.1",
            text: "We retain information for as long as reasonably necessary to provide Services, maintain records, fulfil legal or contractual obligations, resolve disputes, prevent fraud, enforce agreements and protect legitimate interests.",
          },
        ],
      },
      {
        id: "priv-security",
        number: 8,
        title: "Data Security",
        items: [
          {
            num: "8.1",
            text: `${branding.appName} uses reasonable technical and organisational measures appropriate to the nature of information processed, which may include access controls, encryption, secure hosting, logging and monitoring.`,
          },
        ],
      },
      {
        id: "priv-choices",
        number: 9,
        title: "Your Choices and Requests",
        items: [
          {
            num: "9.1",
            text: (
              <span>
                You may request correction of inaccurate personal information,
                account closure or deletion where applicable. Privacy requests
                or grievances may be submitted to{" "}
                <a
                  href={`mailto:${branding.supportEmail}`}
                  className="text-blue-600 font-semibold underline"
                >
                  ${branding.supportEmail}
                </a>{" "}
                or to the designated Grievance Officer.
              </span>
            ),
          },
        ],
      },
      {
        id: "priv-closure",
        number: 10,
        title: "Account Closure",
        items: [
          {
            num: "10.1",
            text: `If you wish to close your account, contact ${branding.appName} through the applicable account or support channel. Some information may need to be retained after closure for legal, tax, transaction or fraud-prevention purposes.`,
          },
        ],
      },
      {
        id: "priv-children",
        number: 11,
        title: "Children",
        items: [
          {
            num: "11.1",
            text: `The Platform is intended for persons who can legally enter into contracts under applicable law. ${branding.appName} does not knowingly solicit personal data from children without required parental consent.`,
          },
        ],
      },
      {
        id: "priv-third-party-links",
        number: 12,
        title: "Third-Party Links and Services",
        items: [
          {
            num: "12.1",
            text: "The Platform may link to third-party websites or services whose privacy practices are governed by their own policies.",
          },
        ],
      },
      {
        id: "priv-changes",
        number: 13,
        title: "Changes to this Policy",
        items: [
          {
            num: "13.1",
            text: "We may update this Policy to reflect changes in our Services, technology, business practices or applicable law. Material changes will be stated with the updated effective date.",
          },
        ],
      },
      {
        id: "priv-contact",
        number: 14,
        title: "Privacy Contact",
        items: [
          {
            num: "14.1",
            text: (
              <span>
                Privacy Contact:{" "}
                <a
                  href={`mailto:${branding.supportEmail}`}
                  className="text-blue-600 font-semibold underline"
                >
                  ${branding.supportEmail}
                </a>
              </span>
            ),
          },
        ],
      },
    ],
  },
  refund: {
    id: "refund",
    title: "Refund & Cancellation Policy",
    badge: "Returns & Orders",
    icon: RotateCcw,
    preamble:
      `This Refund & Cancellation Policy explains the general process applicable to Orders placed through ${branding.appName}. Product-specific conditions, Seller policies and applicable consumer rights may apply in addition to this Policy.`,
    sections: [
      {
        id: "ref-cust-cancel",
        number: 1,
        title: "Order Cancellation by Customer",
        items: [
          {
            num: "1.1",
            text: "A Customer may request cancellation through the Platform or support before the Order is fulfilled, subject to the Order status.",
          },
          {
            num: "1.2",
            text: "Cancellation may not be available after preparation, packing, dispatch or handover has begun, particularly for Products that are not ordinarily returnable.",
          },
          {
            num: "1.3",
            text: "Where cancellation is accepted and payment has been collected, the eligible refund will be processed according to this Policy.",
          },
        ],
      },
      {
        id: "ref-seller-cancel",
        number: 2,
        title: "Cancellation by Seller",
        items: [
          {
            num: "2.1",
            text: "A Seller may cancel an Order where there is a legitimate reason such as stock unavailability, store closure, inability to fulfil, pricing/listing error or other operational issue. Repeated avoidable cancellations may result in Seller-level action.",
          },
        ],
      },
      {
        id: "ref-platform-cancel",
        number: 3,
        title: `Cancellation by ${branding.appName}`,
        items: [
          {
            num: "3.1",
            text: `${branding.appName} may cancel or restrict an Order where necessary because of suspected fraud, payment risk, system error, product unavailability, safety/compliance concerns, service disruption or other legitimate circumstances.`,
          },
        ],
      },
      {
        id: "ref-unavailability",
        number: 4,
        title: "Product Unavailability",
        items: [
          {
            num: "4.1",
            text: "If an accepted Product becomes unavailable, the Order may be cancelled in whole or in part. Any eligible amount collected for the unavailable Product will be refunded in accordance with the applicable payment/refund process.",
          },
        ],
      },
      {
        id: "ref-failed-delivery",
        number: 5,
        title: "Failed Delivery or Customer Unavailability",
        items: [
          {
            num: "5.1",
            text: "Customers must provide a correct address and remain reasonably available to receive the Order.",
          },
          {
            num: "5.2",
            text: "Where delivery fails because of an incorrect address, refusal, repeated non-response or other Customer-controlled circumstance, the Order may be treated according to the applicable delivery and product rules.",
          },
          {
            num: "5.3",
            text: "Any refund in such circumstances will depend on the Product type, Order status and applicable law.",
          },
        ],
      },
      {
        id: "ref-returns-replacement",
        number: 6,
        title: "Returns and Replacement",
        items: [
          {
            num: "6.1",
            text: "Where returns or replacement are offered, the Customer should raise the request within the period communicated on the Product/Order page or otherwise applicable to the Product.",
          },
          {
            num: "6.2",
            text: "Eligibility may require the Product to be unused, in original condition, with packaging, tags, accessories or other components, except where the claim concerns a defect, damage, wrong Product or another condition where such requirements are not appropriate.",
          },
        ],
      },
      {
        id: "ref-damaged-defective",
        number: 7,
        title: "Damaged, Defective or Incorrect Products",
        items: [
          {
            num: "7.1",
            text: "Customers should report visible damage, missing items, wrong Products or material defects as soon as reasonably possible after delivery/pickup.",
          },
          {
            num: "7.2",
            text: `${branding.appName} or the Seller may request photographs, videos, packaging information, invoice details or other evidence.`,
          },
          {
            num: "7.3",
            text: "Depending on the circumstances, the resolution may be replacement, repair, refund, partial refund or another legally appropriate remedy.",
          },
          {
            num: "7.4",
            text: "The Seller remains responsible for Product quality and statutory obligations applicable to the sale.",
          },
        ],
      },
      {
        id: "ref-non-returnable",
        number: 8,
        title: "Non-Returnable Products",
        items: [
          {
            num: "8.1",
            text: "Certain categories may be non-returnable because of their nature, hygiene, customisation, perishability, final-sale status or other legitimate reason, subject to applicable law. Any non-returnability will be communicated appropriately to the Customer before purchase.",
          },
        ],
      },
      {
        id: "ref-eligibility",
        number: 9,
        title: "Refund Eligibility",
        items: [
          {
            num: "9.1",
            text: `A refund may be available where an Order is cancelled before fulfilment, a Seller/${branding.appName} cancels an accepted Order, a valid return is approved, a Product is defective/damaged/incorrect, a payment is successfully debited but the Order is not created, or another circumstance gives rise to a refund under applicable law or policy.`,
          },
        ],
      },
      {
        id: "ref-amount",
        number: 10,
        title: "Refund Amount",
        items: [
          {
            num: "10.1",
            text: "The refund amount will generally correspond to the eligible amount paid for the cancelled/returned item or Order. Adjustments may apply to discounts, coupons, partial refunds or used benefits where permitted.",
          },
          {
            num: "10.2",
            text: "Nothing in this section is intended to remove any refund or compensation right that cannot lawfully be excluded.",
          },
        ],
      },
      {
        id: "ref-method-timelines",
        number: 11,
        title: "Refund Method and Timelines",
        items: [
          {
            num: "11.1",
            text: "Approved refunds will normally be initiated to the original payment method or another permitted method.",
          },
          {
            num: "11.2",
            text: `Once initiated by ${branding.appName}/payment provider, the time taken for the amount to appear in the Customer's account may depend on the bank, card issuer, UPI provider or payment gateway.`,
          },
        ],
      },
      {
        id: "ref-duplicate-payments",
        number: 12,
        title: "Failed or Duplicate Payments",
        items: [
          {
            num: "12.1",
            text: `If a payment is debited but the Order fails, ${branding.appName}/payment partners will reconcile the transaction. Duplicate or reversed transactions will be handled based on the transaction status received from the payment provider.`,
          },
        ],
      },
      {
        id: "ref-coupons",
        number: 13,
        title: "Coupons and Promotions",
        items: [
          {
            num: "13.1",
            text: "Where an Order paid using a coupon or promotion is cancelled or returned, the refund treatment of the promotional benefit will follow the applicable coupon/order terms. Promotional discounts are generally not refundable as cash.",
          },
        ],
      },
      {
        id: "ref-chargebacks",
        number: 14,
        title: "Chargebacks",
        items: [
          {
            num: "14.1",
            text: `Customers should first contact ${branding.appName} regarding an Order or payment dispute so that the matter can be investigated. Unauthorised or fraudulent transactions may also be reported to the payment provider/bank through the applicable process.`,
          },
        ],
      },
      {
        id: "ref-abuse",
        number: 15,
        title: "Refund and Cancellation Abuse",
        items: [
          {
            num: "15.1",
            text: `${branding.appName} may investigate repeated or suspicious cancellation, return or refund requests. Accounts may be restricted where there is reasonable evidence of fraud or abuse, without affecting lawful consumer rights.`,
          },
        ],
      },
      {
        id: "ref-how-to-raise",
        number: 16,
        title: "How to Raise a Request",
        items: [
          {
            num: "16.1",
            text: (
              <span>
                Use the Order support option on the Platform or contact{" "}
                <a
                  href={`mailto:${branding.supportEmail}`}
                  className="text-blue-600 font-semibold underline"
                >
                  ${branding.supportEmail}
                </a>
                . Please provide the Order ID, registered mobile/email, reason
                for the request and supporting photographs or information where
                applicable.
              </span>
            ),
          },
        ],
      },
    ],
  },
  grievance: {
    id: "grievance",
    title: "Grievance Redressal Policy",
    badge: "Consumer Support",
    icon: Scale,
    preamble:
      `${branding.appName} is committed to providing a clear mechanism for customers, sellers and other users to raise complaints concerning the Platform, Orders, payments, Products, privacy, Seller conduct or other Services in compliance with the Consumer Protection (E-Commerce) Rules, 2020 and Information Technology Act, 2000.`,
    sections: [
      {
        id: "griev-who-can-raise",
        number: 1,
        title: "Who May Raise a Grievance",
        items: [
          {
            num: "1.1",
            text: `Customers using the ${branding.appName} Platform.`,
          },
          {
            num: "1.2",
            text: "Sellers and authorised representatives of Seller accounts.",
          },
          {
            num: "1.3",
            text: `Other persons who have a legitimate complaint concerning ${branding.appName}'s Platform or Services.`,
          },
        ],
      },
      {
        id: "griev-types",
        number: 2,
        title: "Types of Grievances",
        items: [
          {
            num: "2.1",
            text: "Order, delivery, pickup, cancellation, return or refund issues.",
          },
          {
            num: "2.2",
            text: "Payment or transaction issues.",
          },
          {
            num: "2.3",
            text: "Product/listing complaints and Seller-related concerns.",
          },
          {
            num: "2.4",
            text: "Account, login, security or Platform-access issues.",
          },
          {
            num: "2.5",
            text: "Privacy or personal-data concerns.",
          },
          {
            num: "2.6",
            text: "Fraud, impersonation, abuse or suspicious activity.",
          },
          {
            num: "2.7",
            text: "Content, review or intellectual-property complaints.",
          },
          {
            num: "2.8",
            text: `Other complaints concerning ${branding.appName}'s Services.`,
          },
        ],
      },
      {
        id: "griev-first-level",
        number: 3,
        title: "First-Level Support",
        items: [
          {
            num: "3.1",
            text: (
              <span>
                Customers and Sellers should first use the relevant in-app/website
                support option or write to{" "}
                <a
                  href={`mailto:${branding.supportEmail}`}
                  className="text-blue-600 font-semibold underline"
                >
                  ${branding.supportEmail}
                </a>
                .
              </span>
            ),
          },
          {
            num: "3.2",
            text: "For an Order complaint, provide the Order ID where available. For a Seller complaint, provide the Store ID/store name. For privacy complaints, identify the relevant data or request without unnecessarily sharing sensitive information.",
          },
        ],
      },
      {
        id: "griev-info-to-include",
        number: 4,
        title: "Information to Include",
        items: [
          {
            num: "4.1",
            text: "Name and registered mobile/email.",
          },
          {
            num: "4.2",
            text: "Order ID, Store ID or relevant reference number.",
          },
          {
            num: "4.3",
            text: "Date and description of the issue.",
          },
          {
            num: "4.4",
            text: "Documents, photographs or other evidence where relevant.",
          },
          {
            num: "4.5",
            text: "The resolution you are requesting, if applicable.",
          },
        ],
      },
      {
        id: "griev-acknowledgement",
        number: 5,
        title: "Acknowledgement and Tracking",
        items: [
          {
            num: "5.1",
            text: `${branding.appName} may provide a ticket, reference number or other acknowledgement for complaints submitted through designated channels. Customers should retain this reference for follow-up and escalation.`,
          },
        ],
      },
      {
        id: "griev-resolution",
        number: 6,
        title: "Investigation and Resolution",
        items: [
          {
            num: "6.1",
            text: `${branding.appName} may review account records, Order details, Seller information, payment status, delivery records, communications and other relevant information to investigate a complaint. We may contact the Customer, Seller, Delivery Partner, payment provider or other service provider where necessary.`,
          },
          {
            num: "6.2",
            text: "Resolution may include clarification, correction, replacement, refund, account action, listing action, policy explanation or another appropriate remedy, subject to the nature of the complaint and applicable law.",
          },
        ],
      },
      {
        id: "griev-escalation",
        number: 7,
        title: "Escalation",
        items: [
          {
            num: "7.1",
            text: `If a complaint is not satisfactorily resolved through ordinary support, the complainant may escalate it to the designated Grievance Officer using the details below. The escalation should include the earlier support/ticket reference where available. ${branding.appName} will endeavour to address escalated grievances within the timelines required by applicable law and its operational process.`,
          },
        ],
      },
      {
        id: "griev-officer",
        number: 8,
        title: "Grievance Officer (Statutory Disclosure)",
        items: [
          {
            num: "8.1",
            text: (
              <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 sm:p-6 shadow-sm my-3 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Harish Kumar
                    </h4>
                    <span className="text-xs font-semibold text-blue-600">
                      Director &amp; Designated Grievance Officer
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-blue-100 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>${branding.legalEntity}</strong>
                      <br />
                      Startup Enclave, CSIT Campus, Shivaji Nagar, Balod Road,
                      Durg, Chhattisgarh 491001, India
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                      <a
                        href={`mailto:${branding.supportEmail}`}
                        className="text-blue-600 font-semibold underline"
                      >
                        ${branding.supportEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 text-blue-600 shrink-0" />
                      <a
                        href="tel:+919497655717"
                        className="text-slate-800 font-semibold"
                      >
                        +91-9497655717
                      </a>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-500">
                      <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>Working Hours: 10:00 AM to 06:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
        ],
      },
      {
        id: "griev-privacy",
        number: 9,
        title: "Privacy / Data Grievances",
        items: [
          {
            num: "9.1",
            text: (
              <span>
                Requests or complaints relating to personal data may be
                submitted to{" "}
                <a
                  href={`mailto:${branding.supportEmail}`}
                  className="text-blue-600 font-semibold underline"
                >
                  ${branding.supportEmail}
                </a>{" "}
                and/or the Grievance Officer. ${branding.appName} may verify identity before
                acting on a request involving personal information.
              </span>
            ),
          },
        ],
      },
      {
        id: "griev-seller",
        number: 10,
        title: "Seller Grievances",
        items: [
          {
            num: "10.1",
            text: "Sellers may raise complaints regarding onboarding, account access, catalogue, Orders, settlements, commercial terms, customer complaints or Platform services through the Seller support channel. Unresolved matters may be escalated to the Grievance Officer.",
          },
        ],
      },
      {
        id: "griev-fraud-reports",
        number: 11,
        title: "Fraud and Abuse Reports",
        items: [
          {
            num: "11.1",
            text: (
              <span>
                Users should report suspected impersonation, fraudulent payment
                requests, fake stores, counterfeit Products, account takeover,
                suspicious communications or other misuse promptly through{" "}
                <a
                  href={`mailto:${branding.supportEmail}`}
                  className="text-blue-600 font-semibold underline"
                >
                  ${branding.supportEmail}
                </a>
                . Do not share OTPs, PINs, CVVs or passwords in a complaint.
              </span>
            ),
          },
        ],
      },
      {
        id: "griev-no-waiver",
        number: 12,
        title: "No Waiver of Legal Rights",
        items: [
          {
            num: "12.1",
            text: "The grievance process is intended to provide an accessible resolution mechanism and does not prevent a Customer, Seller or other person from exercising rights or remedies available under applicable law.",
          },
        ],
      },
    ],
  },
};

const policyTabsList: { id: PolicyTab; label: string; count: number }[] = [
  { id: "customer", label: "Customer Terms", count: 20 },
  { id: "seller", label: "Seller Terms", count: 16 },
  { id: "privacy", label: "Privacy Policy", count: 14 },
  { id: "refund", label: "Refund Policy", count: 16 },
  { id: "grievance", label: "Grievance Redressal", count: 12 },
];

export default function TermsContent() {
  const [activeTab, setActiveTab] = useState<PolicyTab>("customer");
  const [activeSectionId, setActiveSectionId] = useState<string>("cust-acceptance");

  const currentPolicy = useMemo(() => policiesData[activeTab], [activeTab]);

  const handleTabChange = (tabId: PolicyTab) => {
    setActiveTab(tabId);
    const firstSection = policiesData[tabId].sections[0];
    if (firstSection) {
      setActiveSectionId(firstSection.id);
    }
    // Scroll content to top
    const container = document.getElementById("terms-container");
    if (container) {
      const yOffset = -90;
      const y = container.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section id="terms-container" className="bg-white py-10 lg:py-16">
      <div className="container-viz">
        {/* Policy Selector Tabs */}
        <div className="mb-10 pb-4 border-b border-slate-200/80">
          <div className="flex flex-wrap items-center gap-2">
            {policyTabsList.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-[1.02]"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200/80 text-slate-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Documentation Grid */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Table of Contents */}
          <aside className="lg:col-span-4 xl:col-span-3.5 lg:sticky lg:top-28">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {currentPolicy.badge} Contents
                </span>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {currentPolicy.sections.length} Sections
                </span>
              </div>
              <nav className="mt-2 space-y-0.5 max-h-[65vh] overflow-y-auto no-scrollbar">
                {currentPolicy.sections.map((sec) => {
                  const isActive = activeSectionId === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left transition-all duration-200 text-xs sm:text-sm py-2 px-3 rounded-xl flex items-center gap-2.5 ${
                        isActive
                          ? "bg-blue-50/90 text-blue-600 font-semibold border-l-4 border-blue-600 pl-2.5 rounded-l-none"
                          : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`text-xs font-semibold w-5 shrink-0 ${
                          isActive ? "text-blue-600" : "text-slate-400"
                        }`}
                      >
                        {sec.number}.
                      </span>
                      <span className="truncate">{sec.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Right Column: Active Policy Content */}
          <div className="lg:col-span-8 xl:col-span-8.5 space-y-10">
            {/* Important Notice Box */}
            <div className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6 shadow-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm shadow-blue-500/30">
                <Info className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {currentPolicy.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {currentPolicy.preamble}
                </p>
              </div>
            </div>

            {/* Sections Render */}
            <div className="space-y-12">
              {currentPolicy.sections.map((sec) => (
                <div
                  key={sec.id}
                  id={sec.id}
                  className="scroll-mt-28 border-b border-slate-100 pb-10 last:border-b-0 last:pb-0"
                >
                  {/* Section Title Header */}
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-bold text-sm">
                      {sec.number}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {sec.title}
                    </h2>
                  </div>

                  {/* Subsection Points */}
                  <div className="space-y-3.5 pl-0 sm:pl-12">
                    {sec.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 text-sm sm:text-base leading-relaxed text-slate-600"
                      >
                        <span className="font-semibold text-slate-400 text-xs sm:text-sm w-7 shrink-0 pt-0.5">
                          {item.num}
                        </span>
                        <div className="flex-1">{item.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
