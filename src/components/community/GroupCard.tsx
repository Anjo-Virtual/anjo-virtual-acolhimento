
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Lock, Globe, UserMinus, UserPlus, Crown } from "lucide-react";
import { CommunityGroup } from "@/types/groups";

interface GroupCardProps {
  group: CommunityGroup;
  onJoin?: (groupId: string) => void;
  onLeave?: (groupId: string) => void;
  showActions?: boolean;
}

const GroupCard = ({ group, onJoin, onLeave, showActions = true }: GroupCardProps) => {
  const isFull = group.current_members >= group.max_members;
  const canJoin = !group.is_member && !isFull;
  const isAdmin = group.member_role === 'admin';

  console.log('[GroupCard] Renderizando grupo:', {
    id: group.id,
    name: group.name,
    is_member: group.is_member,
    member_role: group.member_role,
    current_members: group.current_members,
    max_members: group.max_members
  });

  return (
    <Card className="h-full hover:shadow-md transition-all duration-200 border-l-4 border-l-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-2 truncate pr-2">
              {group.name}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {group.is_private ? (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <Lock size={12} />
                  Privado
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <Globe size={12} />
                  Público
                </Badge>
              )}
              {group.is_member && (
                <Badge variant="default" className="flex items-center gap-1 text-xs">
                  {isAdmin && <Crown size={12} />}
                  {isAdmin ? 'Admin' : 'Membro'}
                </Badge>
              )}
              {isFull && (
                <Badge variant="destructive" className="text-xs">
                  Lotado
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
          {group.description || 'Sem descrição disponível.'}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Users size={16} className="flex-shrink-0" />
            <span className="font-medium">
              {group.current_members}/{group.max_members}
            </span>
          </div>
          <div className="text-xs text-right">
            <div className="font-medium text-gray-700">
              {group.creator?.display_name || 'Criador'}
            </div>
            <div className="text-gray-500">Organizador</div>
          </div>
        </div>

        {showActions && (
          <div className="pt-2">
            {group.is_member ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onLeave?.(group.id)}
                className="w-full flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                disabled={isAdmin}
              >
                <UserMinus size={16} />
                {isAdmin ? 'Administrador' : 'Sair do Grupo'}
              </Button>
            ) : canJoin ? (
              <Button 
                size="sm" 
                onClick={() => onJoin?.(group.id)}
                className="w-full flex items-center gap-2"
              >
                <UserPlus size={16} />
                {group.is_private ? 'Solicitar Entrada' : 'Entrar no Grupo'}
              </Button>
            ) : (
              <Button size="sm" disabled className="w-full">
                {isFull ? 'Grupo Lotado' : 'Indisponível'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupCard;
