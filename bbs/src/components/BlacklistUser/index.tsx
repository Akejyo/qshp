import { PlaylistRemove } from '@mui/icons-material'
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'

import { UserInfo } from '@/common/interfaces/response'
import { pages } from '@/utils/routes'

import Avatar from '../Avatar'
import Link from '../Link'

const BlacklistUser = ({
  data,
  isMobile,
}: {
  data: UserInfo
  isMobile: boolean
}) => {
  const theme = useTheme()

  const blacklistUserContent = (
    <>
      <Box mx={isMobile ? 2 : 0}>
        <Stack direction="row" my={isMobile ? 1 : 0}>
          <Box sx={{ mr: 2 }}>
            <Avatar
              alt={data.username}
              uid={data.user_id}
              sx={{ width: 37, height: 37 }}
              variant="rounded"
            />
          </Box>
          <Box className="flex-1">
            <Stack justifyContent="space-between">
              <Stack direction="row">
                <Link
                  to={pages.user({ uid: data.user_id })}
                  className={'line-clamp-2'}
                  underline="none"
                >
                  <Link color="inherit" underline="none">
                    {data.username}
                  </Link>
                </Link>
              </Stack>
              <Stack>
                <Typography variant="subtitle2">{data.user_group}</Typography>
              </Stack>
            </Stack>
          </Box>
          <Box sx={{ mt: 0 }}>
            <Button size="small" sx={{ py: 0 }}>
              <PlaylistRemove />
              移出黑名单
            </Button>
          </Box>
        </Stack>
        {isMobile && <Divider />}
      </Box>
    </>
  )

  return (
    <Box>
      {isMobile ? (
        blacklistUserContent
      ) : (
        <Paper
          className={`shadow-lg pl-6 pr-2 py-4`}
          style={{
            borderRadius: '10px',
            borderColor: theme.palette.primary.main,
          }}
          variant="outlined"
        >
          {blacklistUserContent}
        </Paper>
      )}
    </Box>
  )
}
export default BlacklistUser
