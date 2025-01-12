import dynamic from 'next/dynamic'

import {
  Dialog,
  ReCaptchaProvider,
  Spinner,
  useDialogSwitch,
  useEventListener,
  useStep,
  VerificationLinkSent,
} from '~/components'

import { CLOSE_ACTIVE_DIALOG, OPEN_UNIVERSAL_AUTH_DIALOG } from '~/common/enums'

import { AuthResultType } from '@/__generated__/globalTypes'

const DynamicSelectAuthMethodForm = dynamic<any>(
  () =>
    import('~/components/Forms/SelectAuthMethodForm').then(
      (mod) => mod.SelectAuthMethodForm
    ),
  { ssr: false, loading: Spinner }
)
const DynamicChangePasswordFormRequest = dynamic(
  () => import('~/components/Forms/ChangePasswordForm/Request'),
  { ssr: false, loading: Spinner }
)
const DynamicEmailLoginForm = dynamic<any>(
  () =>
    import('~/components/Forms/EmailLoginForm').then(
      (mod) => mod.EmailLoginForm
    ),
  { ssr: false, loading: Spinner }
)
const DynamicEmailSignUpFormInit = dynamic(
  () => import('~/components/Forms/EmailSignUpForm/Init'),
  { ssr: false, loading: Spinner }
)
const DynamicWalletAuthFormSelect = dynamic(
  () => import('~/components/Forms/WalletAuthForm/Select'),
  { ssr: false, loading: Spinner }
)
const DynamicWalletAuthFormConnect = dynamic(
  () => import('~/components/Forms/WalletAuthForm/Connect'),
  { ssr: false, loading: Spinner }
)
const DynamicEmailSignUpFormComplete = dynamic(
  () => import('~/components/Forms/EmailSignUpForm/Complete'),
  { ssr: false, loading: Spinner }
)

type Step =
  | 'select-login-method'
  // wallet
  | 'wallet-select'
  | 'wallet-connect'
  // email
  | 'email-login'
  | 'email-sign-up-init'
  | 'email-verification-sent'
  | 'reset-password-request'
  // misc
  | 'complete'

const BaseUniversalAuthDialog = () => {
  const { currStep, forward } = useStep<Step>('select-login-method')

  const {
    show,
    openDialog: baseOpenDialog,
    closeDialog,
  } = useDialogSwitch(true)
  const openDialog = () => {
    forward('select-login-method')
    baseOpenDialog()
  }

  useEventListener(CLOSE_ACTIVE_DIALOG, closeDialog)
  useEventListener(OPEN_UNIVERSAL_AUTH_DIALOG, openDialog)

  return (
    <Dialog size="sm" isOpen={show} onDismiss={closeDialog}>
      {currStep === 'select-login-method' && (
        <DynamicSelectAuthMethodForm
          purpose="dialog"
          gotoWalletAuth={() => forward('wallet-select')}
          gotoEmailLogin={() => forward('email-login')}
          closeDialog={closeDialog}
        />
      )}

      {/* Wallet */}
      {currStep === 'wallet-select' && (
        <DynamicWalletAuthFormSelect
          purpose="dialog"
          submitCallback={() => {
            forward('wallet-connect')
          }}
          closeDialog={closeDialog}
          back={() => forward('select-login-method')}
        />
      )}
      {currStep === 'wallet-connect' && (
        <ReCaptchaProvider>
          <DynamicWalletAuthFormConnect
            purpose="dialog"
            submitCallback={(type?: AuthResultType) => {
              if (type === AuthResultType.Signup) {
                forward('complete')
              }
            }}
            closeDialog={closeDialog}
            back={() => forward('wallet-select')}
          />
        </ReCaptchaProvider>
      )}

      {/* Email */}
      {currStep === 'email-login' && (
        <DynamicEmailLoginForm
          purpose="dialog"
          closeDialog={closeDialog}
          gotoEmailSignUp={() => forward('email-sign-up-init')}
          gotoResetPassword={() => forward('reset-password-request')}
          back={() => forward('select-login-method')}
        />
      )}
      {currStep === 'email-sign-up-init' && (
        <ReCaptchaProvider>
          <DynamicEmailSignUpFormInit
            purpose="dialog"
            submitCallback={() => forward('email-verification-sent')}
            gotoEmailLogin={() => forward('email-login')}
            closeDialog={closeDialog}
            back={() => forward('email-login')}
          />
        </ReCaptchaProvider>
      )}
      {currStep === 'email-verification-sent' && (
        <VerificationLinkSent type="changePassword" purpose="dialog" />
      )}
      {currStep === 'reset-password-request' && (
        <DynamicChangePasswordFormRequest
          type="forget"
          purpose="dialog"
          submitCallback={() => forward('email-verification-sent')}
          closeDialog={closeDialog}
          back={() => forward('email-login')}
        />
      )}

      {/* Misc */}
      {currStep === 'complete' && (
        <DynamicEmailSignUpFormComplete purpose="dialog" />
      )}
    </Dialog>
  )
}

const UniversalAuthDialog = () => {
  const Children = ({ openDialog }: { openDialog: () => void }) => {
    useEventListener(OPEN_UNIVERSAL_AUTH_DIALOG, openDialog)
    return null
  }

  return (
    <Dialog.Lazy mounted={<BaseUniversalAuthDialog />}>
      {({ openDialog }) => <Children openDialog={openDialog} />}
    </Dialog.Lazy>
  )
}

export default UniversalAuthDialog
