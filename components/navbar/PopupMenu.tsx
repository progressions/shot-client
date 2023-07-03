import * as React from 'react';
import { Link, IconButton, Menu, MenuItem, Container } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'
import { signIn, signOut } from 'next-auth/react'

import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import type { Campaign, User } from "../../types/types"

interface MenuPopupStateProps {
  campaign: Campaign | null
  user: User
}

export default function MenuPopupState({ campaign, user }: MenuPopupStateProps) {
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            {...bindTrigger(popupState)}
          >
            <MenuIcon />
          </IconButton>
          <Menu {...bindMenu(popupState)}>
            { campaign?.id &&
              <MenuItem onClick={popupState.close}>
                <Link underline="none" color="inherit" href='/'>
                  Fights
                </Link>
              </MenuItem>
            }
            { campaign?.id &&
              <MenuItem onClick={popupState.close}>
                <Link underline="none" color="inherit" href='/characters'>
                  Characters
                </Link>
              </MenuItem>
            }
            { campaign?.id &&
              <MenuItem onClick={popupState.close}>
                <Link underline="none" color="inherit" href='/sites'>
                  Feng Shui Sites
                </Link>
              </MenuItem>
            }
            { user &&
              <MenuItem onClick={popupState.close}>
                <Link underline="none" color="inherit" href='/campaigns'>
                  Campaigns
                </Link>
              </MenuItem>
            }
            { user?.gamemaster && campaign?.id &&
              <MenuItem onClick={popupState.close}>
                <Link underline="none" color="inherit" href='/admin/weapons'>
                  Weapons
                </Link>
              </MenuItem>
            }
            { user?.gamemaster && campaign?.id &&
              <MenuItem onClick={popupState.close}>
                <Link underline="none" color="inherit" href='/admin/schticks'>
                  Schticks
                </Link>
              </MenuItem>
            }
            { user?.admin &&
              <MenuItem onClick={popupState.close}>
                <Link underline="none" color="inherit" href='/admin/users'>
                  Users
                </Link>
              </MenuItem>
            }
            { !user?.id &&
            <MenuItem onClick={() => signIn()}>
                Sign In
              </MenuItem>
            }
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}
