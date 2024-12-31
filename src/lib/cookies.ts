export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=").map((c) => c.trim());
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};

export const setCookie = (
  name: string,
  value: string,
  options: {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
  } = {}
): void => {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.expires) {
    if (typeof options.expires === "number") {
      const date = new Date();
      date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      options.expires = date;
    }
    cookie += `; expires=${options.expires.toUTCString()}`;
  }

  if (options.path) cookie += `; path=${options.path}`;
  if (options.domain) cookie += `; domain=${options.domain}`;
  if (options.secure) cookie += "; secure";
  if (options.sameSite) cookie += `; samesite=${options.sameSite}`;

  document.cookie = cookie;
};

export const removeCookie = (name: string, path = "/"): void => {
  setCookie(name, "", {
    expires: new Date(0),
    path,
  });
};
