import { FC, useState } from 'react'

import { Button } from '~/components/Button'
import { UserNameChangeConfirmForm } from '~/components/Form/UserNameChangeForm'
import { Translate } from '~/components/Language'
import { Modal } from '~/components/Modal'
import ModalComplete from '~/components/Modal/Complete'

import styles from './styles.css'

/**
 * This component is a modal for changing user name.
 *
 * Usage:
 *
 * ```jsx
 *   <UserNameModal close={close} />
 * ```
 *
 */

type Step = 'ask' | 'confirm' | 'complete'

const UserNameModal: FC<ModalInstanceProps> = ({ close }) => {
  const [step, setStep] = useState<Step>('ask')

  const askCallback = (event: any) => {
    event.stopPropagation()
    setStep('confirm')
  }

  const confirmCallback = () => setStep('complete')

  return (
    <>
      {step === 'ask' && (
        <>
          <Modal.Content>
            <Translate
              zh_hant="您的 Matters ID 僅能永久修改一次，確定要繼續嗎？"
              zh_hans="您的 Matters ID 仅能永久修改一次，确定要继续吗？"
            />
          </Modal.Content>
          <div className="ask-buttons">
            <Button
              type="button"
              bgColor="transparent"
              size="xlarge"
              onClick={close}
            >
              <Translate zh_hant="取消" zh_hans="取消" />
            </Button>
            <Button
              type="button"
              bgColor="transparent"
              className="u-link-green"
              size="xlarge"
              onClick={askCallback}
            >
              <Translate zh_hant="確定" zh_hans="确定" />
            </Button>
          </div>
        </>
      )}
      {step !== 'ask' && (
        <Modal.Content>
          {step === 'confirm' && (
            <UserNameChangeConfirmForm submitCallback={confirmCallback} />
          )}
          {step === 'complete' && (
            <ModalComplete
              message={
                <Translate
                  zh_hant="Matters ID 修改成功"
                  zh_hans="Matters ID 修改成功"
                />
              }
            />
          )}
        </Modal.Content>
      )}
      <style jsx>{styles}</style>
    </>
  )
}

export default UserNameModal