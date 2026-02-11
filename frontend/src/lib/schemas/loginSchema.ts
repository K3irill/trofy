import * as yup from 'yup'

export interface LoginFormSchema {
  login: string
  password: string
}

export const loginSchema = yup.object().shape({
  login: yup
    .string()
    .required('Введите email или телефон')
    .min(3, 'Минимум 3 символа'),
  password: yup
    .string()
    .required('Введите пароль')
    .min(6, 'Пароль должен содержать минимум 6 символов'),
})
