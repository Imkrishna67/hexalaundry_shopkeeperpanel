const SESSION_KEY = 'hexa_shop_session'
const TOKEN_KEY = 'hexa_shop_token'

export function setShopSession(shopkeeper) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      id: shopkeeper.id || shopkeeper._id || shopkeeper.shopId || Date.now().toString(),
      shopId: shopkeeper.shopId || shopkeeper.id || shopkeeper._id,
      shopName: shopkeeper.shopName,
      ownerName: shopkeeper.ownerName,
      email: shopkeeper.email,
      loggedInAt: Date.now(),
    }))
  } catch {
    /* ignore */
  }
}

export function getShopSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setShopToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    /* ignore */
  }
}

export function getShopToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || null
  } catch {
    return null
  }
}

export function clearShopSession() {
  try {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}
