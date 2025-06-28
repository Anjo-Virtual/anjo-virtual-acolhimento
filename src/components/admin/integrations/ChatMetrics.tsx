
import { useChatMetrics } from "@/hooks/admin/useChatMetrics";
import { MetricCard } from "./metrics/MetricCard";
import { MetricsChart } from "./metrics/MetricsChart";
import { MetricsLoadingSkeleton } from "./metrics/MetricsLoadingSkeleton";

export const ChatMetrics = () => {
  const { metrics, chartData, isLoading } = useChatMetrics();

  if (isLoading) {
    return <MetricsLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Chart */}
      <MetricsChart data={chartData} />
    </div>
  );
};
