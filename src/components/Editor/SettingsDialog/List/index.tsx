import { Dialog, Switch, Translate } from '~/components'

import { Step } from '../../SettingsDialog'
import ToggleAccess, { ToggleAccessProps } from '../../ToggleAccess'
import ListItem from './ListItem'
import styles from './styles.css'

export type SettingsListDialogButtons = {
  confirmButtonText?: string | React.ReactNode
  cancelButtonText?: string | React.ReactNode
  onConfirm?: () => any
}

export type SettingsListDialogProps = {
  saving: boolean
  disabled: boolean

  forward: (nextStep: Step) => void
  closeDialog: () => void

  cover?: string | null
  collectionCount: number
  tagsCount: number
} & SettingsListDialogButtons &
  ToggleAccessProps

const SettingsList = ({
  saving,
  disabled,

  forward,
  closeDialog,

  confirmButtonText,
  cancelButtonText,
  onConfirm,

  cover,
  collectionCount,
  tagsCount,

  ...restProps
}: SettingsListDialogProps) => {
  return (
    <>
      <Dialog.Header
        title={<Translate id="settings" />}
        closeDialog={closeDialog}
        closeTextId="close"
        mode="hidden"
      />

      <Dialog.Content hasGrow>
        <ul>
          <ListItem
            title={<Translate id="setCover" />}
            onClick={() => forward('cover')}
          >
            <ListItem.CoverIndicator cover={cover} />
          </ListItem>

          <ListItem
            title={<Translate id="addTags" />}
            subTitle={tagsCount === 0 && <Translate id="hintAddTag2" />}
            onClick={() => forward('tag')}
          >
            <ListItem.NumberIndicator num={tagsCount} withHintOverlay />
          </ListItem>

          <ListItem
            title={<Translate id="setCollection" />}
            onClick={() => forward('collection')}
          >
            <ListItem.NumberIndicator num={collectionCount} />
          </ListItem>

          <section className="access">
            <ToggleAccess {...restProps} />
          </section>

          <section className="publishISCN">
            <section className="switch">
              <header>
                <h3>
                  <Translate id="publishToISCN" />
                </h3>

                <Switch
                  checked={false}
                  onChange={() => {
                    console.log('toogle change')
                  }}
                  // loading={accessSaving}
                />
              </header>
            </section>
          </section>

          {(confirmButtonText || cancelButtonText) && (
            <Dialog.Footer>
              {confirmButtonText && (
                <Dialog.Footer.Button
                  bgColor="green"
                  onClick={onConfirm ? onConfirm : () => forward('confirm')}
                  loading={saving}
                  disabled={disabled}
                >
                  {confirmButtonText}
                </Dialog.Footer.Button>
              )}

              {cancelButtonText && (
                <Dialog.Footer.Button
                  bgColor="grey-lighter"
                  textColor="black"
                  onClick={closeDialog}
                  disabled={disabled}
                >
                  {cancelButtonText}
                </Dialog.Footer.Button>
              )}
            </Dialog.Footer>
          )}
        </ul>
      </Dialog.Content>

      <style jsx>{styles}</style>
    </>
  )
}

export default SettingsList
