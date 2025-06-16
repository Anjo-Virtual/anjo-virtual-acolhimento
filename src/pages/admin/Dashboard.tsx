
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight } from "lucide-react";

interface AdminStats {
  contactMessages: number;
  subscribers: number;
  blogPosts: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<AdminStats>({
    contactMessages: 0,
    subscribers: 0,
    blogPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Get contact messages count
        const { count: contactCount, error: contactError } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true });
          
        // Get newsletter subscribers count
        const { count: subscribersCount, error: subscribersError } = await supabase
          .from('newsletter_subscriptions')
          .select('*', { count: 'exact', head: true });
          
        // Get blog posts count
        const { count: blogPostsCount, error: blogPostsError } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true });

        if (contactError || subscribersError || blogPostsError) {
          console.error("Error fetching stats:", contactError || subscribersError || blogPostsError);
          return;
        }

        setStats({
          contactMessages: contactCount || 0,
          subscribers: subscribersCount || 0,
          blogPosts: blogPostsCount || 0,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button 
          onClick={() => window.location.href = "/comunidade"}
          className="flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          Acessar Comunidade
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Mensagens de Contato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.contactMessages}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Assinantes da Newsletter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.subscribers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Posts do Blog
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.blogPosts}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
