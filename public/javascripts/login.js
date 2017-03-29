$j(function() {
    var actionForm = $j('.actionForm');
    var loginRegister = $j('.loginRegister');
    var titleForm = $j('.titleForm');
    var pseudo = $j('.pseudo');
    var pwd = $j('.pwd');
    var pwd2 = $j('.pwd2');
    var mail = $j('.mail');
    var submitFormLogin = $j('.submitFormLogin');
    var divRegisterOnly = $j('.onlyRegisterInput');

    initForm();

    loginRegister.on('click', function() {
        if (actionForm.val() == 'login') {
            titleForm.text('S\'enregistrer');
            loginRegister.text('Login');
            actionForm.val('register');

            pseudo.attr('placeholder', 'New pseudo');
            pwd.attr('placeholder', 'New password');
            pwd2.attr('required', true);
            mail.attr('required', true);

            submitFormLogin.val('S\'enregistrer');

            divRegisterOnly.show('slow');

        } else {
            titleForm.text('Login');
            loginRegister.text('S\'enregistrer');
            actionForm.val('login');

            pseudo.attr('placeholder', 'Pseudo');
            pwd.attr('placeholder', 'Password');
            pwd2.attr('required', false);
            mail.attr('required', false);

            submitFormLogin.val('Connexion');

            divRegisterOnly.hide('slow');
        }
    });

    function initForm() {
        titleForm.text('Login');
        loginRegister.text('S\'enregistrer');
        actionForm.val('login');

        pseudo.attr('placeholder', 'Pseudo');
        pwd.attr('placeholder', 'Password');

        divRegisterOnly.css('display', 'none');

        submitFormLogin.val('Connexion');
    }
});
