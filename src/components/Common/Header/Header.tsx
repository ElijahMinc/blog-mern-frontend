import { AccountCircle } from '@mui/icons-material';
import { AppBar, Button, Grid, IconButton, Menu, MenuItem, Toolbar, Typography, useTheme } from '@mui/material'
import React, { ChangeEvent, useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useCheckIsLoginPage } from '@hooks/useCheckIsLoginPage';
import { deleteAvatarThunk, refreshAuth, resetPosts, selectUser, setAvatarThunk } from '@redux/index';
import { AppDispatch } from '@redux/configureStore';
import { useCustomTheme } from '@context/Theme/ThemedProvider';
import { useStyles } from './Header.styles';




export const Header: React.FC = () => {
   const [file, setFile] = useState<File | undefined>(undefined)
   const { handleToggleTheme } = useCustomTheme()
   const theme = useTheme()

   const styles = useStyles()

   const fileRef = useRef<HTMLInputElement | null>(null)

   const { data: { 
      isAuth,
      user: { firstname, lastname, cloudinaryAvatarUrl }
     }} = useSelector(selectUser)
   const dispatch = useDispatch<AppDispatch>()
 
   const { push } = useHistory()
   const isLoginPage = useCheckIsLoginPage()

   const infoPage = isAuth ? `${firstname} ${lastname}` : 'Auth Page'

   const withAuthLoginText = isAuth ? 'Logout' : 'Login'
   const withNonAuthLoginText = isLoginPage ? 'Register' : 'Login'

   const redirectLoginOrRegisterPage = useCallback(() => push(isLoginPage ? '/register' : '/login'), [isLoginPage])

   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);


   const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () =>  setAnchorEl(null);

   const logout = () => dispatch(refreshAuth())

    const setAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target
      if(!target?.files) return 

      const file = target?.files[0]
      setFile(file)

      await dispatch(setAvatarThunk(file))
    }

    const removeAvatar = async () => {
      await dispatch(deleteAvatarThunk())
    }

   return (
         <AppBar sx={{
            zIndex: '1000'
         }} color="primary" position="fixed">
            <Toolbar >
               <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  {infoPage}
               </Typography>
                     <Button sx={{
                           marginRight: '10px',
                           // marginLeft: 'auto'

                           }} color="secondary" variant="contained" onClick={() => theme.palette.mode === 'light' ?  handleToggleTheme('dark') : handleToggleTheme('light') }>
                              theme
                     </Button>
               {isAuth ? (
                     <Grid container sx={{
                        width: 'auto',
                        marginLeft: 'auto'
                     }} alignItems="center">
                        <Grid item>
                           <Button sx={{
                              marginRight: '10px',
                              // marginLeft: 'auto'

                              }} color="secondary" variant="contained" onClick={() => push('/chat')}>
                                 Chat
                           </Button>
                        </Grid>
                        <Grid item>
                           <IconButton
                              size="large"
                              aria-label="account of current user"
                              aria-controls="menu-appbar"
                              aria-haspopup="true"
                              onClick={handleMenu}
                              color="inherit"
                           >
                              {cloudinaryAvatarUrl ? <div className={styles.avatarWrapperImg}>
                                    <img className={styles.avatarImg} src={cloudinaryAvatarUrl} alt="" />
                              </div> : (
                                    <AccountCircle />
                              )}  
                           </IconButton>
                        </Grid>

                        <Menu
                           id="menu-appbar"
                           anchorEl={anchorEl}
                           anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                           }}
                           keepMounted
                           transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                           }}
                           open={Boolean(anchorEl)}
                           onClose={handleClose}
                        >
                        <MenuItem onClick={handleClose}>
                           {!!cloudinaryAvatarUrl ? (
                              <Button variant="contained" color='secondary' onClick={removeAvatar}>
                                 Remove Avatar
                              </Button>
                           ) : (
                              <Button variant="contained" color='secondary' onClick={() => fileRef.current?.click()}>
                                 Setup Avatar
                                 <input ref={fileRef} type="file" accept="image/png, image/jpeg, 'image/jpg" multiple={false}  style={{display: 'none'}} onChange={setAvatar} />
                              </Button>
                           )}
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                           <Button variant="contained" color='secondary' onClick={() => {
                              dispatch(resetPosts())
                              push('/post', {
                              isEdit: false
                           })}
                           }>Create New Post!</Button>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                           <Button color="secondary" variant="contained"  onClick={logout}>
                              {withAuthLoginText}
                           </Button>
                        </MenuItem>
                        </Menu>
                     </Grid>
               ) : (
                  <Button color="inherit" variant="text" onClick={redirectLoginOrRegisterPage}>
                     {withNonAuthLoginText}
                  </Button>
               )
              }
              
            </Toolbar>
      </AppBar>
      )
}