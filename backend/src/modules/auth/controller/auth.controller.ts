import { Request, Response, NextFunction } from 'express'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { authService } from '../service/auth.service'
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  LinkPlatformDto,
} from '../dto/auth.dto'
import { ApiError } from '../../../core/errors/ApiError'
import { AuthRequest } from '../middleware/auth.middleware'

/**
 * Валидация DTO
 */
async function validateDto(dto: any, res: Response, next: NextFunction): Promise<boolean> {
  const errors = await validate(dto)
  if (errors.length > 0) {
    const messages = errors
      .map((error) => Object.values(error.constraints || {}))
      .flat()
    next(ApiError.badRequest(messages.join(', ')))
    return false
  }

  // Дополнительная валидация для RegisterDto
  if (dto instanceof RegisterDto) {
    if (!dto.email && !dto.phone) {
      next(ApiError.badRequest('Требуется указать email или телефон'))
      return false
    }
  }

  return true
}

export class AuthController {
  /**
   * POST /auth/register
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(RegisterDto, req.body)

      const isValid = await validateDto(dto, res, next)
      if (!isValid) return

      const result = await authService.register(dto)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /auth/login
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(LoginDto, req.body)

      const isValid = await validateDto(dto, res, next)
      if (!isValid) return

      const result = await authService.login(dto)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /auth/refresh
   */
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = req.body

      if (!refresh_token) {
        return next(ApiError.unauthorized('Refresh token not found'))
      }

      const result = await authService.refreshToken({ refresh_token })
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /auth/logout
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization
      const token = authHeader?.replace('Bearer ', '')

      if (token) {
        await authService.logout(token)
      }

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /auth/me
   */
  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      const user = await authService.getMe(req.user.userId)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /users/:id
   */
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const viewerId = (req as AuthRequest).user?.userId

      const user = await authService.getUserById(id, viewerId)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /auth/link-platform
   */
  async linkPlatform(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized()
      }

      const dto = plainToInstance(LinkPlatformDto, req.body)

      const isValid = await validateDto(dto, res, next)
      if (!isValid) return

      const user = await authService.linkPlatform(req.user.userId, dto)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }
}

export const authController = new AuthController()
