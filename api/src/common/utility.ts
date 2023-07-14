import { sign } from 'jsonwebtoken'

export function createToken(length: number = 64): string {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function getBearer(req: any): string | undefined {
  const headers = req?.req?.rawHeaders as Array<string>
  if (!headers) {
    return undefined
  }
  const Bearer = headers
    .find((value) => value.includes('Bearer'))
    ?.replace('Bearer', '')
    .trim()
  if (Bearer) return Bearer
  const bearer = headers
    .find((value) => value.includes('bearer'))
    ?.replace('bearer', '')
    .trim()
  if (bearer) return bearer
}

export function validateEmail(email: string): boolean {
  if (email.includes('@') && email.includes('.')) {
    return true
  }
  return false
}

export function justBearerHeader(bearer: string): any {
  return {
    req: {
      rawHeaders: [`Bearer ${bearer}`],
    },
  }
}

export function get_avatar_image_url(object_key: string | null): string | null {
  if (object_key) {
    return `https://[TODO]-public.s3.us-east-2.amazonaws.com/${object_key}`
  }
  return null
}

