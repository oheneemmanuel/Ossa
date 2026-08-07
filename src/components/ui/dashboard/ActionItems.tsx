"use client";

import { HelpCircle } from "lucide-react";
import ContributionPayment from "@/components/ui/dashboard/contributionCard";

interface ActionItemsProps {
  email: string;
}

export default function ActionItems({ email }: ActionItemsProps) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-[#B8935A]" strokeWidth={1.75} />
        <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-[#5B6478]">
          Action items
        </h2>
      </div>

      <div className="space-y-4">
        <ContributionPayment email={email} />
        {/* Future action items (profile completion, verification, etc.)
            go here as additional sibling cards */}
      </div>
    </section>
  );
}
