"use client";

import { useState } from "react";
import {
  Security,
  Policy,
  DataUsage,
  Cookie,
  Shield,
  Visibility,
  Delete,
  Download,
  ContactMail,
  Business,
  Group,
  Notifications,
  Lock,
} from "@mui/icons-material";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [loading, setLoading] = useState(true);

  function LoadingScreen() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-accent-50)] to-[var(--color-accent-100)] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[var(--color-accent-200)] border-t-[var(--color-accent-700)] rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-[var(--color-accent-700)] rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-4 text-[var(--color-accent-800)] font-medium">
            Loading MSME Guru...
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    setTimeout(() => setLoading(false), 900);
    return <LoadingScreen />;
  }

  const sections = [
    { id: "introduction", title: "Introduction", icon: <Policy /> },
    { id: "data-collection", title: "Data Collection", icon: <DataUsage /> },
    { id: "data-usage", title: "Data Usage", icon: <Business /> },
    { id: "data-sharing", title: "Data Sharing", icon: <Group /> },
    { id: "cookies", title: "Cookies", icon: <Cookie /> },
    { id: "security", title: "Security", icon: <Security /> },
    { id: "user-rights", title: "Your Rights", icon: <Visibility /> },
    { id: "data-retention", title: "Data Retention", icon: <Delete /> },
    { id: "updates", title: "Policy Updates", icon: <Notifications /> },
    { id: "contact", title: "Contact Us", icon: <ContactMail /> },
  ];

  function IntroductionContent() {
    return (
      <div className="space-y-6">
        <div className="prose prose-lg max-w-none">
          <p className="text-[var(--color-accent-700)] leading-relaxed">
            At MSME Guru, we are committed to protecting your privacy and
            ensuring the security of your personal information. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you use our platform.
          </p>

          <div className="bg-[var(--color-accent-50)] border border-[var(--color-accent-200)] rounded-2xl p-6 mt-6">
            <h4 className="font-semibold text-[var(--color-accent-900)] mb-3 flex items-center">
              <Policy className="w-5 h-5 mr-2 text-[var(--color-accent-700)]" />
              Scope of Policy
            </h4>
            <p className="text-[var(--color-accent-700)] text-sm">
              This policy applies to all users of the MSME Guru platform,
              including buyers, sellers, and visitors to our website. By using
              our services, you agree to the collection and use of information
              in accordance with this policy.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-[var(--color-accent-900)] mt-8 mb-4">
            Key Principles
          </h3>
          <ul className="space-y-3 text-[var(--color-accent-700)]">
            {[
              ["Transparency", Lock],
              ["Security", Security],
              ["Control", DataUsage],
              ["Compliance", Business],
            ].map(([text, Icon]) => (
              <li className="flex items-start" key={text}>
                <div className="bg-[var(--color-accent-100)] rounded-full p-1 mr-3 mt-1">
                  {Icon === Lock && (
                    <Lock className="w-4 h-4 text-[var(--color-accent-700)]" />
                  )}
                  {Icon === Security && (
                    <Security className="w-4 h-4 text-[var(--color-accent-700)]" />
                  )}
                  {Icon === DataUsage && (
                    <DataUsage className="w-4 h-4 text-[var(--color-accent-700)]" />
                  )}
                  {Icon === Business && (
                    <Business className="w-4 h-4 text-[var(--color-accent-700)]" />
                  )}
                </div>
                <span>
                  <strong>{text}:</strong>{" "}
                  {text === "Transparency"
                    ? "We clearly communicate how we handle your data"
                    : text === "Security"
                    ? "We implement strong security practices to protect your information"
                    : text === "Control"
                    ? "You have control over your personal information and preferences"
                    : "We adhere to all applicable data protection regulations"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  function DataCollectionContent() {
    return (
      <div className="space-y-6">
        <div className="prose prose-lg max-w-none">
          <p className="text-[var(--color-accent-700)] leading-relaxed">
            We collect information that helps us provide and improve our
            services, personalize your experience, and communicate with you
            about updates and opportunities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Business Info */}
            <div className="bg-[var(--color-accent-50)] rounded-2xl p-6 border border-[var(--color-accent-200)]">
              <h4 className="font-semibold text-[var(--color-accent-900)] mb-3 flex items-center">
                <Business className="w-5 h-5 mr-2 text-[var(--color-accent-700)]" />
                Business Information
              </h4>
              <ul className="space-y-2 text-sm text-[var(--color-accent-700)]">
                <li>• Company name and registration details</li>
                <li>• Business category and description</li>
                <li>• Contact information and addresses</li>
                <li>• Tax identification numbers</li>
                <li>• Business certifications and licenses</li>
              </ul>
            </div>

            {/* Personal Info */}
            <div className="bg-[var(--color-accent-50)] rounded-2xl p-6 border border-[var(--color-accent-200)]">
              <h4 className="font-semibold text-[var(--color-accent-900)] mb-3 flex items-center">
                <Group className="w-5 h-5 mr-2 text-[var(--color-accent-700)]" />
                Personal Information
              </h4>
              <ul className="space-y-2 text-sm text-[var(--color-accent-700)]">
                <li>• Name, email address, and phone number</li>
                <li>• Professional background and experience</li>
                <li>• Communication preferences</li>
                <li>• Profile pictures and biography</li>
                <li>• Payment and billing information</li>
              </ul>
            </div>
          </div>

          {/* Automated Collection */}
          <div className="bg-[var(--color-accent-50)] border border-[var(--color-accent-200)] rounded-2xl p-6 mt-6">
            <h4 className="font-semibold text-[var(--color-accent-900)] mb-3 flex items-center">
              <DataUsage className="w-5 h-5 mr-2 text-[var(--color-accent-700)]" />
              Automated Data Collection
            </h4>
            <p className="text-[var(--color-accent-700)] text-sm">
              We automatically collect technical information such as IP address,
              browser type, device information, and usage patterns through
              cookies and similar technologies to enhance security and improve
              user experience.
            </p>
          </div>
        </div>
      </div>
    );
  }

  function DataUsageContent() {
    return (
      <div className="space-y-6">
        <div className="prose prose-lg max-w-none">
          <p className="text-[var(--color-accent-700)] leading-relaxed">
            Your data is used to provide, maintain, and improve our services,
            communicate with you, and ensure a secure and personalized
            experience on our platform.
          </p>

          <div className="space-y-4 mt-6">
            {[
              [
                "Service Delivery",
                Business,
                "Facilitate business transactions, connect buyers and sellers, and provide platform features",
              ],
              [
                "Platform Improvement",
                Group,
                "Analyze usage patterns to enhance features, optimize performance, and develop new services",
              ],
              [
                "Communication",
                Notifications,
                "Send important updates, security alerts, marketing communications, and support responses",
              ],
            ].map(([title, Icon, description]) => (
              <div
                key={title}
                className="flex items-start space-x-4 p-4 bg-white border border-[var(--color-accent-200)] rounded-2xl"
              >
                <div className="bg-[var(--color-accent-100)] rounded-lg p-3">
                  {Icon === Business && (
                    <Business className="w-6 h-6 text-[var(--color-accent-700)]" />
                  )}
                  {Icon === Group && (
                    <Group className="w-6 h-6 text-[var(--color-accent-700)]" />
                  )}
                  {Icon === Notifications && (
                    <Notifications className="w-6 h-6 text-[var(--color-accent-700)]" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--color-accent-900)]">
                    {title}
                  </h4>
                  <p className="text-[var(--color-accent-700)] text-sm mt-1">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[var(--color-accent-50)] rounded-2xl p-6 border border-[var(--color-accent-200)] mt-6">
            <h4 className="font-semibold text-[var(--color-accent-900)] mb-3">
              Legal Basis for Processing
            </h4>
            <p className="text-[var(--color-accent-700)] text-sm">
              We process your data based on legal grounds including performance
              of contract, legitimate business interests, legal compliance, and
              where applicable, your consent. You can withdraw consent at any
              time through your account settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  function DataSharingContent() {
    return (
      <div className="space-y-6">
        <div className="prose prose-lg max-w-none">
          <p className="text-[var(--color-accent-700)] leading-relaxed">
            We only share your information under necessary and permitted
            circumstances with trusted partners and service providers who help
            us deliver our services.
          </p>

          <div className="space-y-4 mt-6">
            {[
              [
                "With Your Consent",
                "We share your information when you explicitly agree, such as when connecting with business partners or using integrated services",
              ],
              [
                "Service Providers",
                "Trusted partners who support payment processing, customer support, analytics, hosting, and other essential platform functions",
              ],
              [
                "Legal Requirements",
                "Shared only when legally required by authorities, to comply with regulations, or to protect our rights and users' safety",
              ],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="border border-[var(--color-accent-200)] rounded-2xl overflow-hidden"
              >
                <div className="bg-[var(--color-accent-50)] px-6 py-4 border-b border-[var(--color-accent-200)]">
                  <h4 className="font-semibold text-[var(--color-accent-900)]">
                    {title}
                  </h4>
                </div>
                <div className="p-6">
                  <p className="text-[var(--color-accent-700)] text-sm">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[var(--color-accent-50)] border border-[var(--color-accent-200)] rounded-2xl p-6 mt-6">
            <h4 className="font-semibold text-[var(--color-accent-900)] mb-2">
              International Transfers
            </h4>
            <p className="text-[var(--color-accent-700)] text-sm">
              Your data may be processed internationally with strict safeguards
              including standard contractual clauses and adequacy decisions to
              ensure compliance with data protection standards across borders.
            </p>
          </div>
        </div>
      </div>
    );
  }

  function CookiesContent() {
    return (
      <div className="space-y-6">
        <p className="text-[var(--color-accent-700)] leading-relaxed">
          MSME Guru uses cookies and similar tracking technologies to improve
          platform performance, personalize content, analyze usage patterns, and
          support our marketing efforts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[
            [
              "Essential",
              Security,
              "Required for basic platform functionality and security",
            ],
            [
              "Analytics",
              DataUsage,
              "Helps us understand how users interact with our platform",
            ],
            [
              "Preferences",
              Business,
              "Remembers your settings and preferences for better experience",
            ],
          ].map(([title, Icon, desc]) => (
            <div
              key={title}
              className="bg-white border border-[var(--color-accent-200)] rounded-2xl p-4 text-center"
            >
              <div className="bg-[var(--color-accent-100)] rounded-lg p-3 inline-flex mb-3">
                {Icon === Security && (
                  <Security className="w-6 h-6 text-[var(--color-accent-700)]" />
                )}
                {Icon === DataUsage && (
                  <DataUsage className="w-6 h-6 text-[var(--color-accent-700)]" />
                )}
                {Icon === Business && (
                  <Business className="w-6 h-6 text-[var(--color-accent-700)]" />
                )}
              </div>
              <h4 className="font-semibold text-[var(--color-accent-900)] text-sm">
                {title} Cookies
              </h4>
              <p className="text-[var(--color-accent-700)] text-xs mt-2">
                {desc}
              </p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold text-[var(--color-accent-900)] mt-8 mb-4">
          Cookie Management
        </h3>

        <div className="bg-[var(--color-accent-50)] rounded-2xl p-6 border border-[var(--color-accent-200)]">
          <p className="text-[var(--color-accent-700)] text-sm mb-4">
            You can manage cookie preferences in your browser settings or use
            our preference center to control non-essential cookies. Note that
            disabling essential cookies may affect platform functionality.
          </p>
          <button className="bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white px-6 py-3 rounded-xl font-medium transition-colors">
            Manage Cookie Preferences
          </button>
        </div>
      </div>
    );
  }

  function SecurityContent() {
    return (
      <div className="space-y-6">
        <p className="text-[var(--color-accent-700)] leading-relaxed">
          We implement enterprise-grade security measures including encryption,
          access controls, and regular security assessments to protect your data
          from unauthorized access, alteration, or destruction.
        </p>

        <div className="space-y-4 mt-6">
          {[
            [
              "Data Encryption",
              Lock,
              "AES-256 encryption for data at rest and TLS 1.3 for data in transit",
            ],
            [
              "Access Controls",
              Security,
              "Strict role-based access controls and multi-factor authentication",
            ],
            [
              "Regular Audits",
              Policy,
              "Quarterly penetration tests and security assessments by third-party experts",
            ],
          ].map(([title, Icon, desc]) => (
            <div
              key={title}
              className="flex items-center justify-between p-4 bg-white border border-[var(--color-accent-200)] rounded-2xl"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-[var(--color-accent-100)] rounded-lg p-3">
                  {Icon === Lock && (
                    <Lock className="w-6 h-6 text-[var(--color-accent-700)]" />
                  )}
                  {Icon === Security && (
                    <Security className="w-6 h-6 text-[var(--color-accent-700)]" />
                  )}
                  {Icon === Policy && (
                    <Policy className="w-6 h-6 text-[var(--color-accent-700)]" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--color-accent-900)]">
                    {title}
                  </h4>
                  <p className="text-[var(--color-accent-700)] text-sm">
                    {desc}
                  </p>
                </div>
              </div>
              <div className="bg-[var(--color-accent-100)] text-[var(--color-accent-800)] px-3 py-1 rounded-full text-sm font-medium">
                Active
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold text-[var(--color-accent-900)] mt-8 mb-4">
          Incident Response
        </h3>

        <div className="bg-[var(--color-accent-50)] border border-[var(--color-accent-200)] rounded-2xl p-6">
          <p className="text-[var(--color-accent-700)] text-sm">
            We maintain a comprehensive incident response plan and will notify
            affected users and regulatory authorities within 72 hours of
            becoming aware of any data breach that poses a risk to your rights
            and freedoms.
          </p>
        </div>
      </div>
    );
  }

  function UserRightsContent() {
    return (
      <div className="space-y-6">
        <p className="text-[var(--color-accent-700)] leading-relaxed">
          You have comprehensive rights over your personal information under
          applicable data protection laws. We provide easy-to-use tools to
          exercise these rights.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {[
            [
              "Access Rights",
              Visibility,
              "Request copies of your personal data and information about how we process it",
            ],
            [
              "Data Portability",
              Download,
              "Download your data in a machine-readable format for transfer to another service",
            ],
            [
              "Delete Account",
              Delete,
              "Request deletion of your account and associated personal information",
            ],
          ].map(([title, Icon, desc]) => (
            <div
              key={title}
              className="bg-white border border-[var(--color-accent-200)] rounded-2xl p-4"
            >
              <h4 className="font-semibold text-[var(--color-accent-900)] flex items-center mb-2">
                {Icon === Visibility && (
                  <Visibility className="w-5 h-5 mr-2 text-[var(--color-accent-700)]" />
                )}
                {Icon === Download && (
                  <Download className="w-5 h-5 mr-2 text-[var(--color-accent-700)]" />
                )}
                {Icon === Delete && (
                  <Delete className="w-5 h-5 mr-2 text-[var(--color-accent-700)]" />
                )}
                {title}
              </h4>
              <p className="text-[var(--color-accent-700)] text-sm">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-[var(--color-accent-50)] border border-[var(--color-accent-200)] rounded-2xl p-6 mt-6">
          <h4 className="font-semibold text-[var(--color-accent-900)] mb-2">
            Exercising Your Rights
          </h4>
          <p className="text-[var(--color-accent-700)] text-sm">
            Contact our Data Protection Officer to exercise any of your rights.
            We respond to all legitimate requests within 30 days and provide
            information free of charge, though we may charge a reasonable fee
            for repetitive or manifestly unfounded requests.
          </p>
        </div>
      </div>
    );
  }

  function DataRetentionContent() {
    return (
      <div className="space-y-6">
        <p className="text-[var(--color-accent-700)] leading-relaxed">
          We retain your personal data only for as long as necessary to fulfill
          the purposes outlined in this policy, unless a longer retention period
          is required or permitted by law.
        </p>

        {[
          [
            "Active Accounts",
            "We retain your data while your account is active and for 2 years after inactivity to allow for easy reactivation",
          ],
          [
            "Business Transactions",
            "Financial and transaction records are kept for 7 years as required by tax and commercial laws",
          ],
          [
            "Legal Requirements",
            "Some data must be retained longer to comply with legal obligations, resolve disputes, or enforce agreements",
          ],
        ].map(([title, desc]) => (
          <div
            key={title}
            className="border border-[var(--color-accent-200)] rounded-2xl overflow-hidden"
          >
            <div className="bg-[var(--color-accent-50)] px-6 py-4 border-b border-[var(--color-accent-200)]">
              <h4 className="font-semibold text-[var(--color-accent-900)]">
                {title}
              </h4>
            </div>
            <div className="p-6">
              <p className="text-[var(--color-accent-700)] text-sm">{desc}</p>
            </div>
          </div>
        ))}

        <div className="bg-[var(--color-accent-50)] rounded-2xl p-6 border border-[var(--color-accent-200)]">
          <p className="text-[var(--color-accent-700)] text-sm">
            After the retention period expires, we securely delete or anonymize
            your personal data so it can no longer be associated with you.
            Anonymized data may be retained for statistical or research
            purposes.
          </p>
        </div>
      </div>
    );
  }

  function UpdatesContent() {
    return (
      <div className="space-y-6">
        <p className="text-[var(--color-accent-700)] leading-relaxed">
          We may update this Privacy Policy from time to time to reflect changes
          in our practices, technologies, legal requirements, and other factors.
          We encourage you to periodically review this page for the latest
          information.
        </p>

        <div className="bg-[var(--color-accent-50)] border border-[var(--color-accent-200)] rounded-2xl p-6 mt-6">
          <h4 className="font-semibold text-[var(--color-accent-900)] flex items-center mb-3">
            <Notifications className="w-5 h-5 mr-2 text-[var(--color-accent-700)]" />
            Update Policy Process
          </h4>
          <ul className="space-y-2 text-[var(--color-accent-700)] text-sm">
            <li>
              • Major changes will be notified by email and platform
              announcements
            </li>
            <li>• Policy updates appear 30 days before taking effect</li>
            <li>
              • Previous versions are archived and accessible upon request
            </li>
            <li>
              • Continued use of our services after changes constitutes
              acceptance
            </li>
          </ul>
        </div>
      </div>
    );
  }

  function ContactContent() {
    return (
      <div className="space-y-6">
        <p className="text-[var(--color-accent-700)] leading-relaxed">
          We welcome your questions, comments, and concerns about privacy.
          Contact our Data Protection Team for any privacy-related inquiries or
          to exercise your data protection rights.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* DPO Card */}
          <div className="bg-white border border-[var(--color-accent-200)] rounded-2xl p-6">
            <h4 className="font-semibold text-[var(--color-accent-900)] mb-4 flex items-center">
              <ContactMail className="w-5 h-5 mr-2 text-[var(--color-accent-700)]" />
              Data Protection Officer
            </h4>
            <p className="text-[var(--color-accent-700)] text-sm">
              Email: dpo@msgmeguru.com
              <br />
              Phone: +91-XXX-XXXX-XXXX
              <br />
              Response Time: Within 48 hours
            </p>
          </div>

          {/* Office Card */}
          <div className="bg-white border border-[var(--color-accent-200)] rounded-2xl p-6">
            <h4 className="font-semibold text-[var(--color-accent-900)] mb-4 flex items-center">
              <Business className="w-5 h-5 mr-2 text-[var(--color-accent-700)]" />
              Registered Office
            </h4>
            <p className="text-[var(--color-accent-700)] text-sm">
              MSME Guru Technologies Pvt. Ltd.
              <br />
              Sector 45, Gurugram
              <br />
              Haryana 122003, India
              <br />
              CIN: U72900HR2024PTC123456
            </p>
          </div>
        </div>

        <div className="bg-[var(--color-accent-50)] border border-[var(--color-accent-200)] rounded-2xl p-6">
          <h4 className="font-semibold text-[var(--color-accent-900)] mb-3">
            Regulatory Authority
          </h4>
          <p className="text-[var(--color-accent-700)] text-sm">
            You have the right to lodge a complaint with the Data Protection
            Authority in your country if you believe our processing of your
            personal data violates applicable data protection laws.
          </p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case "introduction":
        return <IntroductionContent />;
      case "data-collection":
        return <DataCollectionContent />;
      case "data-usage":
        return <DataUsageContent />;
      case "data-sharing":
        return <DataSharingContent />;
      case "cookies":
        return <CookiesContent />;
      case "security":
        return <SecurityContent />;
      case "user-rights":
        return <UserRightsContent />;
      case "data-retention":
        return <DataRetentionContent />;
      case "updates":
        return <UpdatesContent />;
      case "contact":
        return <ContactContent />;
      default:
        return <IntroductionContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-accent-50)] to-[var(--color-accent-100)]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[var(--color-accent-200)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-[var(--color-accent-700)] rounded-lg p-2">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-accent-900)]">
                  Privacy Policy
                </h1>
                <p className="text-[var(--color-accent-600)] text-sm">
                  Last updated: December 1, 2024
                </p>
              </div>
            </div>

            <div className="bg-[var(--color-accent-50)] px-4 py-2 rounded-lg border border-[var(--color-accent-200)]">
              <p className="text-[var(--color-accent-700)] text-sm font-medium">
                MSME Guru Business Platform
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-2xl shadow-sm border border-[var(--color-accent-200)] p-6 sticky top-8">
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-[var(--color-accent-50)] border border-[var(--color-accent-300)] text-[var(--color-accent-800)]"
                        : "text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)]"
                    }`}
                  >
                    <span
                      className={`${
                        activeSection === section.id
                          ? "text-[var(--color-accent-700)]"
                          : "text-[var(--color-accent-400)]"
                      }`}
                    >
                      {section.icon}
                    </span>
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-[var(--color-accent-200)]">
                <h3 className="text-sm font-semibold text-[var(--color-accent-900)] mb-4">
                  Quick Actions
                </h3>

                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-[var(--color-accent-300)] text-[var(--color-accent-800)] rounded-xl hover:border-[var(--color-accent-700)] transition-colors">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Download PDF</span>
                  </button>

                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[var(--color-accent-700)] text-white rounded-xl hover:bg-[var(--color-accent-900)] transition-colors">
                    <ContactMail className="w-4 h-4" />
                    <span className="text-sm font-medium">Contact DPO</span>
                  </button>
                </div>
              </div>
            </nav>
          </div>

          {/* Main Content Container */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-accent-200)] overflow-hidden">
              {/* Content Header */}
              <div className="border-b border-[var(--color-accent-200)] bg-gradient-to-r from-[var(--color-accent-50)] to-[var(--color-accent-100)] px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-[var(--color-accent-200)]">
                    {sections.find((s) => s.id === activeSection)?.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-accent-900)]">
                      {sections.find((s) => s.id === activeSection)?.title}
                    </h2>
                    <p className="text-[var(--color-accent-600)] mt-1">
                      Understanding how we protect and manage your data
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-8">{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
