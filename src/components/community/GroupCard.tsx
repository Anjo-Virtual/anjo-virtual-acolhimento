
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Lock, Globe, UserMinus, UserPlus } from "lucide-react";
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

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{group.name}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              {group.is_private ? (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Lock size={12} />
                  Privado
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Globe size={12} />
                  Público
                </Badge>
              )}
              {group.is_member && (
                <Badge variant="default">
                  {group.member_role === 'admin' ? 'Administrador' : 'Membro'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-3">
          {group.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{group.current_members}/{group.max_members} membros</span>
          </div>
          {isFull && (
            <Badge variant="destructive" className="text-xs">
              Lotado
            </Badge>
          )}
        </div>

        <div className="text-xs text-gray-400">
          Criado por {group.creator?.display_name || 'Usuário'}
        </div>

        {showActions && (
          <div className="pt-2">
            {group.is_member ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onLeave?.(group.id)}
                className="w-full flex items-center gap-2"
              >
                <UserMinus size={16} />
                Sair do Grupo
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
