import PageHeader from "@/components/sections/PageHeader";
import React from "react";

const CommentsPage: React.FC = () => {
  return (
    <main className="space-y-6">
      <PageHeader
        name="Comments"
        description="Manage and review user comments"
      />

      <section className="space-y-4">
        <div className="text-muted-foreground rounded border p-6 text-center">
          Comments feature is coming soon.
        </div>
      </section>
    </main>
  );
};

export default CommentsPage;
