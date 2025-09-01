import React from 'react';
import { Button } from '../../ui/button';
import { ArrowLeft } from 'lucide-react';

interface CreateUserHeaderProps {
  onBack: () => void;
}

const CreateUserHeader: React.FC<CreateUserHeaderProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
      <Button 
        variant="ghost" 
        onClick={onBack} 
        className="p-2 self-start sm:self-auto"
        style={{
          backgroundColor: 'var(--accent)',
          color: 'var(--accent-foreground)'
        }}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight" style={{ color: 'var(--foreground)' }}>
          Create New User
        </h1>
        <p className="text-sm sm:text-base md:text-lg" style={{ color: 'var(--muted-foreground)' }}>
          Add a new user to the system with roles and permissions
        </p>
      </div>
    </div>
  );
};

export default CreateUserHeader;