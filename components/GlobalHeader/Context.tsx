import _get from 'lodash/get'
import { createContext, useContext, useState } from 'react'

import { ViewerContext } from '~/components/Viewer'

export interface DefaultHeader {
  type: 'default'
}

export interface LoginHeader {
  type: 'login'
}

export interface DraftHeader {
  type: 'draft'
  saved: boolean
}

type HeaderStateInput = DefaultHeader | LoginHeader | DraftHeader

type HeaderState = HeaderStateInput & {
  isAuthed: boolean
}

export const HeaderContext = createContext({} as {
  headerState: HeaderState
  setHeaderState: (state: HeaderStateInput) => void
})

export const HeaderContextConsumer = HeaderContext.Consumer

export const HeaderContextProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const viewer = useContext(ViewerContext)

  const isAuthed = !!viewer.id

  const [headerState, setHeaderState] = useState<HeaderState>({
    type: 'default',
    isAuthed
  })

  return (
    <HeaderContext.Provider
      value={{
        headerState,
        setHeaderState: (state: HeaderStateInput) =>
          setHeaderState({ ...state, isAuthed })
      }}
    >
      {children}
    </HeaderContext.Provider>
  )
}
