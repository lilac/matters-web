import { FC, useContext, useState } from 'react'

import {
  EmailChangeConfirmForm,
  EmailChangeRequestForm
} from '~/components/Form/EmailChangeForm'
import { Translate } from '~/components/Language'
import { Modal } from '~/components/Modal'
import ModalComplete from '~/components/Modal/Complete'
import { ViewerContext } from '~/components/Viewer'

/**
 * This component is a modal for changing email.
 *
 * Usage:
 *
 * ```jsx
 *   <EmailModal close={close} />
 * ```
 *
 */

type Step = 'request' | 'confirm' | 'complete'

const EmailModal: FC<ModalInstanceProps> = ({ close }) => {
  const viewer = useContext(ViewerContext)
  const [step, setStep] = useState<Step>('request')
  const [data, setData] = useState<{ [key: string]: any }>({
    request: {
      next: 'confirm',
      email: viewer.info.email
    },
    confirm: {
      next: 'complete'
    }
  })

  const requestCallback = (params: any) => {
    const { codeId } = params
    setData(prev => {
      return {
        ...prev,
        request: {
          ...prev.request,
          codeId
        }
      }
    })
    setStep('confirm')
  }

  const confirmCallback = () => setStep('complete')

  return (
    <>
      <Modal.Content>
        {step === 'request' && (
          <EmailChangeRequestForm
            defaultEmail={data.request.email}
            submitCallback={requestCallback}
          />
        )}
        {step === 'confirm' && (
          <EmailChangeConfirmForm
            oldData={data.request}
            submitCallback={confirmCallback}
          />
        )}
        {step === 'complete' && (
          <ModalComplete
            message={
              <Translate zh_hant="電子信箱修改成功" zh_hans="邮箱修改成功" />
            }
          />
        )}
      </Modal.Content>
    </>
  )
}

export default EmailModal