import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const cardData = [
  {
    title: "Total Revenue",
    value: "$1,250.00",
    change: "+12.5%",
    icon: TrendingUp,
    iconType: "up",
    footerMain: "Trending up this month",
    footerSub: "Visitors for the last 6 months",
  },
  {
    title: "New Customers",
    value: "1,234",
    change: "-20%",
    icon: TrendingDown,
    iconType: "down",
    footerMain: "Down 20% this period",
    footerSub: "Acquisition needs attention",
  },
  {
    title: "Active Accounts",
    value: "45,678",
    change: "+12.5%",
    icon: TrendingUp,
    iconType: "up",
    footerMain: "Strong user retention",
    footerSub: "Engagement exceeds targets",
  },
  {
    title: "Growth Rate",
    value: "4.5%",
    change: "+4.5%",
    icon: TrendingUp,
    iconType: "up",
    footerMain: "Steady performance increase",
    footerSub: "Meets growth projections",
  },
];

export function SectionCards() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cardData.map(
        (
          { title, value, change, icon: Icon, iconType, footerMain, footerSub },
          index,
        ) => (
          <Card key={index} className="@container/card">
            <Card.Header>
              <span className="text-muted-foreground text-sm">{title}</span>
              <Card.Title className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {value}
              </Card.Title>
              <div className="mt-2">
                <Badge
                  className={`gap-1 ${
                    iconType === "up"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-rose-500/10 text-rose-600"
                  }`}
                >
                  <Icon className="size-4" />
                  {change}
                </Badge>
              </div>
            </Card.Header>
            <Card.Footer className="flex-col items-start gap-1.5 text-sm">
              <div className="flex gap-2 font-medium">
                {footerMain} <Icon className="size-4" />
              </div>
              <div className="text-muted-foreground">{footerSub}</div>
            </Card.Footer>
          </Card>
        ),
      )}
    </div>
  );
}
