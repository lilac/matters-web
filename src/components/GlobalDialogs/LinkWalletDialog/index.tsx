import {
  Dialog,
  // SignUpForm,
  Translate,
  useDialogSwitch,
  useEventListener,
  useStep,
  WalletSignUpForm,
} from '~/components'

import {
  ADD_TOAST,
  CLOSE_ACTIVE_DIALOG,
  OPEN_LINK_WALLET_DIALOG,
} from '~/common/enums'

type Step = 'init' | 'connect-wallet' | 'complete'

const BaseLinkWalletDialog = () => {
  const { currStep, forward } = useStep<Step>('connect-wallet')

  const {
    show,
    openDialog: baseOpenDialog,
    closeDialog,
  } = useDialogSwitch(true)
  const openDialog = () => {
    forward('connect-wallet')
    baseOpenDialog()
  }

  useEventListener(CLOSE_ACTIVE_DIALOG, closeDialog)
  useEventListener(OPEN_LINK_WALLET_DIALOG, openDialog)

  return (
    <Dialog size="sm" isOpen={show} onDismiss={closeDialog}>
      {currStep === 'connect-wallet' && (
        <WalletSignUpForm.ConnectWallet
          purpose="dialog"
          submitCallback={() => {
            forward('init')
          }}
          closeDialog={closeDialog}
        />
      )}
      {currStep === 'init' && (
        <WalletSignUpForm.Init
          purpose="dialog"
          submitCallback={(ethAddress: string) => {
            console.log('after init:', ethAddress)
            // forward('complete')
            // forward('verify-email')
            window.dispatchEvent(
              new CustomEvent(ADD_TOAST, {
                detail: {
                  color: 'green',
                  content: <Translate id="successLinkWallet" />,
                },
              })
            )
          }}
          closeDialog={closeDialog}
        />
      )}
      {/* currStep === 'complete' && <SignUpForm.Complete purpose="page" /> */}
      {/* <pre>{JSON.stringify({ account })}</pre> */}
    </Dialog>
  )
}

const LinkWalletDialog = () => {
  const Children = ({ openDialog }: { openDialog: () => void }) => {
    useEventListener(OPEN_LINK_WALLET_DIALOG, openDialog)
    return null
  }

  return (
    <Dialog.Lazy mounted={<BaseLinkWalletDialog />}>
      {({ openDialog }) => <Children openDialog={openDialog} />}
    </Dialog.Lazy>
  )
}

export default LinkWalletDialog
