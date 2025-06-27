
interface ProfileHeaderProps {
  // No props needed for now
}

const ProfileHeader = ({}: ProfileHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
      <p className="text-gray-600">Gerencie suas informações e preferências da comunidade</p>
    </div>
  );
};

export default ProfileHeader;
