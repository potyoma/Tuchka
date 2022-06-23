const authHeader = () => {
    const storageUser = localStorage.getItem('user')
    const user = JSON.parse(storageUser)

    return user && user.jwtToken
        ? { 'Authorization': `Bearer ${user.jwtToken}` }
        : {}
}

export default authHeader