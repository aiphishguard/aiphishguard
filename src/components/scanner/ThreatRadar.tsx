import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import type { ThreatFactor } from "@/types/analysis";

export function ThreatRadar({ factors }: { factors: ThreatFactor[] }) {
  const data = factors.map((f) => ({ name: f.name.replace(" ", "\n"), score: f.score }));
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="hsl(222 28% 22%)" />
          <PolarAngleAxis dataKey="name" tick={{ fill: "hsl(215 16% 62%)", fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar dataKey="score" stroke="hsl(187 92% 48%)" fill="hsl(160 84% 43%)" fillOpacity={0.35} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
