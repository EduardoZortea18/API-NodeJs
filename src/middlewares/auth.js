const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        //erro 401 de autorização
        return res.status(401).send({ error: 'No token provided'});
    }


    //formato padrão do token é BEARER oahdlk2328heia
    //Então dividimos o token em duas partes
    const parts = authHeader.split(' ');

    if (!parts.lenght === 2) {
        return res.status(401).send({ error: 'Token error'});
    }

    //criamos um vetor onde scheme é nosso bearer e o token é o token
    const [ scheme, token] = parts

    //if para verificar se existe o bearer no nosso token
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: 'Token malformatted'});
    }

    //Agora será recebido duas váriaveis um erro(err) e um id do usuario caso o token esteja certo(decoded)
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        //esse if faz com que eu verifique que a pessoa pode ter enviado um token, mas não era o mesmo
        //token que tinha o secret, ou seja eram diferentes, nesse casso returno o erro
        if (err) {
            return res.status(401).send({ error: 'Invalid Token'});
        }

        //posso fazer isso pois quando chamo minha function generateToken() 
        //passo como parametro o id
        req.userId = decoded.id;

        //para dizer que após passar por esse middleware a aplicação pode seguir para o controller
        return next();
    });

};