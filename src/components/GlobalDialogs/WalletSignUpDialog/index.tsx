import {
  Dialog,
  ReCaptchaProvider,
  SignUpForm,
  useDialogSwitch,
  useEventListener,
  useStep,
  // VerificationLinkSent,
  WalletSignUpForm,
} from '~/components'

import { CLOSE_ACTIVE_DIALOG, OPEN_WALLET_SIGNUP_DIALOG } from '~/common/enums'

type Step = 'init' | 'connect-wallet' | 'verify-email' | 'complete'

const BaseSignUpDialog = () => {
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
  useEventListener(OPEN_WALLET_SIGNUP_DIALOG, openDialog)

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
        <ReCaptchaProvider>
          <WalletSignUpForm.Init
            purpose="dialog"
            submitCallback={(ethAddress: string) => {
              console.log('after init:', ethAddress)
              forward('connect-wallet')
              // forward('verify-email')
            }}
            closeDialog={closeDialog}
          />
        </ReCaptchaProvider>
      )}
      {currStep === 'verify-email' && (
        <WalletSignUpForm.Verify
          purpose="dialog"
          submitCallback={() => {
            forward('complete')
          }}
          closeDialog={closeDialog}
        />
      )}
      {currStep === 'complete' && <SignUpForm.Complete purpose="page" />}
      {/* <pre>{JSON.stringify({ account })}</pre> */}
    </Dialog>
  )
}

const WalletSignUpDialog = () => {
  const Children = ({ openDialog }: { openDialog: () => void }) => {
    useEventListener(OPEN_WALLET_SIGNUP_DIALOG, openDialog)
    return null
  }

  return (
    <Dialog.Lazy mounted={<BaseSignUpDialog />}>
      {({ openDialog }) => <Children openDialog={openDialog} />}
    </Dialog.Lazy>
  )
}

export default WalletSignUpDialog
