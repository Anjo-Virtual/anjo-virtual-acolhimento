
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PostList from "./PostList";

const RecentPostsSection = () => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Discussões Recentes</CardTitle>
            <CardDescription>
              Acompanhe as conversas mais recentes da comunidade
            </CardDescription>
          </div>
          <Link to="/comunidade/ativos">
            <Button variant="outline" size="sm">
              Ver todas <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <PostList limit={3} />
      </CardContent>
    </Card>
  );
};

export default RecentPostsSection;
