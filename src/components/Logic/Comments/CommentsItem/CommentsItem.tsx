import { Grid, Typography } from '@mui/material'
import React from 'react'
import { Comment } from '@redux/index'
import notFoundImage from '@static/notFoundImage.png'
import moment from 'moment'
import { useStyles } from './CommentsItem.styles'


export const CommentsItem: React.FC<Comment> = ({ _id, createdAt, postId, text, updatedAt, userId,userInfo: {firstname, lastname,cloudinaryAvatarUrl } }) => {
   const styles = useStyles()

   const avataSrcrOfAuthorComment = cloudinaryAvatarUrl ?? notFoundImage

   return (
      <>
      <Grid item flexGrow={1} >
         <Grid container spacing={2}>
            <Grid item>
               <div className={styles.commentImageWrapper}>
                  <img src={avataSrcrOfAuthorComment} className={styles.commentImage} alt='avatar' />
               </div>
            </Grid>
            <Grid item flexGrow={1} flexDirection="column" justifyContent="center">
               <div className={styles.comment__author}>
                  <Typography variant="h6">
                     <span>{firstname}</span>
                  </Typography>
                  <Typography variant="h6">
                     <span>{lastname}</span>
                  </Typography>
               </div>
               <div className={styles.comment__date}>
                  <span>
                    Created At:  {moment(createdAt).format('DD/MM/YYYY')}
                  </span>
                  
               </div>
            </Grid>
         </Grid>
         <div className={`${styles.comment__text} ${styles.commentContainer}`}>
            <Typography variant='h6' >
               {text}
            </Typography>
         </div>
      </Grid>
   </>
      
      )
}