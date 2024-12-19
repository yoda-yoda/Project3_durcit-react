export const checkAuth = () => {
  const accessToken = localStorage.getItem("accessToken");
  const memberId = localStorage.getItem("memberId");

  if (!accessToken || !memberId) {
    alert("로그인이 필요합니다. 다시 로그인해주세요.");
    return false;
  }

  return true;
};
