/**
 * test suite!
 * id, role
 * text could be non-text
 * activeDescendantAttribute
 * deepmerge sx
 * nicer name for showDivider?
 * aria-label
 * aria-describedby
 * React.FC<Props> doesn't allow id?
 * truncate description
 * icon color
 * disabled checkbox
 * check height with divider
 *
 * use immediate child slot API instead of double render?
 * change as= li | div based on context of menu or not?
 * check if everyone accepts sx prop
 * link example outside of overlay? (details)
 * if one item has selected, should we give all of them selected without the need to pass prop?
 * move custom item themes to primitives?
 * padding: 8 or 6?
 * ActionList.Selection or ActionList.Item selected?
 * different size for icon and avatar, range?
 * minimize number of divs?
 * can use layoutEffect on server?
 */

import React from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'
import {useColorSchemeVar, useTheme} from '../ThemeProvider'
import Box from '../Box'
import {get} from '../constants'
import {SxProp} from '../sx'
import {useForceUpdate} from '../utils/use-force-update'
import {ListContext} from './List'
import {customItemThemes} from './hacks'
import {Selection} from './Selection'

export const getVariantStyles = (variant: ItemProps['variant'], disabled: ItemProps['disabled']) => {
  if (disabled) {
    return {
      color: get('colors.fg.muted'),
      iconColor: get('colors.fg.muted'),
      annotationColor: get('colors.fg.muted')
    }
  }

  switch (variant) {
    case 'danger':
      return {
        color: 'danger.fg',
        iconColor: 'danger.fg',
        annotationColor: 'fg.muted'
      }
    default:
      return {
        color: 'fg.default',
        iconColor: 'fg.muted',
        annotationColor: 'fg.muted'
      }
  }
}

export type ItemProps = {
  children: React.ReactNode
  onAction?: (event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => void
  selected?: boolean
  variant?: 'default' | 'danger'
  disabled?: boolean
  showDivider?: boolean
} & SxProp

type SlotNames = 'LeadingVisual' | 'InlineDescription' | 'BlockDescription' | 'TrailingVisual'
type ContextProps = {
  registerSlot: (name: SlotNames, contents: JSX.Element) => void
  unregisterSlot: (name: SlotNames) => void
}
export const ItemContext = React.createContext<ContextProps>({registerSlot: () => null, unregisterSlot: () => null})

export const Item = React.forwardRef<HTMLLIElement, ItemProps>(
  (
    {
      variant = 'default',
      disabled = false,
      selected = undefined,
      showDivider = false,
      onAction = () => null,
      sx = {},
      ...props
    },
    forwardedRef
  ): JSX.Element => {
    const customItemTheme = customItemThemes[variant]
    const {variant: listVariant} = React.useContext(ListContext)

    const {theme} = useTheme()

    // Double render strategy
    // when the effect is run for the first time,
    // all the children have mounted = registed themself in slot.
    // we re-render the Item component to re-render with filled slots.
    const rerenderWithSlots = useForceUpdate()
    const [isMounted, setIsMounted] = React.useState(false)

    // fires after all the layoutEffect in children
    React.useLayoutEffect(() => {
      setIsMounted(true)
      rerenderWithSlots()
    }, [rerenderWithSlots])

    const slotsRef = React.useRef<
      {
        [key in SlotNames]: JSX.Element | null
      }
    >({
      LeadingVisual: null,
      InlineDescription: null,
      BlockDescription: null,
      TrailingVisual: null
    })
    const slots = slotsRef.current

    const registerSlot = React.useCallback(
      (name: keyof typeof slots, contents: JSX.Element) => {
        slotsRef.current[name] = contents

        // don't render until the component mounts = all slots are registered
        if (isMounted) rerenderWithSlots()
      },
      [isMounted, rerenderWithSlots]
    )

    // Item.* can be removed from the DOM,
    // we need to unregister them from the slot
    const unregisterSlot = React.useCallback(
      (name: keyof typeof slots) => {
        slotsRef.current[name] = null
        rerenderWithSlots()
      },
      [rerenderWithSlots]
    )

    const styles = {
      display: 'flex',
      paddingX: get('space.2'),
      paddingY: '6px',
      marginX: listVariant === 'inset' ? get('space.2') : 0,
      minHeight: get('space.5'),
      borderRadius: get('radii.2'),
      transition: 'background 33.333ms linear',
      color: getVariantStyles(variant, disabled).color,
      textDecoration: 'none', // for as="a"

      ':not(disabled)': {cursor: 'pointer'},
      '@media (hover: hover) and (pointer: fine)': {
        ':hover': {
          backgroundColor: useColorSchemeVar(customItemTheme.hover, 'inherit')
        },
        ':focus': {
          backgroundColor: useColorSchemeVar(customItemTheme.focus, 'inherit')
        }
      },

      /** Divider styles */
      '[data-component="ActionList.Item--Main"]': {
        position: 'relative'
      },
      '[data-component="ActionList.Item--Main"]::before': {
        content: '" "',
        display: 'block',
        position: 'absolute',
        width: '100%',
        top: '-7px',
        border: '0 solid',
        borderTopWidth: showDivider ? `1px` : '0',
        borderColor: 'var(--divider-color, transparent)'
      },
      // show between 2 items
      ':not(:first-of-type)': {'--divider-color': theme?.colors.border.muted},
      // hide divider after dividers & group header
      '[data-component="ActionList.Divider"] + &': {'--divider-color': 'transparent'},
      // hide border on current and previous item
      '&:hover, &:focus': {'--divider-color': 'transparent'},
      '&:hover + &, &:focus + &': {'--divider-color': 'transparent'},

      ...sx
    }

    const clickHandler = React.useCallback(
      event => {
        if (disabled) return
        if (!event.defaultPrevented) onAction(event)
      },
      [onAction, disabled]
    )

    return (
      <Box as="li" sx={styles} data-component="ActionList.Item" onClick={clickHandler} ref={forwardedRef} {...props}>
        <ItemContext.Provider value={{registerSlot, unregisterSlot}}>
          <Selection selected={selected} disabled={disabled} />
          {slots.LeadingVisual}
          <Box
            data-component="ActionList.Item--Main"
            sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0}}
          >
            <Box sx={{display: 'flex'}}>
              <Box sx={{display: 'flex', flexGrow: 1, alignItems: 'baseline', minWidth: 0}}>
                <span>{props.children}</span>
                {slots.InlineDescription}
              </Box>
              {slots.TrailingVisual}
            </Box>
            {slots.BlockDescription}
          </Box>
        </ItemContext.Provider>
      </Box>
    )
  }
) as PolymorphicForwardRefComponent<'li', ItemProps>

Item.displayName = 'ActionList.Item'