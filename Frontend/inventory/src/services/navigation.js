let navigate;

export const setNavigate = (nav) => {
  navigate = nav;
};

export const navigateTo = (path) => {
  if (navigate) {
    navigate(path);
  }
};