import { useEffect, useState } from 'react'

import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'

import { changePassword, checkPassword } from '@/apis/settings'
import { StyledField } from '@/components/StyledField'
import { StyledSelect } from '@/components/StyledSelect'
import { useAppState } from '@/states'

const menuItems = [
  '无安全提问',
  '母亲的名字',
  '父亲的名字',
  '父亲出生的城市',
  '您其中一位老师的名字',
  '您个人计算机的型号',
  '您最喜欢的餐馆名称',
  '驾驶执照最后四位数字',
]

const PasswordSecurity = ({ isMobile }: { isMobile: boolean }) => {
  const { state } = useAppState()
  const theme = useTheme()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [email, setEmail] = useState('')
  const [securityQuestion, setSecurityQuestion] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [oldPasswordCorrect, setOldPasswordCorrect] = useState(false)

  const TextFieldWidth = isMobile ? '65%' : '40%'
  useEffect(() => {
    if (oldPassword) {
      checkOldPassword()
    }
  }, [oldPassword])

  const checkOldPassword = async () => {
    try {
      const response = await checkPassword({
        uid: state.user.uid.toString(),
        oldpassword: oldPassword,
      })
      const result = await response.json()
      if (result.code === 200) setOldPasswordCorrect(true)
      setOldPasswordCorrect(false)
    } catch (error) {
      console.error('Failed to check old password:', error)
      return false
    }
  }

  const checkNewPassword = () => {
    if (newPassword && newPasswordConfirm && newPassword === newPasswordConfirm)
      return true
    return false
  }

  const handleSave = async () => {
    if (oldPasswordCorrect && checkNewPassword()) {
      try {
        await changePassword({
          oldpassword: oldPassword,
          newpassword: newPassword,
          email: email,
          question: securityQuestion,
        })
      } catch (error) {
        console.error('Failed to save privacy settings:', error)
      }
    }
  }
  return (
    <>
      <Box className="relative overflow-hidden p-2" sx={{ width: '100%' }}>
        <Paper elevation={3} sx={{ borderRadius: '10px', overflow: 'hidden' }}>
          <Box sx={{ pl: 3 }}>
            <Typography
              fontSize={13}
              sx={{
                mb: 5,
                mt: 3,
                color: theme.palette.text.secondary,
              }}
            >
              <Box component="span" sx={{ color: 'red' }}>
                *
              </Box>
              注：您必须填写原密码才能修改下面的资料
            </Typography>
            <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
              <Typography sx={{ width: 100 }}>
                旧密码
                <Box component="span" sx={{ color: 'red', ml: 5 }}>
                  *
                </Box>
              </Typography>
              <StyledField
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                sx={{ width: TextFieldWidth }}
              />
            </Stack>
            <Stack direction="row" alignItems="center">
              <Typography sx={{ width: 100 }}>新密码</Typography>
              <StyledField
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ width: TextFieldWidth }}
              />
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
              如果不需要更改密码，此处请留空
            </Typography>
            <Stack direction="row" alignItems="center">
              <Typography sx={{ width: 100 }}>确认新密码</Typography>
              <StyledField
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                sx={{ width: TextFieldWidth }}
              />
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
              如果不需要更改密码，此处请留空
            </Typography>

            <Stack direction="row" alignItems="center" sx={{ mb: 4 }}>
              <Typography sx={{ width: 100 }}>安全提问</Typography>
              <FormControl sx={{ width: isMobile ? '65%' : '40%' }}>
                <StyledSelect
                  value={securityQuestion}
                  onChange={(e) => {
                    const selectedValue = e.target.value as string
                    setSecurityQuestion(selectedValue)
                  }}
                >
                  {menuItems.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            </Stack>
            <Stack direction="row" alignItems="center" sx={{ mb: 4 }}>
              <Typography sx={{ width: 100 }}>回答</Typography>
              <StyledField
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                sx={{ width: isMobile ? '65%' : '40%' }}
              />
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ mb: isMobile ? 3 : 8 }}
            >
              <Typography sx={{ width: 100 }}>邮箱</Typography>
              <StyledField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ width: TextFieldWidth }}
              />
            </Stack>
            <Stack direction="row" sx={{ mb: 3 }}>
              <Box sx={{ width: 100 }}></Box>
              <Button variant="contained" sx={{ px: 4 }} onClick={handleSave}>
                保存
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </>
  )
}
export default PasswordSecurity
