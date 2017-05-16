$j(function() {
    if (window.location.pathname == '/swap/myRequest') {
        sendRequestSwap();
    }

});

function sendRequestSwap() {
    $j.post(
        '/swap/getMyRequest', {
        }, function(allSwap) {
            if (allSwap != '[]' && allSwap != 'nok') {
                $j('.resultSearch').html(toHtmlProductList(allSwap));
                $j('.resultSearch').attr('count', JSON.parse(allSwap).length);
            }
        });
}

//Met au format html les produits sous forme de liste
function toHtmlProductList(allSwap) {
    var html = '';

    for (var swap of JSON.parse(allSwap)) {
        html += '<div class=\'oneProduct div' + swap.asin + '\' >';
        html +=     '<img src=' + swap.imgLink + ' class=\'principal\'>';
        html +=     '<span class=\'spanProductTitle\' >';
        html +=         swap.pseudoUser;
        html +=     '</span>';
        html +=     '<img src=\'../images/accepte.png\' class=\'accepte\' onclick=\'accepteSwap("' + swap.asin + '")\'>';
        html +=     '<img src=\'../images/del.png\' class=\'del\'  onclick=\'refuseSwap("' + swap.asin + '")\'>';
        html += '</div>';
    }

    return html;
}

//Accepte la demande de produit
function accepteSwap(codeAsin) {
    $j.post(
        '/swap/accepteSwap', {
            asin: codeAsin
        }, function(data) {
            $j('.msgInfo').css({'opacity' : '1'});
            $j('.msgInfo').animate({opacity:0}, 4000);

            if (data == 'ok') {
                $j('.msgInfo').html('Demande accepté');
                $j('.msgInfo').removeClass('msgInfoNok');
                $j('.msgInfo').addClass('msgInfoOk');

                $j('.resultSearch').attr('count', $j('.resultSearch').attr('count') - 1 );

                $j('.div' + codeAsin).hide();

                if ($j('.resultSearch').attr('count') == 0) {
                    $j('.resultSearch').html('Aucune demande en attende de validation');
                }
            } else {
                $j('.msgInfo').html('Error : demande pas accepté');
                $j('.msgInfo').removeClass('msgInfoOk');
                $j('.msgInfo').addClass('msgInfoNok');
            }
        });
}

//Refuse la demande de produit
function refuseSwap(codeAsin) {
    $j.post(
        '/swap/refuseSwap', {
            asin: codeAsin
        }, function(data) {
            $j('.msgInfo').css({'opacity' : '1'});
            $j('.msgInfo').animate({opacity:0}, 4000);

            if (data == 'ok') {
                $j('.msgInfo').html('Demande refusé');
                $j('.msgInfo').removeClass('msgInfoNok');
                $j('.msgInfo').addClass('msgInfoOk');

                $j('.resultSearch').attr('count', $j('.resultSearch').attr('count') - 1 );
                $j('.div' + codeAsin).hide();


                if ($j('.resultSearch').attr('count') == 0) {
                    $j('.resultSearch').html('Aucune demande en attende de validation');
                }
            } else {
                $j('.msgInfo').html('Error : demande pas refusé');
                $j('.msgInfo').removeClass('msgInfoOk');
                $j('.msgInfo').addClass('msgInfoNok');
            }
        });
}