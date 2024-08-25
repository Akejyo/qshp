import { useRef, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slider,
} from '@mui/material'

import { setAvatar } from '@/apis/settings'
import Avatar from '@/components/Avatar'
import { useAppState } from '@/states'

const ProfileAvatar = ({ isMobile }: { isMobile: boolean }) => {
  const { state } = useAppState()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [editor, setEditor] = useState<AvatarEditor | null>(null)
  const [scale, setScale] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [imageType, setImageType] = useState<string | null>(null)

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    openDialog()
    if (e.target.files) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)
      setAvatarUrl(url)
      setImageType(file.type)
    }
  }
  const handleScaleChange = (event: Event, newValue: number | number[]) => {
    setScale(newValue as number)
  }
  const setEditorRef = (editor: AvatarEditor) => {
    setEditor(editor)
  }
  const openDialog = () => {
    setIsDialogOpen(true)
  }
  const closeDialog = () => {
    setIsDialogOpen(false)
    setScale(1)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  const handleButtonClick = async () => {
    if (editor && imageType !== 'image/gif') {
      const sizes = [48, 120, 200]
      const blobsPromise = sizes.map((size) => {
        return new Promise((resolve) => {
          const canvas = editor.getImageScaledToCanvas()
          const targetCanvas = document.createElement('canvas')
          targetCanvas.width = size
          targetCanvas.height = size
          const targetCtx = targetCanvas.getContext('2d')
          if (targetCtx) {
            targetCtx.drawImage(canvas, 0, 0, size, size)
            const imageData = targetCtx.getImageData(0, 0, size, size)
            const isTransparent = Array.from(imageData.data).some(
              (value, index) => index % 4 === 3 && value < 255
            )
            targetCanvas.toBlob(
              (blob) => {
                resolve(blob)
              },
              isTransparent ? 'image/png' : 'image/jpeg'
            )
          }
        })
      })

      const blobs = await Promise.all(blobsPromise)
      const avatars: Blob[] = blobs.filter(
        (blob): blob is Blob => blob !== null
      )
      try {
        await setAvatar({ avatars: avatars })
      } catch (error) {
        console.error('Failed to save avatar:', error)
      }
      closeDialog()
    }

    //gif, scale and cropping rect
    if (editor && imageType === 'image/gif') {
      if (avatarUrl) {
        const gif = await fetch(avatarUrl).then((res) => res.blob())
        setAvatar({
          avatars: [gif],
          x0: editor.getCroppingRect().x,
          x1: editor.getCroppingRect().x + editor.getCroppingRect().width,
          y0: editor.getCroppingRect().y,
          y1: editor.getCroppingRect().y + editor.getCroppingRect().height,
        })
      }
      closeDialog()
    }
  }

  return (
    <>
      <Avatar
        uid={state.user.uid}
        size={isMobile ? 70 : 100}
        onClick={handleAvatarClick}
        style={{ cursor: 'pointer' }}
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/gif"
      />
      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle sx={{ my: -1 }}>编辑头像</DialogTitle>
        <DialogContent sx={{ px: 0 }}>
          <Box
            display="flex"
            alignContent="center"
            justifyContent="center"
            flexDirection="column"
          >
            {avatarUrl && (
              <AvatarEditor
                ref={setEditorRef}
                image={avatarUrl}
                width={isMobile ? 200 : 300}
                height={isMobile ? 200 : 300}
                border={isMobile ? 30 : 60}
                color={[0, 0, 0, 0.5]}
                scale={scale}
              />
            )}
            <Box display="flex" justifyContent="center" width="100%">
              <Slider
                value={scale}
                min={1}
                max={5}
                step={0.1}
                onChange={handleScaleChange}
                sx={{ my: 2, width: '80%' }}
              />
            </Box>
            <Button
              variant="contained"
              onClick={handleButtonClick}
              sx={{ mx: 5 }}
            >
              确定
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProfileAvatar
