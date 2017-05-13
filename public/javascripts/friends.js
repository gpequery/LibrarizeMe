$j(function() {

    $j('.searchFriendsInput').on('keyup', function() {
        var value = $j(this).val();
        if (value.length >= 2) {
            $j.post(
                '/friends/searchUsersByText', {
                    'value': value,
                    dataType: 'json'
                }, function(data) {
                    if (data != '[]') {
                        $j('.resultSearchUser').html(getHtmlResult(data));
                        $j('.resultSearchNoUser').hide();
                    } else {
                        $j('.resultSearchUser').html('');
                        $j('.resultSearchNoUser').show();
                    }

                });
        } else {
            $j('.resultSearchUser').html('');
        }
    });

    $j('.imgInvitationRefuse').on('click', function() {
        var id = $j(this).parent().parent().attr('id');

        $j.post(
            '/friends/refuseInvitation', {
                'id': id
            }, function(data) {
                if(data != 'Nok') {
                    $j('#' + id).hide();

                    $j('.sendType').attr('count',  $j('.sendType').attr('count') - 1);
                    if($j('.sendType').attr('count') == 0) {
                        $j('.sendType').append('<div style="margin-top: -20px"> Aucune invitation reçue</div>');
                    }

                    $j('.msgInfo').css({'opacity' : '1'});
                    $j('.msgInfo').animate({opacity:0}, 4000);
                    $j('.msgInfo').html(data);
                    $j('.msgInfo').removeClass('msgInfoNok');
                    $j('.msgInfo').addClass('msgInfoOk');

                } else {
                    console.log('Nok');
                }
            });
    });

    $j('.imgInvitationAccepte').on('click', function() {
        var id = $j(this).parent().parent().attr('id');

        $j.post(
            '/friends/accepteInvitation', {
                'id': id
            }, function(data) {
                if (data != 'Nok') {
                    $j('#' + id).hide();

                    $j('.sendType').attr('count',  $j('.sendType').attr('count') - 1);
                    if($j('.sendType').attr('count') == 0) {
                        $j('.sendType').append('<div style="margin-top: -20px"> Aucune invitation reçue</div>');
                    }


                    $j('.msgInfo').css({'opacity' : '1'});
                    $j('.msgInfo').animate({opacity:0}, 4000);
                    $j('.msgInfo').html(data);
                    $j('.msgInfo').removeClass('msgInfoNok');
                    $j('.msgInfo').addClass('msgInfoOk');
                } else {
                    console.log('Nok');
                }
            });
    });

    $j('.imgInvitationDel').on('click', function() {
        var id = $j(this).parent().parent().attr('id');

        $j.post(
            '/friends/delInvitation', {
                'id': id
            }, function(data) {
                if (data != 'Nok') {
                    $j('#' + id).hide();

                    $j('.waitType').attr('count',  $j('.waitType').attr('count') - 1);
                    if($j('.waitType').attr('count') == 0) {
                        $j('.waitType').append('<div style="margin-top: -20px"> Aucune invitation en attente ! </div>');
                    }

                    $j('.msgInfo').css({'opacity' : '1'});
                    $j('.msgInfo').animate({opacity:0}, 4000);
                    $j('.msgInfo').html(data);
                    $j('.msgInfo').removeClass('msgInfoNok');
                    $j('.msgInfo').addClass('msgInfoOk');
                } else {
                    console.log('Nok');
                }
            });
    });

    $j('.imgDelFriend').on('click', function() {
        var id = $j(this).parent().parent().attr('id');

        $j.post(
            '/friends/delInvitation', {
                'id': id
            }, function(data) {
                if (data != 'Nok') {
                    $j('#' + id).hide();

                    $j('.invitationType').attr('count',  $j('.invitationType').attr('count') - 1);
                    if($j('.invitationType').attr('count') == 0) {
                        $j('.invitationType').append('<div class=\'noBodyFriend\' style="margin-top: -20px">Vous avez aucun ami dans votre liste</div>');
                    }

                    $j('.msgInfo').css({'opacity' : '1'});
                    $j('.msgInfo').animate({opacity:0}, 4000);
                    $j('.msgInfo').html('Retiré de la liste d\'ami !');
                    $j('.msgInfo').removeClass('msgInfoNok');
                    $j('.msgInfo').addClass('msgInfoOk');
                } else {
                    console.log('Nok');
                }
            });
    });

    $j('.libraryImg').on('click', function() {
        printLibraryByUserId($j(this).parent().parent().attr('id'), $j(this).parent().attr('data'));
    });

});

//Ferme la popin
function closePopin() {
    $j('.popin').css('display', 'none');
    $j('.contentPopin').css('display', 'none');
    $j('.popinResult').css('display', 'none');
}

//Affiche la liste des utilisateurs dynamiquement
function getHtmlResult(data) {
    var users = JSON.parse(data);
    var html = '';

    for (var usr of users) {
        html += '<div class=\'oneUser\'>';
        if (usr.haveAvatar) {
            html +=             '<img src=\'../images/userAvatar/avatar_' + usr.id + '.png\'/>';
        } else if (usr.isMale) {
            html +=             '<img src=\'../images/userAvatar/noAvatarM.png\'/>';
        } else {
            html +=             '<img src=\'../images/userAvatar/noAvatarF.png\'/>';
        }
        html +=         '<span>';
        html +=             usr.pseudo;
        html +=             '<img src=\'../images/addFriend.png\' title=\'Envoyer une invitation à ' + usr.pseudo + '\'  class=\'askToBeFriend\' onclick=\'askToBeFriend(' + usr.id + ', "' + usr.pseudo + '")\'/>';
        html +=         '</span>';
        html += '</div>';
    }

    return html;
}

//Demande confirmation avant d'envoyer la demande
function askToBeFriend(usrId, pseudo) {
    if (confirm('Envoyer une demande d\'ami à ' + pseudo + ' ?')) {
        $j.post(
            '/friends/sendInvite', {
                'usrId': usrId
            }, function(data) {
                $j('.msgInfo').css({'opacity' : '1'});
                $j('.msgInfo').animate({opacity:0}, 4000);
                if (data != 'Nok') {
                    $j('.msgInfo').html(data);
                    $j('.msgInfo').removeClass('msgInfoNok');
                    $j('.msgInfo').addClass('msgInfoOk');
                } else {
                    $j('.msgInfo').html('Error : demande pas envoyé');
                    $j('.msgInfo').removeClass('msgInfoOk');
                    $j('.msgInfo').addClass('msgInfoNok');
                }
            })
    }
}

//Affiche la librairie de l'ami selectioné
function printLibraryByUserId(userId, pseudoUser) {
    //Affiche la popin par dessus
    $j('.popin').css('display', 'block');
    $j('.contentPopin').css('display', 'block');

    $j('.popinPseudo').html(pseudoUser);

    $j.post(
        '/swap/getProductByUserId', {
            'userId': userId
        }, function(products) {
            //console.log('INFO : ' + products);
            if (products != 'Nok' && products.lenth != 0) {
                for (var product of JSON.parse(products)) {

                    console.log('Product : ' + JSON.stringify(product));
                    console.log(' ');
                }
            } else {
                $j('.resultSearch').html('Aucun produit trouvé !');
            }
        });

}