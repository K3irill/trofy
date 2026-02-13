'use client'

import React from 'react'
import Select, { StylesConfig, GroupBase, Props } from 'react-select'
import { useTheme } from 'styled-components'

export interface ThemedSelectOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface ThemedSelectProps extends Omit<Props<ThemedSelectOption, false>, 'styles'> {}

const getThemedStyles = (theme: DefaultTheme): StylesConfig<ThemedSelectOption, false, GroupBase<ThemedSelectOption>> => ({
  control: (provided, state) => ({
    ...provided,
    minHeight: '44px',
    backgroundColor: `linear-gradient(145deg, ${theme.colors.dark[700]}e6 0%, ${theme.colors.dark[800]}f2 100%)`,
    background: `linear-gradient(145deg, ${theme.colors.dark[700]}e6 0%, ${theme.colors.dark[800]}f2 100%)`,
    border: `2px solid ${state.isFocused ? theme.colors.primary : `${theme.colors.dark[600]}80`}`,
    borderRadius: '12px',
    boxShadow: state.isFocused
      ? `${theme.shadows.glow.primary}, ${theme.shadows.glass.medium}`
      : theme.shadows.neomorph.dark,
    padding: '0.25rem 0.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      borderColor: `${theme.colors.primary}66`,
      background: `linear-gradient(145deg, ${theme.colors.dark[700]}f0 0%, ${theme.colors.dark[800]}f8 100%)`,
      boxShadow: `${theme.shadows.glass.light}, 0 0 15px ${theme.colors.primary}20`,
      transform: 'translateY(-2px)',
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: theme.colors.dark[800],
    borderRadius: '12px',
    border: `2px solid ${theme.colors.dark[600]}80`,
    boxShadow: theme.shadows.glass.medium,
    overflow: 'hidden',
    zIndex: 1000,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: '0.5rem',
    maxHeight: '300px',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? `${theme.colors.primary}1a`
      : state.isFocused
        ? `${theme.colors.primary}0d`
        : 'transparent',
    color: state.isSelected
      ? theme.colors.primary
      : state.isFocused
        ? theme.colors.light[100]
        : theme.colors.light[300],
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    fontWeight: state.isSelected ? 600 : 500,
    transition: 'all 0.2s ease',
    marginBottom: '0.25rem',
    '&:active': {
      backgroundColor: `${theme.colors.primary}33`,
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: `${theme.colors.light[300]}b3`,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: theme.colors.light[100],
  }),
  input: (provided) => ({
    ...provided,
    color: theme.colors.light[100],
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? theme.colors.primary : theme.colors.light[300],
    transition: 'all 0.3s ease',
    '&:hover': {
      color: theme.colors.primary,
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: theme.colors.light[300],
    '&:hover': {
      color: theme.colors.danger,
    },
  }),
})

export const ThemedSelect = (props: ThemedSelectProps) => {
  const theme = useTheme()
  return <Select styles={getThemedStyles(theme)} {...props} />
}
