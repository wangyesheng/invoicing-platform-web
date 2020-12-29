const express = require('express')
const bodyparser = require('body-parser');

const app = express();
app.use(bodyparser.urlencoded({ extende: true }));
app.use(bodyparser.json())

const AdminToken = 'b734edfeb7e2c79f730415cff2097c16'
const EditorToken = 'a35dedfeb7e2c79f730415cff2097c16'

app.post('/api/login', (req, res) => {
    const { username } = req.body
    if (username === 'admin') {
        return res.json({ code: 200, msg: 'login successful', data: { token: AdminToken } })
    }
    else {
        return res.json({ code: 200, msg: 'login successful', data: { token: EditorToken } })
    }
})

app.get('/api/userinfo', (req, res) => {
    const token = req.query.token;
    if (token === AdminToken) {
        return res.json({
            code: 200,
            msg: 'successful',
            data: {
                username: 'admin',
                roles: ['Admin'],
                permissions: {
                    pages: [
                        '/sys',
                        '/sys/user',
                        '/sys/role',
                        '/sys/permission',
                        '/nested',
                        '/nested/menu1',
                        '/nested/menu1/menu1-1',
                        '/nested/menu1/menu1-3',
                        '/nested/menu2'
                    ],
                    btns: [
                        'user_add',
                        'user_delete',
                        'user_edit',
                        'role_add',
                        'role_delete',
                        'role_edit',
                        'permission_add',
                        'permission_delete',
                        'permission_edit',
                    ]
                }
            }
        })
    } else {
        return res.json({
            code: 200,
            msg: 'successful',
            data: {
                username: 'editor',
                roles: ['Editor'],
                permissions: {
                    pages: [
                        '/sys',
                        '/sys/user',
                        '/sys/role',
                        '/sys/permission',
                    ],
                    btns: [
                        'user_add',
                        'user_delete',
                        'user_edit',
                        'role_add',
                        'role_delete',
                        'role_edit',
                        'permission_add',
                        'permission_delete',
                        'permission_edit',
                    ]
                }
            }
        })
    }

})

app.listen(3000, () => console.log(`server is running in 3000 port`))