import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Crown, Activity } from "lucide-react";

interface UserStatsCardsProps {
  stats: {
    total: number;
    admins: number;
    communityMods: number;
    activeLastWeek: number;
  };
}

export function UserStatsCards({ stats }: UserStatsCardsProps) {
  const statCards = [
    {
      title: "Total de Usuários",
      value: stats.total,
      icon: Users,
      description: "Usuários registrados",
      color: "text-blue-600"
    },
    {
      title: "Administradores",
      value: stats.admins,
      icon: Crown,
      description: "Admins do site",
      color: "text-purple-600"
    },
    {
      title: "Moderadores",
      value: stats.communityMods,
      icon: Shield,
      description: "Mods da comunidade",
      color: "text-green-600"
    },
    {
      title: "Ativos (7 dias)",
      value: stats.activeLastWeek,
      icon: Activity,
      description: "Usuários ativos",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}