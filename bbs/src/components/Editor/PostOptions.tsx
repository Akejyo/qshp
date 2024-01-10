import { RefObject, useState } from 'react'

import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material'

import { ForumDetails } from '@/common/interfaces/response'

import { PostEditorValue } from './types'

const PostOptions = ({
  forum,
  initialValue,
  valueRef,
  onChanged,
}: {
  forum?: ForumDetails
  initialValue?: PostEditorValue
  valueRef?: RefObject<PostEditorValue>
  onChanged?: () => void
}) => {
  const [anonymous, setAnonymous] = useState(
    initialValue?.is_anonymous || false
  )
  return (
    <Box>
      {forum?.can_post_anonymously && (
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={anonymous}
                onChange={(e) => {
                  const checked = e.target.checked
                  setAnonymous(checked)
                  valueRef?.current && (valueRef.current.is_anonymous = checked)
                  onChanged && onChanged()
                }}
              />
            }
            label="匿名发帖"
          />
        </FormGroup>
      )}
    </Box>
  )
}

export default PostOptions