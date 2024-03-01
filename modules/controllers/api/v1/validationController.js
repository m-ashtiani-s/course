const {check} = require('express-validator');
exports.register = [
    check('name').notEmpty().trim().escape().withMessage('نام می بایست وارد شود.').isLength({min: 5}).withMessage('نام حداقل می بایست 5 کاراکتر باشد.'),
    check('email').notEmpty().isEmail().normalizeEmail().withMessage('ایمیل وارد شده معتبر نمی باشد!'),
    check('password').notEmpty().isLength({min: 5}).withMessage('رمز حداقل می بایست 5 کاراکتر باشد.')
];
exports.login = [
    check('email').notEmpty().isEmail().normalizeEmail().withMessage('ایمیل وارد شده معتبر نمی باشد!'),
]