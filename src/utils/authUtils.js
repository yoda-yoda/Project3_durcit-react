export const checkAuth = () => {
  const accessToken = localStorage.getItem("accessToken");
  const memberId = localStorage.getItem("memberId");

  if (!accessToken || !memberId) {
    return false;
  }

  return true;
};
