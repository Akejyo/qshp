import { useQuery } from '@tanstack/react-query'

import { useState } from 'react'

import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  MenuItem,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'

import {
  checkRename,
  getProfile,
  setProfile,
  setUsername,
} from '@/apis/settings'
import { StyledField } from '@/components/StyledField'
import { StyledSelect } from '@/components/StyledSelect'
import { useAppState } from '@/states'

import ProfileAvatar from './ProfileAvatar'
import ProfileSign from './ProfileSign'

const menuItems = ['公开', '好友可见', '保密']

const ProfileButton = ({
  title,
  value,
  Click,
}: {
  title: string
  value: string
  Click: () => void
}) => {
  const theme = useTheme()
  return (
    <Button fullWidth onClick={Click} sx={{ my: 0.5 }}>
      <Typography sx={{ color: theme.palette.text.primary }}>
        {title}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <Typography
        sx={{
          color: theme.palette.text.secondary,
          textTransform: 'none',
          pr: 1,
        }}
      >
        {value}
      </Typography>
      <ArrowForwardIos color="primary" fontSize="small" sx={{ mr: -1 }} />
    </Button>
  )
}

const Profile = ({ isMobile }: { isMobile: boolean }) => {
  const { state } = useAppState()
  const theme = useTheme()
  const [name, setName] = useState('tmp')
  const [biopermission, setBiopermission] = useState(0)
  const [selfIntroduction, setSelfIntroduction] = useState('tmp')
  const [title, setTitle] = useState('tmp')
  const [sign, setSign] = useState('tmp')
  const [privacy, setPrivacy] = useState('公开')

  //mobile
  const [usernameOpen, setUsernameOpen] = useState(false)
  const [introductionOpen, setIntroductionOpen] = useState(false)
  const [titleOpen, setTitleOpen] = useState(false)

  const { refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      console.log('fetch profile')
      const result = await getProfile()
      setName(result.username)
      setBiopermission(result.biopermission)
      setSelfIntroduction(result.bio)
      setTitle(result.customstatus)
      setSign(result.sightml)
      console.log(result)
      return result
    },
  })

  const handleChangeUsername = async () => {
    setUsernameOpen(false)
    const permission = await checkRename({ uid: state.user.uid.toString() })
    if (permission) {
      const result = await setUsername({
        uid: state.user.uid.toString(),
        old_name: state.user.username,
        new_name: name,
      })
    } else {
      alert('您已经使用过一次免费改名机会，无法再次修改用户名')
    }
  }

  const handleSave = async () => {
    try {
      await setProfile({
        biopermisson: biopermission,
        bio: selfIntroduction,
        customstatus: title,
        sightml: sign,
      })
    } catch (error) {
      console.error('Failed to save privacy settings:', error)
    }
  }

  return (
    <>
      <Box className="relative overflow-hidden p-2" sx={{ width: '100%' }}>
        <Paper elevation={3} sx={{ borderRadius: '10px', overflow: 'hidden' }}>
          {isMobile ? (
            <Box sx={{ mx: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, mt: 3 }}></Typography>
              <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
                <Typography sx={{ width: 100, ml: 1 }}>头像</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <ProfileAvatar isMobile={isMobile} />
              </Stack>
              <Divider />
              <ProfileButton
                title="用户名"
                value={name}
                Click={() => setUsernameOpen(true)}
              />
              <Dialog
                open={usernameOpen}
                onClose={() => setUsernameOpen(false)}
              >
                <DialogTitle>修改用户名</DialogTitle>
                <DialogContent>
                  <StyledField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ width: '100%' }}
                  />
                  <Typography
                    sx={{
                      mt: 1,
                      mb: 3,
                      color: alpha(theme.palette.text.secondary, 0.3),
                    }}
                    fontSize={12}
                  >
                    您有一次免费改名的机会，如需换名，请在上面输入新的用户名，并点击“修改”按钮
                  </Typography>
                  <Button onClick={handleChangeUsername} variant="contained">
                    修改
                  </Button>
                </DialogContent>
              </Dialog>
              <Divider />
              <ProfileButton
                title="自我介绍"
                value={selfIntroduction}
                Click={() => setIntroductionOpen(true)}
              />
              <Dialog
                open={introductionOpen}
                onClose={() => setIntroductionOpen(false)}
              >
                <DialogTitle>修改自我介绍</DialogTitle>
                <DialogContent>
                  <StyledField
                    multiline
                    rows={4}
                    value={selfIntroduction}
                    onChange={(e) => setSelfIntroduction(e.target.value)}
                    sx={{ width: '100%', mb: 1 }}
                  />
                  <FormControl sx={{ width: 120 }}>
                    <StyledSelect
                      value={privacy}
                      onChange={(e) => setPrivacy(e.target.value as string)}
                    >
                      {menuItems.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </FormControl>
                </DialogContent>
              </Dialog>
              <Divider />
              <ProfileButton
                title="自定义头衔"
                value={title}
                Click={() => setTitleOpen(true)}
              />
              <Dialog open={titleOpen} onClose={() => setTitleOpen(false)}>
                <DialogTitle>修改自定义头衔</DialogTitle>
                <DialogContent>
                  <StyledField
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ width: '100%' }}
                  />
                </DialogContent>
              </Dialog>
              <Divider />
              <Stack sx={{ mb: 3, ml: 1 }}>
                <Typography sx={{ width: 100, mt: 1 }}>个人签名</Typography>
                <ProfileSign
                  userSign={sign}
                  isMobile={isMobile}
                  onSignChange={setSign}
                />
              </Stack>
              <Stack direction="row" sx={{ mb: 3 }}>
                <Box sx={{ width: 100 }}></Box>
                <Button variant="contained" sx={{ px: 4 }} onClick={handleSave}>
                  保存
                </Button>
              </Stack>
            </Box>
          ) : (
            <Box sx={{ pl: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
                基本信息
              </Typography>
              <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
                <Typography sx={{ width: 100 }}>头像</Typography>
                <ProfileAvatar isMobile={isMobile} />
              </Stack>
              <Stack direction="row" alignItems="center">
                <Typography sx={{ width: 100 }}>用户名</Typography>
                <StyledField
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ width: '35%' }}
                />
                <Button onClick={handleChangeUsername}>修改</Button>
              </Stack>
              <Typography
                sx={{
                  ml: 13,
                  mt: 1,
                  mb: 3,
                  color: alpha(theme.palette.text.secondary, 0.3),
                }}
                fontSize={12}
              >
                您有一次免费改名的机会，如需换名，请在上面输入新的用户名，并点击“修改”按钮
              </Typography>
              <Stack direction="row" sx={{ mb: 3 }}>
                <Typography sx={{ width: 100, mt: 1 }}>自我介绍</Typography>
                <StyledField
                  multiline
                  rows={4}
                  value={selfIntroduction}
                  onChange={(e) => setSelfIntroduction(e.target.value)}
                  sx={{ width: '70%' }}
                />
                <FormControl sx={{ width: 90 }}>
                  <StyledSelect value={privacy} sx={{ ml: 1 }}>
                    {menuItems.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
              </Stack>
              <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
                <Typography sx={{ width: 100 }}>自定义头衔</Typography>
                <StyledField
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{ width: '70%' }}
                />
              </Stack>
              <Stack direction="row" sx={{ mb: 3 }}>
                <Typography sx={{ width: 100, mt: 1 }}>个人签名</Typography>
                <ProfileSign
                  userSign={sign}
                  isMobile={isMobile}
                  onSignChange={setSign}
                />
              </Stack>
              <Stack direction="row" sx={{ mb: 3 }}>
                <Box sx={{ width: 100 }}></Box>
                <Button variant="contained" sx={{ px: 4 }} onClick={handleSave}>
                  保存
                </Button>
              </Stack>
            </Box>
          )}
        </Paper>
      </Box>
    </>
  )
}
export default Profile
