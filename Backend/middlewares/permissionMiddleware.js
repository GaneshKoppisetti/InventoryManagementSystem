const checkPermission = (module, action) => {
  return (req, res, next) => {
    const userPermissions = req.user.permissions;
    console.log(userPermissions);
    if (!userPermissions || !Array.isArray(userPermissions)) {
      return res.status(403).json({ message: "No permissions found" });
    }

    const allowed = userPermissions.some(roleObj =>
      roleObj.permissions?.[module]?.includes(action)
    );

    if (!allowed) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};

module.exports = checkPermission;
