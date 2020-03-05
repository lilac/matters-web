import classNames from 'classnames'
import gql from 'graphql-tag'
import Link from 'next/link'
import React, { useContext } from 'react'

import {
  LoginButton,
  SearchBar,
  SignUpButton,
  useResponsive
} from '~/components'

import { PATHS, SIGNUP_TYPE } from '~/common/enums'

import { Translate } from '../Language'
import { ViewerContext } from '../Viewer'
import { HeaderContext } from './Context'
import Hint from './Hint'
import Logo from './Logo'
import MeDigest from './MeDigest'
import Nav from './Nav'
import NotificationButton from './NotificationButton'
import PublishButton from './PublishButton'
import SearchButton from './SearchButton'
import styles from './styles.css'

import { GlobalHeaderUser } from './__generated__/GlobalHeaderUser'

export const GlobalHeader = ({ user }: { user: GlobalHeaderUser }) => {
  const viewer = useContext(ViewerContext)
  const { headerState } = useContext(HeaderContext)
  const isLargeUp = useResponsive('lg-up')
  const { type: headerType } = headerState
  const isDraft = headerType === 'draft'
  const isLogin = headerType === 'login'
  const isSignUp = headerType === 'signUp'
  const isAbout = headerType === 'about'

  const headerClass = classNames({
    transparent:
      isAbout &&
      'bgColor' in headerState &&
      headerState.bgColor === 'transparent'
  })
  const rightClass = classNames({
    right: true,
    me: viewer.isAuthed
  })

  return (
    <header className={headerClass}>
      <div className="l-row">
        <div className="container">
          <section className="left">
            <Logo />
            {!isAbout && isDraft && <Hint />}
            {!isAbout && !isDraft && <Nav />}
          </section>

          <section className={rightClass}>
            {!isAbout && viewer.isAuthed && user && (
              <>
                {isLargeUp ? <SearchBar /> : <SearchButton />}
                <NotificationButton />
                <MeDigest user={user} />
                {isDraft && !viewer.isInactive && (
                  <PublishButton allowed={!viewer.shouldSetupLikerID} />
                )}
              </>
            )}

            {!isAbout && (!viewer.isAuthed || !user) && !isLogin && !isSignUp && (
              <>
                {!isLogin && <LoginButton />}
                {!isSignUp && (
                  <SignUpButton trackType={SIGNUP_TYPE.GENERAL}>
                    <Translate id="register" />
                  </SignUpButton>
                )}
              </>
            )}

            {isAbout && (
              <Link {...PATHS.HOME}>
                <a className="u-link-green">
                  <Translate id="backToDiscover" />
                </a>
              </Link>
            )}
          </section>
        </div>
      </div>

      <style jsx>{styles}</style>
    </header>
  )
}

GlobalHeader.fragments = {
  user: gql`
    fragment GlobalHeaderUser on User {
      id
      ...MeDigestUser
    }
    ${MeDigest.fragments.user}
  `
}
