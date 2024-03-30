import { useState } from 'react'

import {
  ColorLens,
  FormatBold,
  InsertEmoticon,
  InsertLink,
  InsertPhoto,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Grid,
  IconButton,
  Popover,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'

import { StyledField } from '@/components/StyledField'

const colors = [
  ['Black', '黑色'],
  ['Sienna', '赭色'],
  ['DarkOliveGreen', '暗橄榄绿色'],
  ['DarkGreen', '暗绿色'],
  ['DarkSlateBlue', '暗灰蓝色'],
  ['Navy', '海军蓝色'],
  ['Indigo', '靛青色'],
  ['DarkSlateGray', '墨绿色'],
  ['DarkRed', '暗红色'],
  ['DarkOrange', '暗桔黄色'],
  ['Olive', '橄榄色'],
  ['Green', '绿色'],
  ['Teal', '水鸭色'],
  ['Blue', '蓝色'],
  ['SlateGray', '灰石色'],
  ['DimGray', '暗灰色'],
  ['Red', '红色'],
  ['SandyBrown', '沙褐色'],
  ['YellowGreen', '黄绿色'],
  ['SeaGreen', '海绿色'],
  ['MediumTurquoise', '间绿宝石'],
  ['RoyalBlue', '皇家蓝'],
  ['Purple', '紫色'],
  ['Gray', '灰色'],
  ['Magenta', '红紫色'],
  ['Orange', '橙色'],
  ['Yellow', '黄色'],
  ['Lime', '酸橙色'],
  ['Cyan', '青色'],
  ['DeepSkyBlue', '深天蓝色'],
  ['DarkOrchid', '暗紫色'],
  ['Silver', '银色'],
  ['Pink', '粉色'],
  ['Wheat', '浅黄色'],
  ['LemonChiffon', '柠檬绸色'],
  ['PaleGreen', '苍绿色'],
  ['Aquamarine', '苍宝石绿'],
  ['SkyBlue', '亮蓝色'],
  ['Plum', '洋李色'],
  ['White', '白色'],
]

const ProfileSign = () => {
  const [sign, setSign] = useState('之前的个人签名')
  const [selectionStart, setSelectionStart] = useState<number>(0)
  const [selectionEnd, setSelectionEnd] = useState<number>(0)
  const [colorAnchorEl, setColorAnchorEl] = useState<null | HTMLElement>(null)
  const [color, setColor] = useState('black')
  const [imageAnchorEl, setImageAnchorEl] = useState<null | HTMLElement>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageWidth, setImageWidth] = useState<number>(0)
  const [imageHeight, setImageHeight] = useState<number>(0)
  const [linkAnchorEl, setLinkAnchorEl] = useState<null | HTMLElement>(null)
  const [linkUrl, setLinkUrl] = useState<string>('')
  const [linkText, setLinkText] = useState<string>('')

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSign(e.target.value)
    setSelectionStart(e.target.selectionStart as number)
    setSelectionEnd(e.target.selectionEnd as number)
  }

  const handleTextFieldSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectionStart(e.target.selectionStart as number)
    setSelectionEnd(e.target.selectionEnd as number)
  }

  const handleBoldButtonClick = () => {
    const newSign =
      sign.slice(0, selectionStart) +
      '[b]' +
      sign.slice(selectionStart, selectionEnd) +
      '[/b]' +
      sign.slice(selectionEnd)
    setSign(newSign)
  }

  const handleColorButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setColorAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setColorAnchorEl(null)
    setImageAnchorEl(null)
    setLinkAnchorEl(null)
    setImageUrl('')
    setImageWidth(0)
    setImageHeight(0)
    setLinkUrl('')
    setLinkText('')
  }
  const handleColorSelect = (color: string) => {
    setColorAnchorEl(null)
    setColor(color)
    const newSign =
      sign.slice(0, selectionStart) +
      `[color=${color}]` +
      sign.slice(selectionStart, selectionEnd) +
      '[/color]' +
      sign.slice(selectionEnd)
    setSign(newSign)
  }

  const handleImageButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setImageAnchorEl(event.currentTarget)
  }
  const handleImageUrlSubmit = () => {
    const newSign =
      sign.slice(0, selectionStart) +
      `[img=${imageWidth},${imageHeight}]${imageUrl}[/img]` +
      sign.slice(selectionStart)
    setSign(newSign)
    setImageAnchorEl(null)
  }

  const handleLinkButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setLinkAnchorEl(event.currentTarget)
  }
  const handleLinkSubmit = () => {
    const newSign =
      sign.slice(0, selectionStart) +
      `[url=${linkUrl}]${linkText}[/url]` +
      sign.slice(selectionStart)
    setSign(newSign)
    setLinkAnchorEl(null)
  }
  const handleEmoticonButtonClick = () => {}
  return (
    <>
      <Stack direction="column" sx={{ width: '70%' }}>
        <Stack direction="row" spacing={-1}>
          <Tooltip title="文字加粗">
            <IconButton onClick={handleBoldButtonClick}>
              <FormatBold />
            </IconButton>
          </Tooltip>
          <Tooltip title="设置文字颜色">
            <IconButton onClick={handleColorButtonClick}>
              <ColorLens />
            </IconButton>
          </Tooltip>
          <Popover
            open={Boolean(colorAnchorEl)}
            anchorEl={colorAnchorEl}
            onClose={handleClose}
            style={{ width: '44%' }}
            disableScrollLock
          >
            <Box sx={{ m: 1 }}>
              <Grid container spacing={0.5} sx={{ minWidth: '150px' }}>
                {colors.map((color) => (
                  <Grid item xs={1.5} key={color[0]}>
                    <Box
                      key={color[0]}
                      style={{
                        backgroundColor: color[0],
                        width: '15px',
                        height: '15px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleColorSelect(color[0])}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Popover>
          <Tooltip title="图片">
            <IconButton onClick={handleImageButtonClick}>
              <InsertPhoto />
            </IconButton>
          </Tooltip>
          <Popover
            open={Boolean(imageAnchorEl)}
            anchorEl={imageAnchorEl}
            onClose={handleClose}
            disableScrollLock
          >
            <Box
              sx={{ mx: 3, my: 2 }}
              alignContent={'center'}
              justifyContent={'center'}
            >
              <Typography>请输入图片地址：</Typography>
              <TextField
                size="small"
                fullWidth
                onChange={(e) =>
                  setImageUrl((e.target as HTMLInputElement).value)
                }
              />
              <Stack direction={'row'} sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>宽（可选）：</Typography>
                  <TextField
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '30px',
                        width: '80px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '8px',
                      },
                      mr: 1,
                    }}
                    onChange={(e) =>
                      setImageWidth(
                        parseInt((e.target as HTMLInputElement).value)
                      )
                    }
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>高（可选）：</Typography>
                  <TextField
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '30px',
                        width: '80px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '8px',
                      },
                    }}
                    onChange={(e) =>
                      setImageHeight(
                        parseInt((e.target as HTMLInputElement).value)
                      )
                    }
                  />
                </Box>
              </Stack>
              <Button
                variant="contained"
                sx={{ mt: 1 }}
                onClick={handleImageUrlSubmit}
              >
                提交
              </Button>
            </Box>
          </Popover>
          <Tooltip title="添加链接">
            <IconButton onClick={handleLinkButtonClick}>
              <InsertLink />
            </IconButton>
          </Tooltip>
          <Popover
            open={Boolean(linkAnchorEl)}
            anchorEl={linkAnchorEl}
            onClose={handleClose}
            disableScrollLock
          >
            <Box sx={{ mx: 3, my: 2, width: '300px' }}>
              <Typography>请输入链接地址：</Typography>
              <TextField
                size="small"
                fullWidth
                sx={{ mt: 0.5, mb: 1 }}
                onChange={(e) =>
                  setLinkUrl((e.target as HTMLInputElement).value)
                }
              />
              <Typography>请输入链接文字：</Typography>
              <TextField
                size="small"
                fullWidth
                sx={{ mt: 0.5 }}
                onChange={(e) =>
                  setLinkText((e.target as HTMLInputElement).value)
                }
              />
              <Button
                variant="contained"
                sx={{ mt: 1 }}
                onClick={handleLinkSubmit}
              >
                提交
              </Button>
            </Box>
          </Popover>
          <Tooltip title="表情">
            <IconButton onClick={handleEmoticonButtonClick}>
              <InsertEmoticon />
            </IconButton>
          </Tooltip>
        </Stack>
        <StyledField
          multiline
          rows={5}
          value={sign}
          onChange={handleTextFieldChange}
          onSelect={handleTextFieldSelect}
        />
      </Stack>
    </>
  )
}
export default ProfileSign
