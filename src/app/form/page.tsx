import { Navbar } from "@/components/Navbar";
import { IntakeWizard } from "@/components/form/IntakeWizard";

export default function FormPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-[120px] pb-20 px-6">
        <IntakeWizard />
      </main>
    </>
  );
}
