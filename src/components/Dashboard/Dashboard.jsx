import React from "react";
import { Separator } from "../ui/separator";

const Dashboard = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50">
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
