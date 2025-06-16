
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PostList from "./PostList";

const RecentPostsSection = () => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Discussões Recentes</CardTitle>
        <CardDescription>
          Acompanhe as conversas mais recentes da comunidade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PostList limit={10} />
      </CardContent>
    </Card>
  );
};

export default RecentPostsSection;
