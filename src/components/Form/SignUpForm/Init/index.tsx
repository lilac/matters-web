import classNames from 'classnames'
import { withFormik } from 'formik'
import gql from 'graphql-tag'
import _isEmpty from 'lodash/isEmpty'
import Link from 'next/link'
import { FC, useContext } from 'react'

import { Form } from '~/components/Form'
import SendCodeButton from '~/components/Form/Button/SendCode'
import { getErrorCodes, Mutation } from '~/components/GQL'
import { CONFIRM_CODE } from '~/components/GQL/mutations/verificationCode'
import { LanguageContext, Translate } from '~/components/Language'
import { Modal } from '~/components/Modal'
import { ModalSwitch } from '~/components/ModalManager'

import { ANALYTICS_EVENTS, PATHS, TEXT } from '~/common/enums'
import {
  analytics,
  appendTarget,
  isValidEmail,
  isValidPassword,
  isValidUserName,
  translate
} from '~/common/utils'

import styles from './styles.css'

/**
 * This component is designed for sign up form with builtin mutation.
 *
 * Usage:
 *
 * ```jsx
 *   <SignUpInitForm
 *     defaultEmail={''}
 *     extraClass={[]}
 *     purpose="modal"
 *     submitCallback={()=> {}}
 *   />
 * ```
 *
 */
interface Props {
  defaultEmail?: string
  extraClass?: string[]
  purpose: 'modal' | 'page'
  submitCallback?: (params: any) => void
  scrollLock?: boolean
}

const USER_REGISTER = gql`
  mutation UserRegister($input: UserRegisterInput!) {
    userRegister(input: $input) {
      auth
    }
  }
`

const LoginModalSwitch = () => (
  <ModalSwitch modalId="loginModal">
    {(open: any) => (
      <Modal.FooterButton onClick={open} bgColor="white">
        <Translate zh_hant="已有帳號？" zh_hans="已有帐号？" />
      </Modal.FooterButton>
    )}
  </ModalSwitch>
)

const LoginRedirection = () => (
  <Modal.FooterButton
    is="link"
    {...appendTarget(PATHS.AUTH_LOGIN)}
    bgColor="white"
  >
    <Translate zh_hant="已有帳號？" zh_hans="已有帐号？" />
  </Modal.FooterButton>
)

export const SignUpInitForm: FC<Props> = ({
  defaultEmail = '',
  extraClass = [],
  purpose,
  submitCallback,
  scrollLock
}) => {
  const { lang } = useContext(LanguageContext)
  const isInModal = purpose === 'modal'
  const isInPage = purpose === 'page'

  const validateEmail = (value: string, language: string) => {
    let result: any
    if (!value) {
      result = {
        zh_hant: TEXT.zh_hant.required,
        zh_hans: TEXT.zh_hans.required
      }
    } else if (!isValidEmail(value)) {
      result = {
        zh_hant: TEXT.zh_hant.invalidEmail,
        zh_hans: TEXT.zh_hans.invalidEmail
      }
    }
    if (result) {
      return translate({ ...result, lang: language })
    }
  }

  const validateCode = (value: string, language: string) => {
    let result: any
    if (!value) {
      result = {
        zh_hant: TEXT.zh_hant.required,
        zh_hans: TEXT.zh_hans.required
      }
    }
    if (result) {
      return translate({ ...result, lang: language })
    }
  }

  const validateUserName = (value: string, language: string) => {
    let result: any
    if (!value) {
      result = {
        zh_hant: TEXT.zh_hant.required,
        zh_hans: TEXT.zh_hans.required
      }
    } else if (!isValidUserName(value)) {
      result = {
        zh_hant: TEXT.zh_hant.userNameHint,
        zh_hans: TEXT.zh_hans.userNameHint
      }
    }
    if (result) {
      return translate({ ...result, lang: language })
    }
  }

  const validatePassword = (value: string, language: string) => {
    let result: any
    if (!value) {
      result = {
        zh_hant: TEXT.zh_hant.required,
        zh_hans: TEXT.zh_hans.required
      }
    } else if (!isValidPassword(value)) {
      result = {
        zh_hant: TEXT.zh_hant.passwordHint,
        zh_hans: TEXT.zh_hans.passwordHint
      }
    }
    if (result) {
      return translate({ ...result, lang: language })
    }
  }

  const validateToS = (value: boolean, language: string) => {
    let result: any
    if (value === false) {
      result = { zh_hant: '請勾選', zh_hans: '请勾选' }
    }
    if (result) {
      return translate({ ...result, lang: language })
    }
  }

  const BaseForm = ({
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldError
  }: {
    [key: string]: any
  }) => {
    const formClass = classNames('form', ...extraClass)

    const emailPlaceholder = translate({
      zh_hant: TEXT.zh_hant.email,
      zh_hans: TEXT.zh_hans.email,
      lang
    })

    const codePlaceholder = translate({
      zh_hant: TEXT.zh_hant.verificationCode,
      zh_hans: TEXT.zh_hans.verificationCode,
      lang
    })

    const userNamePlaceholder = translate({
      zh_hant: 'Matters ID',
      zh_hans: 'Matters ID',
      lang
    })

    const passwordPlaceholder = translate({
      zh_hant: TEXT.zh_hant.password,
      zh_hans: TEXT.zh_hans.password,
      lang
    })

    const agreeText = translate({
      zh_hant: '我已閱讀並同意',
      zh_hans: '我已阅读并同意',
      lang
    })

    const tosText = translate({
      zh_hant: 'Matters 用戶協議和隱私政策',
      zh_hans: 'Matters 用户协议和隐私政策',
      lang
    })

    return (
      <>
        <form className={formClass} onSubmit={handleSubmit}>
          <Modal.Content scrollLock={scrollLock}>
            <Form.Input
              type="email"
              field="email"
              placeholder={emailPlaceholder}
              values={values}
              errors={errors}
              touched={touched}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
            <Form.Input
              type="text"
              field="code"
              autoComplete="off"
              placeholder={codePlaceholder}
              floatElement={
                <SendCodeButton
                  email={values.email}
                  lang={lang}
                  type="register"
                />
              }
              values={values}
              errors={errors}
              touched={touched}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
            <Form.Input
              type="text"
              field="userName"
              autoComplete="off"
              placeholder={userNamePlaceholder}
              values={values}
              errors={errors}
              touched={touched}
              handleBlur={handleBlur}
              handleChange={handleChange}
              hint={translate({
                zh_hant: TEXT.zh_hant.userNameHint,
                zh_hans: TEXT.zh_hans.userNameHint,
                lang
              })}
            />
            <Form.Input
              type="password"
              field="password"
              autoComplete="off"
              placeholder={passwordPlaceholder}
              values={values}
              errors={errors}
              touched={touched}
              handleBlur={handleBlur}
              handleChange={handleChange}
              hint={translate({
                zh_hant: TEXT.zh_hant.passwordHint,
                zh_hans: TEXT.zh_hans.passwordHint,
                lang
              })}
            />
            <div className="tos">
              <Form.CheckBox
                field="tos"
                values={values}
                errors={errors}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
              >
                <span>
                  {agreeText}
                  <Link {...PATHS.MISC_TOS}>
                    <a className="u-link-green" target="_blank">
                      {' '}
                      {tosText}
                    </a>
                  </Link>
                </span>
              </Form.CheckBox>
            </div>
          </Modal.Content>

          <div className="buttons">
            {isInModal && <LoginModalSwitch />}
            {isInPage && <LoginRedirection />}

            <Modal.FooterButton
              htmlType="submit"
              disabled={!_isEmpty(errors) || isSubmitting}
              loading={isSubmitting}
            >
              <Translate
                zh_hant={TEXT.zh_hant.nextStep}
                zh_hans={TEXT.zh_hans.nextStep}
              />
            </Modal.FooterButton>
          </div>
        </form>
        <style jsx>{styles}</style>
      </>
    )
  }

  const MainForm: any = withFormik({
    mapPropsToValues: () => ({
      email: defaultEmail,
      code: '',
      userName: '',
      password: '',
      tos: true
    }),

    validate: ({ email, code, userName, password, tos }) => {
      const isInvalidEmail = validateEmail(email, lang)
      const isInvalidCodeId = validateCode(code, lang)
      const isInvalidPassword = validatePassword(password, lang)
      const isInvalidUserName = validateUserName(userName, lang)
      const isInvalidToS = validateToS(tos, lang)
      const errors: { [key: string]: any } = {
        ...(isInvalidEmail ? { email: isInvalidEmail } : {}),
        ...(isInvalidCodeId ? { code: isInvalidCodeId } : {}),
        ...(isInvalidUserName ? { userName: isInvalidUserName } : {}),
        ...(isInvalidPassword ? { password: isInvalidPassword } : {}),
        ...(isInvalidToS ? { tos: isInvalidToS } : {})
      }
      return errors
    },

    handleSubmit: async (
      values,
      { props, setFieldError, setSubmitting }: any
    ) => {
      const { email, code, userName, password } = values
      const { preSubmitAction, submitAction } = props
      if (!preSubmitAction || !submitAction) {
        return
      }

      try {
        const {
          data: { confirmVerificationCode: codeId }
        } = await preSubmitAction({
          variables: { input: { email, code, type: 'register' } }
        })

        await submitAction({
          variables: {
            input: { email, codeId, userName, displayName: userName, password }
          }
        })

        if (submitCallback) {
          submitCallback({ email, codeId, password })
        }
      } catch (error) {
        const errorCode = getErrorCodes(error)[0]
        const errorMessage = translate({
          zh_hant: TEXT.zh_hant.error[errorCode] || errorCode,
          zh_hans: TEXT.zh_hans.error[errorCode] || errorCode,
          lang
        })
        setFieldError('code', errorMessage)
      }

      setSubmitting(false)
      analytics.identifyUser()
      analytics.trackEvent(ANALYTICS_EVENTS.SIGNUP_SUCCESS)
    }
  })(BaseForm)

  return (
    <Mutation mutation={CONFIRM_CODE}>
      {confirm => (
        <Mutation mutation={USER_REGISTER}>
          {register => (
            <MainForm preSubmitAction={confirm} submitAction={register} />
          )}
        </Mutation>
      )}
    </Mutation>
  )
}