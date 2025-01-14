/**
 * this model specifies the format to exchange userdata with the frontend and store it in mongoDB
 * @param {string} username
 * @param {string} firstname
 * @param {string} lastname
 * @param {string} email
 * @param {string} password
 * @param {boolean} isAdmin
 * @param {string} role
 */
class User{
    static Roles = {
        ADMIN: 'admin',
        CEO: 'ceo',
        HR: 'hr',
        SALESMAN: 'salesman'
    };

    constructor(username, firstname, lastname, email, password, isAdmin, role) {
        if (!Object.values(User.Roles).includes(role)) {
            throw new Error(`Invalid role. Role must be one of: ${Object.values(User.Roles).join(', ')}`);
        }
        this._id = undefined;
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
        this.role = role;
    }

    set role(value) {
        if (!Object.values(User.Roles).join(', ')) {
            throw new Error(`Invalid role. Role must be one of: ${Object.values(User.Roles).join(', ')}`);
        }
        this._role = value;
    }

    get role() {
        return this._role;
    }
}

module.exports = User;