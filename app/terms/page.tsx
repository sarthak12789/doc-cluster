export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-[#E6F4FF] px-6 py-16">
      <div className="mx-auto max-w-4xl border border-gray-300 bg-[#EDFEFA] p-10 rounded-lg shadow-lg">

        {/* Title */}
        <h1 className="text-4xl font-semibold text-[#018FFF] mb-3">
          Terms & Conditions
        </h1>

        <p className="text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <p className="text-gray-700">
          Welcome to <span className="font-medium text-[#018FFF]">Doc-Cluster</span>.
          By accessing or using our platform, you agree to comply with these
          Terms & Conditions.
        </p>

        {/* Quick Reference Table */}
        <div className="mt-10 mb-14 overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-[#E6F4FF]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#018FFF]">
                  Section
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#018FFF]">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                ["platform", "1. Platform Overview", "Purpose and scope of Doc-Cluster"],
                ["eligibility", "2. User Eligibility", "Registration rules"],
                ["security", "3. Authentication & Security", "OAuth, JWT, and access protection"],
                ["documents", "4. Document Management", "Storage, encryption, and access control"],
                ["ai", "5. AI & RAG Services", "AI-powered summaries and search"],
                ["verification", "6. Organization Verification", "Government & institutional checks"],
                ["prohibited", "7. Prohibited Activities", "Restricted actions"],
                ["termination", "8. Termination", "Account suspension rules"],
                ["changes", "9. Changes to Terms", "Updates and acceptance"],
                ["contact", "Contact", "Support & legal contact"],
              ].map(([id, title, desc]) => (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-[#018FFF]">
                    <a href={`#${id}`}>{title}</a>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sections */}
        <div className="space-y-12 text-gray-700">

          <section id="platform">
            <h2 className="text-2xl font-semibold text-[#018FFF] mb-2">
              1. Platform Overview
            </h2>
            <p>
              Doc-Cluster is a digital academic locker and AI-powered
              knowledge platform for individuals and organizations.
            </p>
          </section>

          <section id="eligibility">
            <h2 className="text-2xl font-semibold text-[#018FFF] mb-2">
              2. User Eligibility & Registration
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Users must provide accurate registration information.</li>
              <li>Organizations must submit valid verification documents.</li>
              <li>Accounts are the responsibility of the registered user.</li>
            </ul>
          </section>

          <section id="security">
            <h2 className="text-2xl font-semibold text-[#14B8A6] mb-2">
              3. Authentication & Security
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>OAuth login via Google or GitHub.</li>
              <li>Secure JWT and refresh token sessions.</li>
              <li>Unauthorized access is strictly prohibited.</li>
            </ul>
          </section>

          <section id="documents">
            <h2 className="text-2xl font-semibold text-[#14B8A6] mb-2">
              4. Document Management
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Role-based document access.</li>
              <li>Two-factor locked sensitive documents.</li>
              <li>Audit logging and access tracking.</li>
            </ul>
          </section>

          <section id="ai">
            <h2 className="text-2xl font-semibold text-[#14B8A6] mb-2">
              5. AI & RAG Services
            </h2>
            <p>
              AI services provide document summaries, semantic search,
              and contextual answers. Outputs are informational only.
            </p>
          </section>

          <section id="verification">
            <h2 className="text-2xl font-semibold text-[#018FFF] mb-2">
              6. Organization Verification
            </h2>
            <p>
              Verification may involve government or institutional APIs.
              Doc-Cluster reserves the right to revoke access if false
              information is detected.
            </p>
          </section>

          <section id="prohibited">
            <h2 className="text-2xl font-semibold text-[#018FFF] mb-2">
              7. Prohibited Activities
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Uploading illegal or malicious content.</li>
              <li>Attempting to bypass security systems.</li>
              <li>Misuse of AI services.</li>
            </ul>
          </section>

          <section id="termination">
            <h2 className="text-2xl font-semibold text-[#018FFF] mb-2">
              8. Termination of Access
            </h2>
            <p>
              Accounts violating these terms may be suspended or terminated
              without prior notice.
            </p>
          </section>

          <section id="changes">
            <h2 className="text-2xl font-semibold text-[#018FFF] mb-2">
              9. Changes to Terms
            </h2>
            <p>
              Continued use of Doc-Cluster after updates constitutes acceptance
              of revised Terms.
            </p>
          </section>

          <section id="contact" className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-[#018FFF] mb-2">
              Contact Us
            </h2>
            <p>
              For any questions, contact:
            </p>
            <p className="mt-2 font-medium text-[#14B8A6]">
              📧 doccluster4u@gmail.com
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
