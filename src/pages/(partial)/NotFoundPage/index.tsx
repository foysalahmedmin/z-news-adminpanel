import { Button } from "@/components/ui/Button";
import React from "react";
import { Link } from "react-router";

const NotFoundPage: React.FC = () => {
  return (
    <main className="bg-background flex h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-accent text-9xl font-extrabold">404</h1>
      <h2 className="text-muted-foreground mt-4 text-2xl font-semibold">
        Page Not Found
      </h2>
      <p className="text-muted-foreground mt-2">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>

      <div className="mt-4">
        <Button asChild>
          <Link to="/">Go Back Dashboard</Link>
        </Button>
      </div>
    </main>
  );
};

export default NotFoundPage;
