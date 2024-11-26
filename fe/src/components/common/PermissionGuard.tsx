import React from 'react';
import { Typography, Box } from '@mui/material';
import { usePermission } from '../../hooks/usePermission';
import { PermissionGuardProps } from '../../types/common';

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  requiredPermission,
  children,
  fallback,
  showLoading = true
}) => {
  const { hasPermission, loading } = usePermission(requiredPermission);

  if (loading && showLoading) {
    return (  
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <Typography>Loading permissions...</Typography>
      </Box>
    );
  }

  if (!hasPermission) {
    return fallback || (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <Typography color="error">
          You don't have permission to view this content
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard; 