import { useQuery } from '@apollo/react-hooks'
import { useContext } from 'react'

import {
  Card,
  EmptyTopic,
  Head,
  IconAdd16,
  InfiniteScroll,
  LanguageContext,
  Layout,
  List,
  Spinner,
  useRoute,
} from '~/components'

import { mergeConnections, toPath, translate } from '~/common/utils'

import { USER_TOPICS } from './gql'
import PutTopicDialog from './PutTopicDialog'
import styles from './styles.css'
import TitleItem from './TitleItem'

import { UserTopics } from './__generated__/UserTopics'

const BaseEditTopics = () => {
  const { getQuery } = useRoute()
  const userName = getQuery('name')

  const { data, loading, fetchMore } = useQuery<
    UserTopics,
    { first: number; after?: number }
  >(USER_TOPICS, {
    fetchPolicy: 'network-only',
  })

  const connectionPath = 'viewer.topics'
  const { edges, pageInfo } = data?.viewer?.topics || {}

  if (loading) {
    return <Spinner />
  }

  if (!edges || edges.length <= 0 || !pageInfo) {
    return <EmptyTopic />
  }

  const loadMore = () =>
    fetchMore({
      variables: { first: 20, after: pageInfo.endCursor },
      updateQuery: (previousResult, { fetchMoreResult }) =>
        mergeConnections({
          oldData: previousResult,
          newData: fetchMoreResult,
          path: connectionPath,
        }),
    })

  return (
    <>
      <InfiniteScroll hasNextPage={pageInfo.hasNextPage} loadMore={loadMore}>
        <List>
          {edges.map(({ node, cursor }) => (
            <List.Item key={cursor}>
              <Card
                {...toPath({
                  page: 'userEditTopicsTopic',
                  userName,
                  topicId: node.id,
                })}
                spacing={['base', 'base']}
                bgColor="white"
              >
                <section className="topic-card">
                  <section className="topic">
                    <TitleItem title={node.title} is="h3" />
                  </section>

                  {node.chapters?.map((chapter) => (
                    <section className="chapter" key={chapter.id}>
                      <TitleItem title={chapter.title} is="h4" />
                    </section>
                  ))}
                </section>
              </Card>
            </List.Item>
          ))}
        </List>

        <style jsx>{styles}</style>
      </InfiniteScroll>
    </>
  )
}

const EditTopics = () => {
  const { lang } = useContext(LanguageContext)

  return (
    <Layout.Main bgColor="grey-lighter">
      <Layout.Header
        left={<Layout.Header.BackButton />}
        right={
          <>
            <Layout.Header.Title id="editTopics" />

            <PutTopicDialog>
              {({ openDialog: openPutTopicDialog }) => (
                <button
                  onClick={openPutTopicDialog}
                  type="button"
                  aria-label={translate({
                    zh_hant: '新增主題',
                    zh_hans: '新增主题',
                    en: 'Add Topic',
                    lang,
                  })}
                >
                  <IconAdd16 size="md-s" />
                </button>
              )}
            </PutTopicDialog>
          </>
        }
      />

      <Head title={{ id: 'editTopics' }} />

      <BaseEditTopics />
    </Layout.Main>
  )
}

export default EditTopics
