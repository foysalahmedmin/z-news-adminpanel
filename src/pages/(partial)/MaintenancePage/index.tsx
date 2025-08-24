import { Button } from "@/components/ui/Button";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

type MaintenancePageProps = {
  date?: Date | string;
};

const MaintenancePage: React.FC<MaintenancePageProps> = ({
  date = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const end = useMemo(() => new Date(date), [date]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = end.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <main className="bg-background flex h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-8">
        <div className="bg-muted inline-flex h-16 w-16 items-center justify-center rounded-full">
          <svg
            className="text-accent h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      </div>

      <h1 className="text-accent text-6xl font-extrabold">Under Maintenance</h1>
      <h2 className="text-muted-foreground mt-4 text-2xl font-semibold">
        We'll be back soon!
      </h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        Our website is currently undergoing scheduled maintenance. We apologize
        for any inconvenience.
      </p>

      {/* Countdown Timer */}
      <div className="mt-8 grid grid-cols-4 gap-4">
        <div className="bg-muted rounded-lg p-4">
          <div className="text-accent text-2xl font-bold">{timeLeft.days}</div>
          <div className="text-muted-foreground text-sm">Days</div>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <div className="text-accent text-2xl font-bold">{timeLeft.hours}</div>
          <div className="text-muted-foreground text-sm">Hours</div>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <div className="text-accent text-2xl font-bold">
            {timeLeft.minutes}
          </div>
          <div className="text-muted-foreground text-sm">Minutes</div>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <div className="text-accent text-2xl font-bold">
            {timeLeft.seconds}
          </div>
          <div className="text-muted-foreground text-sm">Seconds</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 w-full max-w-sm">
        <div className="bg-muted h-2 w-full rounded-full">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-1000"
            style={{
              width: `${Math.max(
                0,
                Math.min(
                  100,
                  100 -
                    ((end.getTime() - Date.now()) /
                      (end.getTime() -
                        (end.getTime() - 2 * 24 * 60 * 60 * 1000))) *
                      100,
                ),
              )}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="mt-6">
        <Button asChild>
          <Link to="/">Check Status</Link>
        </Button>
      </div>

      <div className="text-muted-foreground mt-6 text-sm">
        <p>For urgent inquiries, please contact us at:</p>
        <p className="mt-1 font-medium">support@example.com</p>
      </div>
    </main>
  );
};

export default MaintenancePage;
