import gql from 'graphql-tag'
import _get from 'lodash/get'
import { Query, QueryResult } from 'react-apollo'

import {
  Footer,
  InfiniteScroll,
  PageHeader,
  Spinner,
  Tag,
  Translate
} from '~/components'

import { mergeConnections } from '~/common/utils'
import { AllTags } from './__generated__/AllTags'
import styles from './styles.css'

const ALL_TAGS = gql`
  query AllTags($cursor: String) {
    viewer {
      id
      recommendation {
        tags(input: { first: 20, after: $cursor }) {
          pageInfo {
            startCursor
            endCursor
            hasNextPage
          }
          edges {
            cursor
            node {
              ...Tag
            }
          }
        }
      }
    }
  }
  ${Tag.fragments.tag}
`

const Tags = () => (
  <main className="l-row">
    <article className="l-col-4 l-col-md-5 l-col-lg-8">
      <PageHeader
        pageTitle={
          <Translate
            translations={{ zh_hant: '全部標籤', zh_hans: '全部标签' }}
          />
        }
      />

      <section>
        <Query query={ALL_TAGS}>
          {({
            data,
            loading,
            error,
            fetchMore
          }: QueryResult & { data: AllTags }) => {
            if (loading) {
              return <Spinner />
            }

            if (error) {
              return <span>{JSON.stringify(error)}</span> // TODO
            }

            const connectionPath = 'viewer.recommendation.tags'
            const { edges, pageInfo } = _get(data, connectionPath)
            const loadMore = () =>
              fetchMore({
                variables: {
                  cursor: pageInfo.endCursor
                },
                updateQuery: (previousResult, { fetchMoreResult }) =>
                  mergeConnections({
                    oldData: previousResult,
                    newData: fetchMoreResult,
                    path: connectionPath
                  })
              })
            const leftEdges = edges.filter((_: any, i: number) => i % 2 === 0)
            const rightEdges = edges.filter((_: any, i: number) => i % 2 === 1)

            return (
              <InfiniteScroll
                hasNextPage={pageInfo.hasNextPage}
                loadMore={loadMore}
                loading={loading}
                loader={<Spinner />}
              >
                <div className="l-row">
                  <ul className="l-col-2 l-col-sm-4 l-col-lg-6">
                    {leftEdges.map(
                      ({ node, cursor }: { node: any; cursor: any }) => (
                        <li key={cursor}>
                          <Tag tag={node} type="count-fixed" />
                        </li>
                      )
                    )}
                  </ul>
                  <ul className="l-col-2 l-col-sm-4 l-col-lg-6">
                    {rightEdges.map(
                      ({ node, cursor }: { node: any; cursor: any }) => (
                        <li key={cursor}>
                          <Tag tag={node} type="count-fixed" />
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </InfiniteScroll>
            )
          }}
        </Query>
      </section>
    </article>

    <aside className="l-col-4 l-col-md-3 l-col-lg-4">
      <Footer />
    </aside>

    <style jsx>{styles}</style>
  </main>
)

export default Tags
