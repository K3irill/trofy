'use client'

import React from 'react'
import Select, { StylesConfig, GroupBase, Props } from 'react-select'
import { useTheme } from 'styled-components'

export interface ThemedSelectOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface ThemedSelectProps extends Omit<Props<ThemedSelectOption, boolean>, 'styles'> {
  compact?: boolean
}

const getThemedStyles = (theme: DefaultTheme, compact?: boolean): StylesConfig<ThemedSelectOption, boolean, GroupBase<ThemedSelectOption>> => ({
  control: (provided, state) => ({
    ...provided,
    minHeight: compact ? '32px' : '44px',
    backgroundColor: compact
      ? `linear-gradient(145deg, ${theme.colors.dark[700]}e6 0%, ${theme.colors.dark[800]}f2 100%)`
      : theme.colors.dark.neomorphDark,
    background: compact
      ? `linear-gradient(145deg, ${theme.colors.dark[700]}e6 0%, ${theme.colors.dark[800]}f2 100%)`
      : theme.colors.dark.neomorphDark,
    border: `2px solid ${state.isFocused ? theme.colors.primary + '80' : theme.colors.dark[600] + '80'}`,
    borderRadius: '10px',
    boxShadow: state.isFocused
      ? `0 0 0 3px ${theme.colors.primary}1a`
      : 'none',
    padding: compact ? '0.375rem 0.375rem 0.375rem 0.5rem' : '0.625rem 0.625rem 0.625rem 0.875rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: state.isFocused ? theme.colors.primary + '80' : theme.colors.dark[600] + '80',
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: theme.colors.dark[800],
    borderRadius: '12px',
    border: `2px solid ${theme.colors.dark[600]}`,
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
      ? `${theme.colors.primary}33`
      : state.isFocused
        ? `${theme.colors.primary}1a`
        : 'transparent',
    color: state.isSelected
      ? theme.colors.primary
      : state.isFocused
        ? theme.colors.light[100]
        : theme.colors.light[300],
    borderRadius: '8px',
    padding: compact ? '0.5rem 0.75rem' : '0.75rem 1rem',
    cursor: 'pointer',
    fontWeight: state.isSelected ? 600 : 500,
    fontSize: compact ? '0.8125rem' : '0.9375rem',
    transition: 'all 0.2s ease',
    marginBottom: '0.25rem',
    '&:active': {
      backgroundColor: `${theme.colors.primary}4d`,
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: theme.colors.light[300],
    fontSize: compact ? '0.8125rem' : '1rem',
    fontWeight: 500,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: theme.colors.light[100],
    fontSize: compact ? '0.8125rem' : '1rem',
    fontWeight: 500,
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: `${theme.colors.primary}33`,
    borderRadius: '8px',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: theme.colors.primary,
    fontWeight: 500,
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: theme.colors.primary,
    borderRadius: '0 8px 8px 0',
    '&:hover': {
      backgroundColor: `${theme.colors.danger}33`,
      color: theme.colors.danger,
    },
  }),
  input: (provided) => ({
    ...provided,
    color: theme.colors.light[100],
    fontSize: compact ? '0.8125rem' : '1rem',
    fontWeight: 500,
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? theme.colors.primary : theme.colors.light[300],
    transition: 'all 0.3s ease',
    padding: compact ? '0.25rem' : '0.5rem',
    '&:hover': {
      color: theme.colors.primary,
    },
    svg: {
      width: compact ? '14px' : '20px',
      height: compact ? '14px' : '20px',
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: theme.colors.light[300],
    padding: compact ? '0.25rem' : '0.5rem',
    '&:hover': {
      color: theme.colors.danger,
    },
    svg: {
      width: compact ? '14px' : '20px',
      height: compact ? '14px' : '20px',
    },
  }),
})

export const ThemedSelect = ({ compact, ...props }: ThemedSelectProps) => {
  const theme = useTheme()
  return <Select styles={getThemedStyles(theme, compact)} {...props} />
}
