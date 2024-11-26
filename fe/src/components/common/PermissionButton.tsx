import React from 'react';
import {
  Button,
  Tooltip,
  CircularProgress,
  ButtonProps
} from '@mui/material';
import { usePermission } from '../../hooks/usePermission';
import { PermissionButtonProps } from '../../types/common';

const PermissionButton: React.FC<PermissionButtonProps & ButtonProps> = ({
  requiredPermission,
  children,
  tooltipText = "You don't have permission for this action",
  showLoading = true,
  placement = "top",
  disabled,
  ...props
}) => {
  const { hasPermission, loading } = usePermission(requiredPermission);

  const hasRequiredPermission = hasPermission;
  const isDisabled = loading || disabled || !hasRequiredPermission;

  const button = (
    <Button
      {...props}
      disabled={isDisabled}
    >
      {showLoading && loading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        children
      )}
    </Button>
  );

  if (!hasRequiredPermission && !loading) {
    return (
      <Tooltip title={tooltipText} placement={placement}>
        <span>{button}</span>
      </Tooltip>
    );
  }

  return button;
};

export default PermissionButton; 