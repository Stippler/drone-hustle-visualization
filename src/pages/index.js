import { useDroneStore } from '@/store';
import { useEffect } from "react";

import ScheduleBar from "@/components/schedule";
import DigitalClock from "@/components/time";
import LoadCurve from '@/components/load-curve';
import Card from '@/components/card';
import CostCurve from '@/components/cost-curve';
import BatteryPrognosis from '@/components/battery-prognosis';
import PriceCurve from '@/components/price-curve';
import ApiInteractionForms from '@/components/control';

export default function Home() {

  const updateState = useDroneStore(state => state.updateState);

  useEffect(() => {
    const interval = setInterval(() => {
      updateState();
    }, 1000); // Update every 10 seconds, adjust as needed

    return () => clearInterval(interval);
  }, [updateState]);


  const loadcurveText = "Load curve of the current charging schedule, optimized and unoptimized."
  const pricecurveText = "Spotmarket price curve for electricity."
  const costcurveText = "Curve of accumulated electricity cost of current charging schedule. Past electricity costs are not considered."
  const batteryprognosisText = "Prognosis of waiting and finished batteries in stock. Vertical lines mark the anticipated battery change requests which are also used to optimize the schedule."
  const scheduleText = "Charging schedule. Each block represents one battery blocking a charging station. Batteries can also only be charged parts of the time that they are in the charging station."

  return (
    <main>
      <DigitalClock />
      <div className="mx-auto p-4 max-w-7xl">
        <div className="flex flex-wrap justify-center gap-4 my-4">
          <Card title="Load Curve" text={loadcurveText}>
            <LoadCurve />
          </Card>
          <Card title="Price Curve" text={pricecurveText}>
            <PriceCurve />
          </Card>
          <Card title="Cost Curve" text={costcurveText}>
            <CostCurve />
          </Card>
          <Card title="Battery Prognosis" text={batteryprognosisText}>
            <BatteryPrognosis />
          </Card>
          <Card title="Schedule" text={scheduleText}>
            <ScheduleBar />
          </Card>
        </div>
        <ApiInteractionForms />
      </div>
    </main>
  );
}
