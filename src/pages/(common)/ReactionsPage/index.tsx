import PageHeader from "@/components/sections/PageHeader";
import React from "react";

const ReactionsPage: React.FC = () => {
  return (
    <main className="space-y-6">
      <PageHeader
        name="Reactions"
        description="View and analyze user reactions"
      />

      <section className="space-y-4">
        <div className="text-muted-foreground rounded border p-6 text-center">
          Reactions feature is coming soon.
        </div>
      </section>
    </main>
  );
};

export default ReactionsPage;
