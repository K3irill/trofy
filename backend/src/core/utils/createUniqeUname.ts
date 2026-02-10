import { generateFromEmail } from 'unique-username-generator'

export const createUniqueUname = (string: string) => {
	return generateFromEmail(string)
}
