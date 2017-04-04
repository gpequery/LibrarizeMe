$j(function() {
    $j('.inputUpdateUserInformations').on('change', function() {
        //Vérifie la disponibilité du pseudo et du mail à chaque changement. Change le formuraire en conséquent
        if ($j(this).attr('name') == 'pseudo' || $j(this).attr('name') == 'mail') {
            $j.post(
                '/user/exist', {
                    'pseudo': $j('.updatePseudo').val(),
                    'mail' : $j('.updateMail').val()
                }, function(data) {
                    if (differentToInitUser()) {
                        if (data == 'pseudoUsed' || data == 'mailUsed') {
                            $j('.submitUpdateUser').prop('disabled', true);
                            $j('.msgUpdateUser').addClass('msgNok');
                            $j('.msgUpdateUser').css({'opacity' : '1'});
                            if (data == 'pseudoUsed') {
                                $j('.updatePseudo').css({'border' : '2px solid red'});
                                $j('.msgUpdateUser').text('Pseudo déjà utilisé !');
                            } else {
                                $j('.updateMail').css({'border' : '2px solid red'});
                                $j('.msgUpdateUser').text('Mail déjà utilisé !');
                            }
                        } else if (data == 'ok') {
                            $j('.msgUpdateUser').css({'opacity' : '0'});
                            $j('.submitUpdateUser').prop('disabled', false);
                            $j('.updatePseudo').css({'border' : 'none'});
                            $j('.updateMail').css({'border' : 'none'});
                        }
                    } else {
                        $j('.msgUpdateUser').css({'opacity' : '0'});
                        $j('.submitUpdateUser').prop('disabled', true);
                        $j('.updatePseudo').css({'border' : 'none'});
                        $j('.updateMail').css({'border' : 'none'});
                    }
                }
            );
        }
    });

    $j('.updateInfos').on('change', function() {
       if (differentToInitUser()) {
           $j('.msgUpdateUser').css({'opacity' : '0'});
           $j('.submitUpdateUser').prop('disabled', false);
           $j('.updatePseudo').css({'border' : 'none'});
           $j('.updateMail').css({'border' : 'none'});
       } else {
           $j('.msgUpdateUser').css({'opacity' : '0'});
           $j('.submitUpdateUser').prop('disabled', true);
           $j('.updatePseudo').css({'border' : 'none'});
           $j('.updateMail').css({'border' : 'none'});
       }
    });


    //Formalise le nom de famille en majuscule
    $j('.updateLastname').on('change', function() {
        $j(this).val($j(this).val().toUpperCase());
    });

    //Formalise le prenom en ucfirst
    $j('.updateFirstname').on('change', function() {
        $j(this).val($j(this).val()[0].toUpperCase() + $j(this).val().substr(1, $j(this).val().length).toLowerCase());
    });

    //Formalise le format du numéro de téléphone avec des epsaces tous les deux chiffres
    $j('.updateMobile').on('change', function() {
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

    //Traitement du formulaire on submit
    $j('.submitUpdateUser').on('click', function() {
        var pseudo = $j('.updatePseudo');
        var lastname = $j('.updateLastname');
        var firstname = $j('.updateFirstname');
        var mail = $j('.updateMail');
        var mobile = $j('.updateMobile');

        $j.post(
            '/user/updateInformations', {
                'pseudo': pseudo.val(),
                'lastname' : lastname.val(),
                'firstname' : firstname.val(),
                'mail' : mail.val(),
                'numberphone' : mobile.val()
            }, function(data) {
                $j('.submitUpdateUser').prop('disabled', true);
                if(data.result == 'update') {
                    //Div info etat informations
                    $j('.msgUpdateUser').removeClass('msgNok');
                    $j('.msgUpdateUser').addClass('msgOk');
                    $j('.msgUpdateUser').text('Informations mises à jours !');
                    $j('.msgUpdateUser').css({'opacity' : '1'});

                    $j('.msgUpdateUser').animate({opacity:0}, 4000);

                    // mets les infos de base de l'user dans les input à jour
                    pseudo.attr('data', pseudo.val());
                    lastname.attr('data', lastname.val());
                    firstname.attr('data', firstname.val());
                    mail.attr('data', mail.val());
                    mobile.attr('data', mobile.val());

                    //Met le nom du menu à jour avec les nouvelles infos
                    var fullPseudo = lastname.val() != '' && firstname.val() != '' ? firstname.val() + ' ' + lastname.val() : pseudo.val();
                    $j('.pseudoUserMenu').html(fullPseudo);
                } else if (data.result == 'sequelize') {
                    //Div info etat informations
                    $j('.msgUpdateUser').removeClass('msgOk');
                    $j('.msgUpdateUser').addClass('msgNok');
                    $j('.msgUpdateUser').text('SEQUELIZE 5 !');
                    $j('.msgUpdateUser').css({'opacity' : '1'});
                }
            });
    });
});

function differentToInitUser() {
    return !($j('.updatePseudo').val() == $j('.updatePseudo').attr('data') && $j('.updateMail').val() == $j('.updateMail').attr('data') && $j('.updateFirstname').val() == $j('.updateFirstname').attr('data') && $j('.updateLastname').val() == $j('.updateLastname').attr('data') && $j('.updateMobile').val() == $j('.updateMobile').attr('data') );
}