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
});

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
        //$j('.resultSearchNoUser').show();
        $j.post(
            '/friends/sendInvite', {
                'usrId': usrId
            }, function(data) {
                $j('.msgInfo').css({'opacity' : '1'});
                $j('.msgInfo').animate({opacity:0}, 4000);
                if (data != 'Nok') {
                    $j('.msgInfo').html(data);
                    $j('.msgUpdateUser').removeClass('msgInfoNok');
                    $j('.msgInfo').addClass('msgInfoOk');
                } else {
                    $j('.msgInfo').html('Error : demande pas envoyé');
                    $j('.msgUpdateUser').removeClass('msgInfoOk');
                    $j('.msgInfo').addClass('msgInfoNok');
                }
            })
    }
}
