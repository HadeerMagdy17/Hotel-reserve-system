import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// تعريف الـ Interface للأكشن الواحد
export interface IMenuAction {
  label: string;
  icon: React.ReactNode;
  onClick: (id: string) => void;
  color?: string;
}

interface IProps {
  itemId: string;
  actions: IMenuAction[];
}

const ActionMenu: React.FC<IProps> = ({ itemId, actions }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {actions.map((action, index) => (
          <MenuItem 
            key={index} 
            onClick={() => {
              action.onClick(itemId);
              handleClose();
            }}
          >
            <ListItemIcon sx={{ color: action.color }}>
              {action.icon}
            </ListItemIcon>
            <ListItemText>{action.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ActionMenu;