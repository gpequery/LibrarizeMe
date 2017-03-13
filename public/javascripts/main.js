$j(function() {

    $j('#loginRegister').on('click', function() {
        if ($j('#actionForm').val() == 'login') {
            $j('#titleForm').text('S\'enregistrer');
            $j('#loginRegister').text('Login');
            $j('#actionForm').val('register');

            $j('#pseudo').attr('placeholder', 'Nouveau pseudo');
            $j('#pwd').attr('placeholder', 'Nouveau password');

            $j('#submitFormLogin').val('Connexion');

        } else {
            $j('#titleForm').text('Login');
            $j('#loginRegister').text('S\'enregistrer');
            $j('#actionForm').val('login');

            $j('#pseudo').attr('placeholder', 'Pseudo');
            $j('#pwd').attr('placeholder', 'Password');

            $j('#submitFormLogin').val('S\'enregistrer');
        }

    });

});
