import styled from 'styled-components'

export const PageContainer = styled.div`
	padding: 2rem;
	max-width: 1400px;
	margin: 0 auto;
	width: 100%;
	box-sizing: border-box;

	@media (max-width: 1024px) {
		padding: 1.5rem;
	}

	@media (max-width: 640px) {
		padding: 1rem;
	}
`

export const PageHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
	gap: 1rem;

	@media (max-width: 1024px) {
		margin-bottom: 1.5rem;
	}

	@media (max-width: 640px) {
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}
`

export const Title = styled.h1`
	font-size: 2rem;
	font-weight: 700;
	color: ${props => props.theme.colors.light[100]};
	margin: 0;

	@media (max-width: 1024px) {
		font-size: 1.75rem;
	}

	@media (max-width: 640px) {
		font-size: 1.5rem;
	}
`

export const CreateButton = styled.button`
	padding: 0.75rem 1.5rem;
	background: linear-gradient(
		135deg,
		${props => props.theme.colors.primary} 0%,
		${props => props.theme.colors.secondary} 100%
	);
	border: none;
	border-radius: 12px;
	color: ${props => props.theme.colors.dark.bg};
	font-size: 0.875rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	justify-self: center;
	align-items: center;
	white-space: nowrap;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 15px ${props => props.theme.colors.primary}4d;
	}

	@media (max-width: 640px) {
		padding: 0.625rem 1rem;
		font-size: 0.8125rem;
		border-radius: 10px;
	}
`

export const ContentWrapper = styled.div`
	display: flex;
	gap: 2rem;
	align-items: flex-start;
	flex-direction: row;

	@media (max-width: 1024px) {
		flex-direction: column;
		gap: 1rem;
	}

	@media (max-width: 640px) {
		gap: 0.75rem;
		flex-direction: column;
	}
`

export const MainContent = styled.div`
	flex: 1;
	min-width: 0;
	width: 100%;

	@media (max-width: 1024px) {
		width: 100%;
	}
`

export const SearchContainer = styled.div`
	position: relative;
	margin-bottom: 1.5rem;

	&.mobile-search {
		display: none;
	}

	&.desktop-search {
		display: block;
	}

	@media (max-width: 640px) {
		margin-bottom: 1rem;
		width: 100%;

		&.mobile-search {
			display: block;
			margin-bottom: 0.75rem;
			width: 100%;
		}

		&.desktop-search {
			display: none;
		}
	}
`

export const SearchIcon = styled.div`
	position: absolute;
	left: 1rem;
	top: 50%;
	transform: translateY(-50%);
	color: ${props => props.theme.colors.light[300]};
	font-size: 1.25rem;
	pointer-events: none;

	@media (max-width: 640px) {
		left: 0.75rem;
		font-size: 1.125rem;
	}
`

export const SearchInput = styled.input`
	width: 100%;
	padding: 0.875rem 1rem;
	padding-left: 3rem;
	background: linear-gradient(
		145deg,
		${props => props.theme.colors.dark[700]}e6 0%,
		${props => props.theme.colors.dark[800]}f2 100%
	);
	border: 2px solid ${props => props.theme.colors.dark[600]}80;
	border-radius: 12px;
	color: ${props => props.theme.colors.light[100]};
	font-size: 1rem;
	transition: all 0.3s ease;

	&:focus {
		outline: none;
		border-color: ${props => props.theme.colors.primary};
		box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}1a;
	}

	&::placeholder {
		color: ${props => props.theme.colors.light[300]};
	}

	@media (max-width: 640px) {
		padding: 0.75rem 0.875rem;
		padding-left: 2.5rem;
		font-size: 0.9375rem;
		border-radius: 10px;
	}
`

export const FiltersRow = styled.div`
	display: flex;
	gap: 0.75rem;
	margin-bottom: 1.5rem;
	flex-wrap: wrap;

	@media (max-width: 640px) {
		gap: 0.5rem;
		margin-bottom: 1rem;
	}
`

export const FilterButton = styled.button<{ $active?: boolean }>`
	padding: 0.625rem 1rem;
	background: ${props =>
		props.$active
			? `${props.theme.colors.primary}33`
			: `linear-gradient(145deg, ${props.theme.colors.dark[700]}e6 0%, ${props.theme.colors.dark[800]}f2 100%)`};
	border: 2px solid
		${props =>
			props.$active
				? props.theme.colors.primary + '80'
				: props.theme.colors.dark[600] + '80'};
	border-radius: 8px;
	color: ${props =>
		props.$active ? props.theme.colors.primary : props.theme.colors.light[300]};
	font-size: 0.875rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	white-space: nowrap;

	&:hover {
		border-color: ${props => props.theme.colors.primary}80;
		color: ${props => props.theme.colors.primary};
		transform: translateY(-2px);
	}

	@media (max-width: 640px) {
		padding: 0.5rem 0.75rem;
		font-size: 0.8125rem;
		border-radius: 6px;
		gap: 0.375rem;

		svg {
			font-size: 0.875rem;
		}
	}
`

export const EntriesList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;

	@media (max-width: 640px) {
		gap: 0.75rem;
	}
`

export const EmptyState = styled.div`
	padding: 4rem 2rem;
	text-align: center;
	background: linear-gradient(
		145deg,
		${props => props.theme.colors.dark[700]}e6 0%,
		${props => props.theme.colors.dark[800]}f2 100%
	);
	border-radius: 16px;
	border: 2px solid ${props => props.theme.colors.dark[600]}80;

	@media (max-width: 640px) {
		padding: 2rem 1rem;
		border-radius: 12px;
	}
`

export const EmptyStateIcon = styled.div`
	font-size: 4rem;
	margin-bottom: 1rem;

	@media (max-width: 640px) {
		font-size: 3rem;
		margin-bottom: 0.75rem;
	}
`

export const EmptyStateText = styled.div`
	font-size: 1.125rem;
	color: ${props => props.theme.colors.light[300]};
	margin-bottom: 1rem;

	@media (max-width: 640px) {
		font-size: 1rem;
		margin-bottom: 0.75rem;
	}
`
