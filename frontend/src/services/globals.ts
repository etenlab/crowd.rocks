export class Globals {

  clear() {
    localStorage.removeItem("token")
    localStorage.removeItem("user_id")
    localStorage.removeItem("avatar")
    localStorage.removeItem("profile_url")
  }

  // token
  get_token(): string | null {
    return localStorage.getItem("token")
  }
  set_token(token: string) {
    localStorage.setItem("token", token)
  }

  // user id
  get_user_id(): number | null {
    const i = localStorage.getItem("user_id")

    if (i !== null) return +i

    return null
  }
  set_user_id(user_id: number) {
    localStorage.setItem("user_id", user_id.toString())
  }

  // avatar
  get_avatar(): string | null {
    return localStorage.getItem("avatar")
  }
  set_avatar(avatar: string) {
    localStorage.setItem("avatar", avatar)
  }

  // profile url
  get_profile_url(): string | null {
    return localStorage.getItem("profile_url")
  }
  set_profile_url(profile_url: string){
    localStorage.setItem("profile_url", profile_url)
  }
}

export const globals = new Globals()