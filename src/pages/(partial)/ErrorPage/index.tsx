import { Button } from "@/components/ui/Button";
import React from "react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router";

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  let statusCode = 500;
  let errorMessage = "An unexpected error occurred";

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  // Custom messages for different status codes
  const errorTitles: Record<number, string> = {
    404: "Page Not Found",
    500: "Server Error",
    403: "Access Forbidden",
    401: "Unauthorized",
  };

  const errorDescriptions: Record<number, string> = {
    404: "Sorry, the page you are looking for doesn't exist or has been moved.",
    500: "Something went wrong on our end. Please try again later.",
    403: "You don't have permission to access this resource.",
    401: "Please log in to access this page.",
  };

  const title = errorTitles[statusCode] || `Error ${statusCode}`;
  const description = errorDescriptions[statusCode] || errorMessage;

  return (
    <main className="bg-background flex h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-accent text-9xl font-extrabold">{statusCode}</h1>
      <h2 className="text-muted-foreground mt-4 text-2xl font-semibold">
        {title}
      </h2>
      <p className="text-muted-foreground mt-2 max-w-md">{description}</p>

      <div className="mt-6 flex gap-4">
        <Button asChild variant="default">
          <Link to="/">Go to Dashboard</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          onClick={() => window.location.reload()}
        >
          <span>Try Again</span>
        </Button>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="bg-muted mt-8 max-w-xl rounded-md p-4 text-left">
          <h3 className="text-sm font-semibold">
            Error Details (Development Only):
          </h3>
          <pre className="mt-2 overflow-auto text-xs">
            {error instanceof Error
              ? error.stack
              : JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
};

export default ErrorPage;
