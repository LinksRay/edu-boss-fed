import request from '@/utils/request'

// 获取角色
export const getRoles = data => {
  return request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data
  })
}

// 删除角色
export const deleteRole = id => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

// 更改和新建角色
export const createOrEditRole = data => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

// 获取角色
export const getRole = id => {
  return request({
    method: 'GET',
    url: `/boss/role/${id}`
  })
}
