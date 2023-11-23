import { Icon } from '@mdi/react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText } from '@mui/material';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
  onSubmenuItemClicked: PropTypes.func,
};

export default function NavSection({ data = [], onSubmenuItemClicked, ...other }) {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem key={item.title} item={item} onSubmenuItemClicked={onSubmenuItemClicked} />
        ))}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
  onSubmenuItemClicked: PropTypes.func,
};

function NavItem({ item, onSubmenuItemClicked }) {
  const { title, path, icon, info, haveAccess, showSubItems, subItems, isDisabled } = item;
  const [isExpanded, setIsExpanded] = useState(showSubItems);

  const ToggleShowSubItems = () => {
    setIsExpanded(!isExpanded);
  };

  if (subItems && haveAccess) {
    return (
      <div>
        <StyledNavItem
          onClick={ToggleShowSubItems}
          sx={{
            '&.active': {
              color: 'text.primary',
              bgcolor: 'action.selected',
              fontWeight: 'fontWeightBold',
            },
          }}
        >
          <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
          <ListItemText disableTypography primary={title} />
          {isExpanded ? <Icon size={1} path={mdiChevronDown} /> : <Icon size={1} path={mdiChevronUp} />}
        </StyledNavItem>
        {isExpanded && (
          <Box sx={{ pl: '20px' }}>
            <List>
              {subItems.map((subItem) => (
                <NavItem key={subItem.title} item={subItem} onSubmenuItemClicked={onSubmenuItemClicked} />
              ))}
            </List>
          </Box>
        )}
      </div>
    );
  }

  return (
    <>
      {haveAccess && (
        <StyledNavItem
          component={path ? RouterLink : Box}
          to={path}
          sx={{
            '&.active': {
              color: 'text.primary',
              bgcolor: 'action.selected',
              fontWeight: 'fontWeightBold',
            },
          }}
          onClick={() => onSubmenuItemClicked(title)}
          disabled={isDisabled}
        >
          <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

          <ListItemText disableTypography primary={title} />

          {info && info}
        </StyledNavItem>
      )}
    </>
  );
}
