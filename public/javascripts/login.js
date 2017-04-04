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

    //modifie le formulaire pour ajouter/retirer les inputs si connexion ou enregistrement
    loginRegister.on('click', function() {
        console.log('DEBUT');
        pwd.css({'border': 'none'});
        pwd2.css({'border': 'none'});
        console.log('FIN');

        pwd.val('');
        pwd2.val('');

        if (actionForm.val() == 'login') {
            titleForm.text('S\'enregistrer');
            loginRegister.text('Login');
            loginRegister.attr('title', 'Déjà un compte ? Vous pouvez vous connecter :)');
            actionForm.val('register');

            pwd2.attr('required', true);
            mail.attr('required', true);

            submitFormLogin.val('S\'enregistrer');

            divRegisterOnly.show('slow');

        } else {
            titleForm.text('Login');
            loginRegister.text('S\'enregistrer');
            loginRegister.attr('title', 'Pas de compte ? Créer un nouveau compte :)');
            actionForm.val('login');

            pwd2.attr('required', false);
            mail.attr('required', false);

            submitFormLogin.val('Connexion');

            divRegisterOnly.hide('slow');
        }
    });

    //Affiche la 'popUp' qui demande les informations relatives au compte pour envoyer le mdp
    forgotPwd.on('click', function() {
        var w  = 600;
        var h = 265;
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        open('forgotPassword', 'Popup', 'scrollbars=0,resizable=0, width='+w+', height='+h+', top='+top+', left='+left);
        return false;
    });

    //Affiche un message lorsque la demande d'envoyer le mdp est fini
    $j('.formForgotPwd').on('submit', function() {
        alert('Demande prise en compte !');
    });

    pwd.on('keyup', function() {
        verifyPwd();
    });

    pwd2.on('keyup', function() {
        verifyPwd();
    });


    //Formalise le format du numéro de téléphone avec des epsaces tous les deux chiffres
    $j('.mailRegister').on('change', function() {
        var result = '';
        var number = $j(this).val().split(' ').join('');

        for (var i in number) {
            if (i != 0 && i % 2 == 0 && number.charAt(i) != ' ') {
                result += ' ';
            }
            result += number.charAt(i);
        }
        $j(this).val(result);
    });


    //Formalise le nom de famille en majuscule
    $j('.lastnameRegister').on('change', function() {
        $j(this).val($j(this).val().toUpperCase());
    });

    //Formalise le prenom en ucfirst
    $j('.firstnameRegister').on('change', function() {
        $j(this).val($j(this).val()[0].toUpperCase() + $j(this).val().substr(1, $j(this).val().length).toLowerCase());
    });

    function verifyPwd() {
        if (pwd.val().length >= parseInt(pwd.attr('minlength')) && pwd2.val().length >= parseInt(pwd.attr('minlength'))) {
            if(pwd.val() == pwd2 .val()) {
                pwd.attr('style', "border-radius: 5px; border:#00FF00 1px solid;");
                pwd2.attr('style', "border-radius: 5px; border:#00FF00 1px solid;");

                pwd.css({'border-radius': '5px', 'border':'#00FF00 1px solid'});
                pwd2.css({'border-radius': '5px', 'border':'#00FF00 1px solid'});
            } else {
                pwd.css({'border-radius': '5px', 'border':'#FF0000 1px solid'});
                pwd2.css({'border-radius': '5px', 'border':'#FF0000 1px solid'});
            }
        }
    }

    function initForm() {
        titleForm.text('Login');
        loginRegister.text('S\'enregistrer');
        loginRegister.attr('title', 'Pas de compte ? Créer un nouveau compte :)');
        actionForm.val('login');

        pseudo.attr('placeholder', 'Pseudo');
        pwd.attr('placeholder', 'Mot de passe');

        pwd.css({'border': 'none'});
        pwd2.attr('style', "border: none");

        divRegisterOnly.css('display', 'none');

        submitFormLogin.val('Connexion');
    }
});
