import ContactForm from "@/components/ContactForm";
import Faq from "@/components/Faq";

export const metadata = {
  title: "Contact SoftiIntel — Start Your Project",
  description:
    "Tell SoftiIntel where your business stands and where it needs to be. Reach us about AI agents, CRM development, web, mobile apps and automation — replies within one business day.",
  alternates: { canonical: "/contact" },
};

const FAQS = [
  ["How fast does SoftiIntel respond to enquiries?", "Within one business day, usually faster — an agent triages the inbox and a human replies with substance, not a holding email."],
  ["What should I include in my message?", "The problem costing you the most time or money, your current tools, and a rough timeline. Two honest sentences beat a formal brief."],
  ["Do you sign NDAs before discovery calls?", "Yes — send yours or use our standard mutual NDA. Confidentiality before curiosity."],
  ["Do you work with clients outside your timezone?", "Yes. We're remote-first with async-friendly delivery: recorded walkthroughs, weekly demos, and agents that answer while we sleep."],
];

export default function Contact() {
  return (
    <main className="pt-32">
      <section className="px-6 md:px-10 pb-10">
        <div className="max-w-4xl mx-auto" data-depth="0.3">
          <p className="mono-label mb-6 reveal">contact — open a channel</p>
          <h1 className="display text-[11vw] md:text-[6.5vw]" data-split>
            Say the hard part out loud.
          </h1>
          <p className="mt-8 max-w-2xl text-mist text-lg font-light leading-relaxed reveal">
            The bottleneck, the missed follow-ups, the spreadsheet that runs
            your business — tell us. Watch the signal strengthen as you type.
          </p>
          <p className="mt-5 reveal">
            <a
              href="https://www.linkedin.com/company/110878416"
              target="_blank"
              rel="noopener noreferrer"
              className="draw-link mono-label !text-signal"
            >
              or connect on LinkedIn ↗
            </a>
          </p>
        </div>
      </section>

      <ContactForm />

      <Faq items={FAQS} title="Before you ask." />
    </main>
  );
}
