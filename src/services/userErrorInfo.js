export const generateUserErrorInfo = (user) => {
    return `
        Alguno de los campos para crear el usuario no es válido.
        
        Lista de campos requeridos:
        first_name: Debe ser un campo de tipo String y se recibe "${user.first_name}",
        last_name: Debe ser un campo de tipo String y se recibe  "${user.last_name}",
        email: Debe ser un campo de tipo Email y se recibe "${user.email}",
        password: Debe ser un campo con al menos 1 número y se recibe "${user.password}"
    `
}