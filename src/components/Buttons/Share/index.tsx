import { Button, Icon, IconColor, IconSize, ShareDialog } from '~/components'

import { ANALYTICS_EVENTS, SHARE_TYPE } from '~/common/enums'
import { analytics, isMobile } from '~/common/utils'

interface ShareButtonProps {
  title?: string
  path?: string

  size?: Extract<IconSize, 'md-s'>
  color?: Extract<IconColor, 'grey' | 'black'>
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  path,

  size,
  color = 'black'
}) => {
  const shareLink = process.browser
    ? path
      ? `${window.location.origin}/${path}`
      : window.location.href
    : ''
  const shareTitle = process.browser ? title || window.document.title : ''

  return (
    <ShareDialog title={shareTitle} link={shareLink}>
      {({ open }) => (
        <Button
          spacing={['xtight', 'xtight']}
          bgHoverColor="grey-lighter"
          aria-label={`分享《${title || ''}》`}
          onClick={async () => {
            open()

            const navigator = window.navigator as any
            if (navigator.share && isMobile()) {
              try {
                await navigator.share({
                  title: shareTitle,
                  url: shareLink
                })
              } catch (e) {
                console.error(e)
              }
            } else {
              open()
            }

            analytics.trackEvent(ANALYTICS_EVENTS, {
              type: SHARE_TYPE.ROOT,
              url: shareLink
            })
          }}
        >
          <Icon.Share size={size} color={color} />
        </Button>
      )}
    </ShareDialog>
  )
}