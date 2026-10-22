// ============================================================
//  LEGAL PAGES — /privacy and /terms.
//  Plain-language drafts describing what this website actually does.
//  Have them reviewed by counsel before relying on them, and update
//  `updated` whenever the text changes.
// ============================================================

import { company } from "./company";

/** A block is a paragraph, or a bulleted list when it is an array. */
export type LegalBlock = string | string[];

export interface LegalSection {
  id: string;
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

const UPDATED = "October 22, 2026";

const privacy: LegalDoc = {
  title: "Privacy policy",
  updated: UPDATED,
  intro: `This policy explains what personal information ${company.legalName} ("${company.name}", "we", "us") collects through this website, how we use it and the choices you have.`,
  sections: [
    {
      id: "collect",
      heading: "Information we collect",
      blocks: [
        "We only collect what you choose to send us, plus the basic technical data any website receives:",
        [
          "Contact form: your name, email address, company and phone number (both optional), the type of enquiry, your message, and whether you opted in to text messages.",
          "Email and phone: whatever you include when you contact us directly.",
          "Technical data: like any website, our hosting provider receives standard request data such as your IP address, browser type and the pages requested. This site loads its fonts from Google Fonts, so Google also receives your IP address when your browser requests them. Project case studies load from our database provider (Supabase), which receives the same standard request data.",
        ],
      ],
    },
    {
      id: "cookies",
      heading: "Cookies and browser storage",
      blocks: [
        "We do not use advertising or analytics cookies. The site keeps one small preference in your browser's own storage — your light or dark theme choice — and never sends it to us.",
      ],
    },
    {
      id: "use",
      heading: "How we use your information",
      blocks: [
        [
          "To reply to your enquiry and discuss your project.",
          "To prepare proposals and provide services you ask us for.",
          "To send text messages about your enquiry, only if you opted in.",
          "To keep the records a business needs to keep, and to protect the security of this website.",
        ],
        "We do not sell your personal information.",
      ],
    },
    {
      id: "sharing",
      heading: "Service providers",
      blocks: [
        "Contact-form submissions are stored in the customer-relationship management (CRM) service we use to manage enquiries, and forwarded to our inbox by an email-delivery service (FormSubmit). Both process them on our behalf. We share information with other parties only when the law requires it, or to protect our rights and the safety of others.",
      ],
    },
    {
      id: "sms",
      heading: "Text messages",
      blocks: [
        "If you tick the box to receive text messages, we may text you about your enquiry and our services. Message frequency varies and message and data rates may apply. Reply STOP to opt out at any time, or HELP for help.",
        "Mobile numbers and text-messaging opt-in data are not shared with or sold to third parties for their marketing purposes.",
      ],
    },
    {
      id: "retention",
      heading: "How long we keep it",
      blocks: [
        "We keep enquiry information for as long as we need it to respond and for our ordinary business records, and delete it on request unless we are required to keep it.",
      ],
    },
    {
      id: "rights",
      heading: "Your choices",
      blocks: [
        `You can ask to see, correct or delete the personal information we hold about you, or withdraw consent to text messages, by emailing ${company.email}. Depending on where you live, you may have further rights under local law.`,
      ],
    },
    {
      id: "security",
      heading: "Security",
      blocks: ["We use reasonable technical and organisational measures to protect your information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security."],
    },
    {
      id: "children",
      heading: "Children",
      blocks: ["This website is intended for businesses and is not directed at children under 13. We do not knowingly collect information from children."],
    },
    {
      id: "changes",
      heading: "Changes and contact",
      blocks: [
        `We may update this policy as the website or the law changes; the date at the top shows the latest version. Questions about privacy can be sent to ${company.email}.`,
      ],
    },
  ],
};

const terms: LegalDoc = {
  title: "Terms of use",
  updated: UPDATED,
  intro: `These terms apply to your use of this website, operated by ${company.legalName}. By using the site you agree to them.`,
  sections: [
    {
      id: "information",
      heading: "Information only",
      blocks: [
        "The content on this site describes our services in general terms and is provided for information. It is not an offer and does not form part of any contract. Every engagement is governed by its own written proposal or agreement.",
      ],
    },
    {
      id: "ip",
      heading: "Intellectual property",
      blocks: [
        `The text, design, graphics and name of this website belong to ${company.legalName}. Photographs are licensed from third parties and remain the property of their owners (see image credits below). You may view and share pages for your own reference, but not copy or reuse the content commercially without our written permission.`,
      ],
    },
    {
      id: "use",
      heading: "Acceptable use",
      blocks: [
        "Please do not misuse the site — for example by attempting to access restricted areas, interfering with its operation, sending unlawful or malicious content through the contact form, or scraping it at a volume that affects other visitors.",
      ],
    },
    {
      id: "sms",
      heading: "Text messaging",
      blocks: [
        `If you opt in on the contact form, ${company.name} may send you text messages about your enquiry and our services. Message frequency varies. Message and data rates may apply. Reply STOP to cancel at any time and HELP for help, or email ${company.email}. Carriers are not liable for delayed or undelivered messages. See our privacy policy for how we handle your number.`,
      ],
    },
    {
      id: "links",
      heading: "Third-party services",
      blocks: ["The site relies on third-party services such as font hosting, and may link to other websites. We are not responsible for their content or practices."],
    },
    {
      id: "warranty",
      heading: "No warranty and limitation of liability",
      blocks: [
        `The site is provided "as is", without warranties of any kind. To the fullest extent permitted by law, ${company.legalName} is not liable for any loss arising from your use of, or reliance on, this website.`,
      ],
    },
    {
      id: "changes",
      heading: "Changes and contact",
      blocks: [`We may update these terms from time to time; the date at the top shows the latest version. Questions can be sent to ${company.email}.`],
    },
  ],
};

export const legalDocs = { privacy, terms };
export type LegalDocKey = keyof typeof legalDocs;
