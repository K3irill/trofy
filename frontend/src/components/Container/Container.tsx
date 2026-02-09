'use client'

import React, { FunctionComponent, PropsWithChildren } from 'react'
import { ContainerStyled } from './styled'

const Container: FunctionComponent<PropsWithChildren> = ({ children }) => {
	return <ContainerStyled>{children}</ContainerStyled>
}

export default Container
