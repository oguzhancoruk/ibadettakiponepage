export const getSession = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && typeof user === "object" && user._id ? user : null;
  } catch {
    return null;
  }
};

export const clearSession = async () => {
  const user = getSession();
  localStorage.removeItem("user");
  let timer;
  try {
    await Promise.race([
      import("../services/push").then(({ revokePushOnLogout }) =>
        revokePushOnLogout(user)
      ),
      new Promise((resolve) => {
        timer = setTimeout(resolve, 3000);
      }),
    ]);
  } catch {
    /* Signing out also works when the push module cannot load offline. */
  } finally {
    clearTimeout(timer);
  }
};
