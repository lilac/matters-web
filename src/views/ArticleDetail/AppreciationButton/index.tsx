import { useQuery } from '@apollo/react-hooks'
import classNames from 'classnames'
import gql from 'graphql-tag'
import { useContext, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { Tooltip, Translate, ViewerContext } from '~/components'
import { useMutation } from '~/components/GQL'
import CLIENT_PREFERENCE from '~/components/GQL/queries/clientPreference'

import { APPRECIATE_DEBOUNCE } from '~/common/enums'

import AppreciateButton from './AppreciateButton'
import CivicLikerButton from './CivicLikerButton'
import SetupLikerIdAppreciateButton from './SetupLikerIdAppreciateButton'
import styles from './styles.css'

import { ClientPreference } from '~/components/GQL/queries/__generated__/ClientPreference'
import { AppreciateArticle } from './__generated__/AppreciateArticle'
import { AppreciationButtonArticle } from './__generated__/AppreciationButtonArticle'

const fragments = {
  article: gql`
    fragment AppreciationButtonArticle on Article {
      id
      author {
        id
      }
      appreciationsReceivedTotal
      hasAppreciate
      appreciateLimit
      appreciateLeft
    }
  `
}

const APPRECIATE_ARTICLE = gql`
  mutation AppreciateArticle($id: ID!, $amount: Int!) {
    appreciateArticle(input: { id: $id, amount: $amount }) {
      id
      appreciationsReceivedTotal
      hasAppreciate
      appreciateLeft
    }
  }
`

const AppreciationButton = ({
  article,
  inFixedToolbar
}: {
  article: AppreciationButtonArticle
  inFixedToolbar?: boolean
}) => {
  const viewer = useContext(ViewerContext)
  const { data, client } = useQuery<ClientPreference>(CLIENT_PREFERENCE, {
    variables: { id: 'local' }
  })

  // bundle appreciations
  const [amount, setAmount] = useState(0)
  const [sendAppreciation] = useMutation<AppreciateArticle>(APPRECIATE_ARTICLE)
  const {
    appreciateLimit,
    appreciateLeft,
    appreciationsReceivedTotal
  } = article
  const limit = appreciateLimit
  const left = appreciateLeft - amount
  const total = article.appreciationsReceivedTotal + amount
  const appreciatedCount = limit - left
  const [debouncedSendAppreciation] = useDebouncedCallback(() => {
    setAmount(0)
    sendAppreciation({
      variables: { id: article.id, amount },
      optimisticResponse: {
        appreciateArticle: {
          id: article.id,
          appreciationsReceivedTotal: appreciationsReceivedTotal + amount,
          hasAppreciate: true,
          appreciateLeft: left,
          __typename: 'Article'
        }
      }
    })
  }, APPRECIATE_DEBOUNCE)
  const appreciate = () => {
    setAmount(amount + 1)
    debouncedSendAppreciation()
  }

  // UI
  const isReachLimit = left <= 0
  const isMe = article.author.id === viewer.id
  const readCivicLikerDialog =
    viewer.isCivicLiker || data?.clientPreference.readCivicLikerDialog
  const canAppreciate =
    (!isReachLimit && !isMe && !viewer.isInactive && viewer.liker.likerId) ||
    !viewer.isAuthed
  const containerClasses = classNames({
    container: true
  })

  /**
   * Setup Liker Id Button
   */
  if (viewer.shouldSetupLikerID) {
    return (
      <section className={containerClasses}>
        <SetupLikerIdAppreciateButton
          total={total}
          inFixedToolbar={inFixedToolbar}
        />

        <style jsx>{styles}</style>
      </section>
    )
  }

  /**
   * Appreciate Button
   */
  if (canAppreciate) {
    return (
      <section className={containerClasses}>
        <AppreciateButton
          onClick={() => appreciate()}
          count={
            viewer.isAuthed && appreciatedCount > 0
              ? appreciatedCount
              : undefined
          }
          total={total}
          inFixedToolbar={inFixedToolbar}
        />

        <style jsx>{styles}</style>
      </section>
    )
  }

  /**
   * Civic Liker Button
   */
  if (!canAppreciate && !readCivicLikerDialog && isReachLimit) {
    return (
      <section className={containerClasses}>
        <CivicLikerButton
          onClose={() => {
            client.writeData({
              id: 'ClientPreference:local',
              data: { readCivicLikerDialog: true }
            })
          }}
          count={
            viewer.isAuthed && appreciatedCount > 0
              ? appreciatedCount
              : undefined
          }
          total={total}
          inFixedToolbar={inFixedToolbar}
        />

        <style jsx>{styles}</style>
      </section>
    )
  }

  /**
   * MAX Button
   */
  if (!canAppreciate && isReachLimit) {
    return (
      <section className={containerClasses}>
        <AppreciateButton
          count="MAX"
          total={total}
          inFixedToolbar={inFixedToolbar}
        />

        <style jsx>{styles}</style>
      </section>
    )
  }

  /**
   * Disabled Button
   */
  return (
    <section className={containerClasses}>
      <Tooltip
        offset="-10, 0"
        content={
          <Translate
            {...(isMe
              ? {
                  zh_hant: '去讚賞其他用戶吧',
                  zh_hans: '去赞赏其他用户吧'
                }
              : {
                  zh_hant: '你還沒有讚賞權限',
                  zh_hans: '你还没有赞赏权限'
                })}
          />
        }
      >
        <div>
          <AppreciateButton
            disabled
            count={
              viewer.isAuthed && appreciatedCount > 0
                ? appreciatedCount
                : undefined
            }
            total={total}
            inFixedToolbar={inFixedToolbar}
          />
        </div>
      </Tooltip>

      <style jsx>{styles}</style>
    </section>
  )
}

AppreciationButton.fragments = fragments

export default AppreciationButton