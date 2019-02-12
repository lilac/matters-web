import classNames from 'classnames'

import styles from './styles.css'

type TextIconSize = 'xs' | 'sm' | 'md' | 'lg'
type TextIconSpacing = '0' | 'xxxtight' | 'xxtight' | 'xtight'
type TextIconColor = 'black' | 'green' | 'gold' | 'grey' | 'grey-dark' | 'white'
type TextWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold'

interface TextIconProps {
  text: string
  icon: React.ReactNode

  color?: TextIconColor
  size?: TextIconSize
  spacing?: TextIconSpacing
  weight?: TextWeight

  [key: string]: any
}

/**
 * `<TextIcon>` component that combines text and `<Icon>` to render as left-right/top-bottom layout.
 *
 * Usage:
 *
 * ```jsx
 * <TextIcon text="134" icon={<Icon id={ICON_MAT_GOLD.id} viewBox={ICON_MAT_GOLD.viewBox} />} />
 * ```
 */

export const TextIcon: React.SFC<TextIconProps> = ({
  text,
  icon,

  color = 'black',
  size = 'sm',
  spacing = 'xxtight',
  weight,

  className
}) => {
  const textIconClasses = classNames({
    [color]: !!color,
    [`size-${size}`]: true,
    [spacing ? `spacing-${spacing}` : '']: !!spacing,
    [weight ? `weight-${weight}` : '']: !!weight,
    [className]: !!className
  })

  return (
    <span className={textIconClasses}>
      {icon}
      {text}
      <style jsx>{styles}</style>
    </span>
  )
}
