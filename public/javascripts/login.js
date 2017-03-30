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
    var forgotPwd = $j('.forgotPwd');

    initForm();

    loginRegister.on('click', function() {
        if (actionForm.val() == 'login') {
            titleForm.text('S\'enregistrer');
            loginRegister.text('Login');
            loginRegister.attr('title', 'Déjà un compte ? Vous pouvez vous connecter :)');
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
            loginRegister.attr('title', 'Pas de compte ? Créer un nouveau compte :)');
            actionForm.val('login');

            pseudo.attr('placeholder', 'Pseudo');
            pwd.attr('placeholder', 'Password');
            pwd2.attr('required', false);
            mail.attr('required', false);

            submitFormLogin.val('Connexion');

            divRegisterOnly.hide('slow');
        }
    });

    forgotPwd.on('click', function() {
        var w  = 600;
        var h = 265;
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        open('forgotPassword', 'Popup', 'scrollbars=0,resizable=0, width='+w+', height='+h+', top='+top+', left='+left);
        return false;
    });

    $j('.formForgotPwd').on('submit', function() {
        alert('Demande prise en compte !');
    });

    function initForm() {
        titleForm.text('Login');
        loginRegister.text('S\'enregistrer');
        loginRegister.attr('title', 'Pas de compte ? Créer un nouveau compte :)');
        actionForm.val('login');

        pseudo.attr('placeholder', 'Pseudo');
        pwd.attr('placeholder', 'Password');

        divRegisterOnly.css('display', 'none');

        submitFormLogin.val('Connexion');
    }
});
