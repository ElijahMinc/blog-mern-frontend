import {Button, Card, CardActions, CardContent, CardMedia, Collapse, Grid, TextField, Typography } from '@mui/material'
import moment from 'moment'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { createPostThunk, editPostThunk, likePostThunk, Post, selectPost, selectUser } from '@redux/index'
import notFoundImage from '@static/notFoundImage.png'
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {  useForm } from 'react-hook-form'
import { ThemedInput } from '@Common/ThemedInput/ThemedInput'
import { getFormRules } from '@utils/formRules'
import { TextArea } from '@Common/TextArea/TextArea'
import { defaultValuesPost, FormDefaultValuesPost } from '../types/Post.interface'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@redux/configureStore'
import { useHistory } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import { Comments } from '@/components/Logic/Comments/Comments/Comments'
import { getTrimValue } from '@/utils/getTrimValue'
import { getLowerCaseValue } from '@/utils/getLowerCaseValue'
import { getMaxLengthStr } from '@/utils/getMaxLengthStr'
import { Like } from '@Common/Like/Like'
import { ExpandMore } from '@Common/ExpandMore/ExpandMore'
import { useStyles } from './PostReview.styles'
import { getTransformTags, TransformedTagsInterface } from '@/utils/getTransformTags'
import { v4 as uuidv4 } from 'uuid';

interface PostReviewProps {
   post: Post | null
   isEdit: boolean
}

export const PostReview: React.FC<PostReviewProps> = ({ post, isEdit }) => {
   const {
      data: {
         user: {
            _id: authUserId
         }
      }
   } = useSelector(selectUser)

   const [ tags, setTags] = useState<TransformedTagsInterface[]>(!!post?.tags?.length ? getTransformTags(post.tags) : [])
   const [ tagValue, setTagValue] = useState('')

   const isLikedStatus = post?.likes?.userIds.indexOf(authUserId) !== -1

   const [isNewPost] = useState(!post || isEdit) // USE MEMO!
   const [previewImg, setPreview] = useState<string>('')
   
   const [expanded, setExpanded] = useState(false);
   const [like, setLike] = useState(isLikedStatus)
   const [likes, setLikes] = useState(post?.likes?.likes || 0)

   const dispatch = useDispatch<AppDispatch>()
   const { isFetching } = useSelector(selectPost)

   const imageRef = useRef<HTMLImageElement | null>(null)
   const fileRef = useRef<HTMLInputElement | null>(null)

   const { push } = useHistory()
   const classes = useStyles()



   const imageUrl = 
         !!post?.cloudinaryUrl 
            ? post?.cloudinaryUrl  
            : notFoundImage
   const authorImageUrl = 
         post?.userInfo?.cloudinaryAvatarUrl 
               ? post?.userInfo?.cloudinaryAvatarUrl
               : notFoundImage

   const handleLikeClick =  async () =>  {
      post &&  await dispatch(likePostThunk(post._id))
      setLikes(like ? likes - 1 : likes + 1)
      setLike(!like)
   }

   const handleExpandClick = () =>  setExpanded(!expanded)


   const form = useForm<FormDefaultValuesPost>({
      defaultValues: defaultValuesPost,
      mode: 'onSubmit'
   })

   const { watch, setValue, handleSubmit ,reset } = form

   const handleChangeFile = (e:  ChangeEvent<HTMLInputElement>) => {
      const target = e.target
      if(!target?.files?.length) return 
      
      const files = Array.from(target.files)

      files.forEach(file => {
         const link = URL.createObjectURL(file)
         setPreview(link)
      })
   
      setValue('image', files[0])
   }

   const onSubmitHandle = async (data: FormDefaultValuesPost) => {

      if(isEdit){
         if(!post) return

         await dispatch(editPostThunk({...data, _id: post._id}))

      }else{
         await dispatch(createPostThunk(data))
      }

      push(`/home`)

   }

   useEffect(() => {
      if(!!post){
         reset({
            title: post?.title || '',
            text: post?.text || '',
            tags: post?.tags || [],
         })
         if(post?.cloudinaryId){
            setPreview(imageUrl)
         }
      }
      
   }, [post])

   useEffect(() => {
      setValue('tags', tags.map(tag => tag.title))
   }, [tags])



   return (
      <Grid container spacing={4} flexDirection="column">
         <Grid item flexGrow={1}>
            {isNewPost && <Typography variant='h3' textAlign='center' marginBottom={3}>{isEdit ? 'Edit Post' : 'New Post'}</Typography>}
            <Card variant="outlined" sx={{padding: '20px'}} style={{
               overflow:'visible',
               boxShadow: '0px 0px 5px 0px rgb(63 81 181)',
               borderRadius: '10px'
            }} >
               {isNewPost ? (
                  <>
                     {!!previewImg && (<img ref={imageRef} className={classes.imgPreview} src={previewImg} alt="" />)} 
                     <Button fullWidth variant='contained' onClick={() => fileRef.current?.click()}>Add Preview Image</Button>
                     <input ref={fileRef} type="file" style={{ display: 'none'}} onChange={handleChangeFile} />
                  </>
               ) : (
                  <div className={classes.cardMediaContainer}>
                     <CardMedia
                        component="img"
                        className={classes.cardContentMedia}
                        height="500px"
                        image={imageUrl}
                        alt={imageUrl}
                     />
                   </div>
               )}
               <CardContent className={classes.cardContent}>
                  {isNewPost ?  (
                        <Grid container flexDirection="column" spacing={4}>
                           <Grid item flexGrow={1} sx={{
                              marginTop: '10px'
                           }}>
                              <Typography variant='h4' marginBottom={3}>Title:</Typography>
                              <ThemedInput 
                                 form={form}
                                 name="title"
                                 defaultValue={watch('title') || ''}
                                 rules={getFormRules('This Field is Required')}
                                 placeholder='Enter Your Title'
                                 variant='standard'
                                 focused
                                 sx={{
                                    marginLeft: '20px',
                                    '& .MuiInput-root': { fontSize: '40px' },
                                 }}
                              />
                           </Grid>
                           <Grid item flexGrow={1} sx={{
                              marginTop: '10px',
                           }}>
                              <Typography variant='h4' marginBottom={3}>Tags:</Typography>
                              <Grid container spacing={0} color="primary" sx={{
                                 marginLeft: '5px',
                                 marginBottom: '10px',
                                 '& .MuiGrid-item': {
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    background: '#3f51b5'
                                 }
                              }}>
                                    {tags.map(({id, title}) => (
                                       <Grid key={id} item sx={{
                                          marginLeft: '10px',
                                          position: 'relative',
                                          color: 'white'

                                       }}>
                                          {`#${title}`}
                                          <CloseIcon sx={{
                                              fontSize: '10px',
                                              position: 'absolute',
                                              top: '5px',
                                              right:'5px',
                                              cursor: 'pointer',
                                              color: 'white'
                                          }} 
                                          onClick={() => setTags(tags.filter(tag => tag.id !== id))}
                                          />
                                       </Grid>
                                    ))}
                              </Grid>
                              <Grid container spacing={4}>
                                 <Grid item flexGrow={2}>
                                    <TextField  
                                       value={tagValue}
                                       onChange={(e) => setTagValue(getMaxLengthStr(getLowerCaseValue(getTrimValue(e.target.value)), 10))}
                                       variant='standard' 
                                       fullWidth label="Enter your tags"
                                       placeholder='Enter Your tags'
                                       sx={{
                                             '& .MuiInput-root': { fontSize: '20' },
                                          }} 
                                    />
                                 </Grid>
                                 <Grid item flexGrow={1}>
                                    <Button fullWidth variant="contained" disabled={!tagValue} onClick={() => {
                                       setTagValue('')
                                       setTags(prev => [...prev, { id: uuidv4(), title: tagValue }])
                                    }} >Add</Button>
                                 </Grid>
                              </Grid>

                           </Grid>
                           <Grid item flexGrow={1}>
                              <Typography variant='h4' marginBottom={3}>Message:</Typography>
                                 <TextArea form={form} name="text" defaultValue={post?.text || ''} />
                           </Grid>
                        </Grid>
                  ) : (
                     <>
                     <div className={classes.cardContentHeader}>
                        <div className={classes.cardContentLogo} >
                           <img className={classes.cardContentImg} src={authorImageUrl} alt='' />
                        </div>
                        <div className={classes.cardContentInfo} >
                           <Grid item container spacing={1} alignItems="center">
                              <Grid item>
                                 <span >
                                    User:
                                 </span>
                              </Grid>
                              <Grid item>
                                 <Typography variant='h6' >
                                    {`${post?.userInfo?.firstname} ${post?.userInfo?.lastname}`} 
                                 </Typography>
                              </Grid>
                           </Grid>
                           <span>{moment(post?.createdAt).format('DD.MM.YYYY')}</span>
                        </div>
                     </div>
                     <div className={classes.cardContentBody}>
                        <Typography variant="h4" gutterBottom textAlign='center'>
                           {post?.title}
                        </Typography>
                        <Grid container spacing={0} color="primary" sx={{
                                 marginLeft: '5px',
                                 marginBottom: '10px',
                                 '& .MuiGrid-item': {
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    background: '#3f51b5'
                                 }
                              }}>
                                    {!!post?.tags?.length && post.tags.map((tag) => (
                                       <Grid key={`tag-${tag}`} item sx={{
                                          marginLeft: '10px',
                                          position: 'relative',
                                          color: 'white'

                                       }}>
                                          {`#${tag}`}
                                       </Grid>
                                    ))}
                           </Grid>
                        {/* <ul className={classes.cardContentTags}>
                           {!!post?.tags && !!post?.tags.length && post?.tags.map(tagName => (
                              <li key={`tag-${tagName}`}>{`#${tagName}`}</li>
                           ))}
                        </ul> */}
                     </div>
                     <CardActions disableSpacing>
                           <Like 
                              like={like}
                              onClick={handleLikeClick}
                              aria-label="like"
                           >
                              <FavoriteIcon/>
                           </Like>
                              {likes}
                           <ExpandMore
                              expand={expanded}
                              onClick={handleExpandClick}
                              aria-expanded={expanded}
                              aria-label="show more"
                           >
                              <ExpandMoreIcon />
                        </ExpandMore>
                     </CardActions>
                     <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent sx={{
                              borderTop: '1px solid rgb(63 81 181)',
                              borderBottom: '1px solid rgb(63 81 181)',
                        }}>
                              <TextArea
                                 form={form}
                                 name='text'
                                 defaultValue={post?.text} 
                                 readOnly
                                 toolbarHidden
                              />
                        </CardContent>
                     </Collapse>
                     </>
                  )}
               </CardContent>
               {isNewPost && (
                  <Button disabled={isFetching} variant="contained" type='submit' fullWidth onClick={handleSubmit(onSubmitHandle)}>{isEdit ? 'Update' : 'Create'} Post</Button>
               )}
            </Card>
         </Grid>
      {!isNewPost && !!post && !!Object.keys(post || {}).length && (
            <Grid item flexGrow={1} >
               <Card 
                  sx={{
                     padding: '10px'
                  }}
               >
               <Typography variant='h5' gutterBottom>Comments: </Typography>
               <CardContent>
                  <Comments postId={post._id} />
               </CardContent>
            </Card>
         </Grid>
      )}
      </Grid>
      )
}