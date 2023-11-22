import { useDroneStore } from '@/store';
import { useEffect } from "react";

import ScheduleBar from "@/components/schedule";
import DigitalClock from "@/components/time";
import LoadCurve from '@/components/load-curve';
import Card from '@/components/card';
import CostCurve from '@/components/cost-curve';
import BatteryPrognosis from '@/components/battery-prognosis';
import PriceCurve from '@/components/price-curve';

export default function Home() {

  const updateState = useDroneStore(state => state.updateState);

  useEffect(() => {
    const interval = setInterval(() => {
      updateState();
    }, 1000); // Update every 10 seconds, adjust as needed

    return () => clearInterval(interval);
  }, [updateState]);

  return (
    <main>
      <DigitalClock />
      <div className="flex flex-wrap justify-center gap-4 my-4">
        <Card title="Load Curve">
          <LoadCurve />
        </Card>
        <Card title="Price Curve">
          <PriceCurve />
        </Card>
        <Card title="Cost Curve">
          <CostCurve />
        </Card>
        <Card title="Battery Prognosis">
          <BatteryPrognosis />
        </Card>
        <Card title="Schedule">
          <ScheduleBar />
        </Card>

      </div>
    </main>
  );
}
