import gql from 'graphql-tag'

import { Icon } from '~/components'

import NoticeDate from './NoticeDate'
import styles from './styles.css'

import { OfficialAnnouncementNotice as NoticeType } from './__generated__/OfficialAnnouncementNotice'

const OfficialAnnouncementNotice = ({ notice }: { notice: NoticeType }) => {
  const Message = () => <p>{notice.message}</p>

  return (
    <section className="container">
      <section className="avatar-wrap">
        <Icon.Volume color="grey-dark" size="lg" />
      </section>

      <section className="content-wrap">
        {notice.link ? (
          <a href={notice.link}>
            <Message />
          </a>
        ) : (
          <Message />
        )}

        <NoticeDate notice={notice} />
      </section>

      <style jsx>{styles}</style>
    </section>
  )
}

OfficialAnnouncementNotice.fragments = {
  notice: gql`
    fragment OfficialAnnouncementNotice on OfficialAnnouncementNotice {
      id
      unread
      __typename
      ...NoticeDate
      link
      message
    }
    ${NoticeDate.fragments.notice}
  `
}

export default OfficialAnnouncementNotice
