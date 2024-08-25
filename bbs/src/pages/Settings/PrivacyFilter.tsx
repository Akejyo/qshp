import { useQuery } from '@tanstack/react-query'

import { useState } from 'react'

import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'

import { getPrivacy, setPrivacy } from '@/apis/settings'
import { StyledSelect } from '@/components/StyledSelect'
import { useAppState } from '@/states'

const menuItems = ['公开', '好友可见', '保密', '仅注册好友可见']

const PrivacyFilter = ({ isMobile }: { isMobile: boolean }) => {
  const theme = useTheme()
  const { state } = useAppState()
  const [friendList, setFriendList] = useState(0)
  const [messageBorad, setMessageBorad] = useState(0)

  const { refetch } = useQuery({
    queryKey: ['privacy'],
    queryFn: async () => {
      try {
        const result = await getPrivacy({ uid: state.user.uid.toString() })
        setFriendList(result.friendList)
        setMessageBorad(result.messageBorad)
        console.log(result)
        return result
      } catch (error) {
        console.error('Error fetching privacy settings:', error)
        return { friendList: 0, messageBorad: 0 }
      }
    },
  })

  const handleSave = async () => {
    try {
      await setPrivacy({
        uid: state.user.uid.toString(),
        friend: friendList,
        comment: messageBorad,
      })
    } catch (error) {
      console.error('Failed to save privacy settings:', error)
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
              注：您可以选择部分人看到您的主页内容
            </Typography>

            <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
              <Typography sx={{ width: 100 }}>好友列表</Typography>
              <FormControl sx={{ width: 200 }}>
                <StyledSelect
                  value={menuItems[friendList]}
                  sx={{ ml: 1 }}
                  onChange={(e) => {
                    const selectedValue = e.target.value as string
                    const selectedIndex = menuItems.findIndex(
                      (item) => item === selectedValue
                    )
                    setFriendList(selectedIndex)
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
            <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
              <Typography sx={{ width: 100 }}>留言板</Typography>
              <FormControl sx={{ width: 200 }}>
                <StyledSelect
                  value={menuItems[messageBorad]}
                  sx={{ ml: 1 }}
                  onChange={(e) => {
                    const selectedValue = e.target.value as string
                    const selectedIndex = menuItems.findIndex(
                      (item) => item === selectedValue
                    )
                    setMessageBorad(selectedIndex)
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
            <Stack direction="row" sx={{ mb: 3, mt: 10 }}>
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
export default PrivacyFilter
