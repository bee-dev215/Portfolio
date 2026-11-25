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

const UPDATED = "November 25, 2026";

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
          "Contact form: your name and email address, your organization and phone number (both optional), the topic of your inquiry, your message, and whether you opted in to text messages.",
          "Job applications (/apply): the role you choose, your name, email address and the country you're based in, your phone number and a link to your CV or profile (both optional), your experience, availability and English level, what you write about yourself, and your time zone, which your browser reports. While you fill in the form, a draft is kept in your own browser so you don't lose your answers; it is deleted once you send the application.",
          "Email and phone: whatever you include when you contact us directly.",
          "Technical data: like any website, our hosting provider receives standard request data such as your IP address, browser type and the pages requested. This site loads its fonts from Google Fonts, so Google also receives your IP address when your browser requests them. When you send an application or a message, your browser connects to our database provider (Supabase), which receives the same standard request data.",
        ],
      ],
    },
    {
      id: "cookies",
      heading: "Cookies and browser storage",
      blocks: [
        "We do not use advertising or analytics cookies. The site keeps your light or dark theme choice, and a draft of an application you haven't sent yet, in your browser's own storage. Neither is sent to us until you choose to send the application.",
      ],
    },
    {
      id: "use",
      heading: "How we use your information",
      blocks: [
        [
          "To reply to your inquiry.",
          "To review your application, contact you about it and, if you join, prepare your contract and pay you.",
          "For companies: to discuss and provide the services you ask us for.",
          "To send text messages about your inquiry, only if you opted in.",
          "To keep the records a business needs to keep, and to protect the security of this website.",
        ],
        "We do not sell your personal information.",
      ],
    },
    {
      id: "sharing",
      heading: "Service providers",
      blocks: [
        "Applications and contact-form messages are stored in our database, hosted by Supabase, and emailed to our inbox by an email-delivery service (FormSubmit). Both are also added to the customer-relationship management (CRM) service we use to manage inquiries, which keeps any text-message consent. These providers process the information on our behalf.",
        "Interviews take place on a video-meeting service, which processes the call under its own privacy policy. We share information with other parties only when the law requires it, or to protect our rights and the safety of others.",
      ],
    },
    {
      id: "sms",
      heading: "Text messages",
      blocks: [
        "If you check the box to receive text messages, we may text you about your inquiry and our services. Message frequency varies and message and data rates may apply. Reply STOP to opt out at any time, or HELP for help.",
        "Mobile numbers and text-messaging opt-in data are not shared with or sold to third parties for their marketing purposes.",
      ],
    },
    {
      id: "retention",
      heading: "How long we keep it",
      blocks: [
        "We keep inquiries for as long as we need to respond and keep ordinary business records. We keep applications for up to 12 months so we can consider you for new roles, unless you ask us to delete them sooner. If you join, we keep the records your contract and the law require.",
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
      blocks: ["We use reasonable technical and organizational measures to protect your information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security."],
    },
    {
      id: "children",
      heading: "Children",
      blocks: ["This website is intended for adults. Applicants must be of legal working age where they live, and we do not knowingly collect information from children."],
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
        "The content on this site describes our roles, our hiring process and our services in general terms and is provided for information. It is not an offer of work and does not form part of any contract. Every role is governed by its own written contract, which sets out your rate, hours and terms before you start.",
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
        "Please do not misuse the site — for example by attempting to access restricted areas, interfering with its operation, sending unlawful, false or malicious content through the application or contact forms, applying in someone else's name, or scraping it at a volume that affects other visitors.",
      ],
    },
    {
      id: "sms",
      heading: "Text messaging",
      blocks: [
        `If you opt in on the contact form, ${company.name} may send you text messages about your inquiry and our services. Message frequency varies. Message and data rates may apply. Reply STOP to cancel at any time and HELP for help, or email ${company.email}. Carriers are not liable for delayed or undelivered messages. See our privacy policy for how we handle your number.`,
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
