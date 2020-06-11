/** 检查权限 */
export function checkOperateAuth(operateAuthority, operateCode) {
  if (operateAuthority === 'admin' ||
    (Array.isArray(operateAuthority) &&
      operateAuthority.includes(operateCode))
  )
  {
    return true;
  } else {
    return false;
  }
}
