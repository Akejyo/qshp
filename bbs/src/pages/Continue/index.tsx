import React, { useRef, useState } from 'react'
import {
  matchRoutes,
  redirect,
  useLoaderData,
  useNavigate,
} from 'react-router-dom'

import { PersonAddAlt1 } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar as MuiAvatar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import {
  idasChooseUser,
  idasFreshman,
  idasSignIn,
  register,
} from '@/apis/common'
import { IdasSignInResult } from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import routes from '@/routes/routes'
import { setAuthorizationHeader } from '@/utils/authHeader'
import { kIdasOrigin } from '@/utils/routes'

const kTicket = 'ticket'

type IdasResultEx = IdasSignInResult & {
  ticket: string
  continue: string
}

const Continue = () => {
  const idasResult = useLoaderData() as IdasResultEx

  const [pending, setPending] = useState(false)
  const [forceRegister, setRegister] = useState(false)
  const navigate = useNavigate()
  const signIn = (user_id: number) => {
    setPending(true)
    idasChooseUser({
      user_id,
      ticket: idasResult.ticket,
      ephemeral_authorization: idasResult.ephemeral_authorization,
    })
      .then((authorization) => {
        setAuthorizationHeader(authorization)
        navigate(idasResult.continue, {
          replace: true,
        })
      })
      .catch(() => setPending(false))
  }

  return (
    <Dialog open>
      <DialogTitle>
        <Typography variant="h4">欢迎来到清水河畔！</Typography>
      </DialogTitle>
      <DialogContent>
        {idasResult.users && !forceRegister ? (
          <>
            <Typography>请选择您的账号完成登录：</Typography>
            <List>
              {idasResult.users.map((user, index) => (
                <ListItem key={index}>
                  <ListItemButton
                    disabled={pending}
                    onClick={() => signIn(user.uid)}
                  >
                    <ListItemIcon>
                      <Avatar uid={user.uid} variant="rounded" />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography>{user.username}</Typography>
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
              {!!idasResult.remaining_registers && (
                <ListItem key="new">
                  <ListItemButton
                    disabled={pending}
                    onClick={() => setRegister(true)}
                  >
                    <ListItemIcon>
                      <MuiAvatar variant="rounded">
                        <PersonAddAlt1 />
                      </MuiAvatar>
                    </ListItemIcon>
                    <Typography>注册新用户</Typography>
                  </ListItemButton>
                </ListItem>
              )}
            </List>
          </>
        ) : (
          <>
            <Typography variant="h6">
              {forceRegister
                ? '请填写注册信息：'
                : '您还未注册过清水河畔账号，清填写信息完成注册：'}
            </Typography>
            <RegisterForm
              idasResult={idasResult}
              onClose={() => setRegister(false)}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

const RegisterForm = ({
  idasResult,
  onClose,
}: {
  idasResult: IdasResultEx
  onClose: () => void
}) => {
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {}
  const goFreshmanOrBack = async () => {
    if (idasResult.users) {
      onClose()
    } else {
      await idasFreshman({
        ticket: idasResult.ticket,
        ephemeral_authorization: idasResult.ephemeral_authorization,
      })
      navigate(idasResult.continue, { replace: true })
    }
  }
  const handleRegister = async () => {
    if (!formRef.current) {
      return
    }
    const data = new FormData(formRef.current)
    const username = data.get('username')
    const password = data.get('password')
    const password2 = data.get('password2')
    const email = data.get('email')
    if (!username || !password || !email) {
      return
    }
    setAuthorizationHeader(
      await register({
        ticket: idasResult.ticket,
        ephemeral_authorization: idasResult.ephemeral_authorization,
        username: username.toString(),
        password: password.toString(),
        email: email.toString(),
      })
    )
    navigate(idasResult.continue, { replace: true })
  }
  return (
    <form onSubmit={onSubmit} ref={formRef}>
      <Grid container alignItems="center" rowSpacing={2}>
        <Grid item xs={4}>
          <Typography>用户名：</Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField
            autoFocus
            fullWidth
            name="username"
            helperText="注册后不能随意修改用户名，请认真考虑后填写。"
            required
          />
        </Grid>
        <Grid item xs={4}>
          <Typography>河畔密码：</Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField
            type="password"
            fullWidth
            name="password"
            helperText="建议设置一个安全的河畔密码并妥善保存，以便今后登录。"
          />
        </Grid>
        <Grid item xs={4}>
          <Typography>确认密码：</Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField type="password" fullWidth name="password2" />
        </Grid>
        <Grid item xs={4}>
          <Typography>Email：</Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField type="email" fullWidth name="email" />
        </Grid>
      </Grid>
      <Stack direction="row" justifyContent="center" alignItems="center" my={2}>
        <Button variant="contained" onClick={handleRegister}>
          立即注册
        </Button>
        <Button variant="outlined" sx={{ ml: 2 }} onClick={goFreshmanOrBack}>
          {idasResult.users ? '返回' : '到处逛逛，稍后注册'}
        </Button>
      </Stack>
    </form>
  )
}

const sanitizeContinuePath = (path: string | null) =>
  path && matchRoutes(routes.current, path) ? path : '/'

export const ContinueLoader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const ticket = searchParams.get(kTicket)
  if (!ticket) {
    throw 'Invalid signin'
  }
  const originalSearchParams = new URLSearchParams(searchParams)
  originalSearchParams.delete(kTicket)
  const continuePath = `${kIdasOrigin}${url.pathname}?${originalSearchParams}`
  if (ticket) {
    const result = await idasSignIn({ continue: continuePath, ticket })
    const path = sanitizeContinuePath(searchParams.get('path'))
    if (result.authorization) {
      setAuthorizationHeader(result.authorization)
      return redirect(path)
    }
    return { ...result, ticket, continue: path }
  }
}

export default Continue