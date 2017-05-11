$j(function() {
    if (window.location.pathname == '/product/myProducts') {
        sendRequestMyProduct();
    }

});

//mets a jour la liste de mes produits
function sendRequestMyProduct() {
    $j.post(
        '/swap/getMyProducts', {
        }, function(allProducts) {
            var productsJSON = JSON.parse(allProducts);

            if (productsJSON != 'Nok' && productsJSON.lenth != 0) {
                $j('.resultSearch').attr('count', productsJSON.length);
                $j('.resultSearch').html(toHtmlProductListMyProduct(productsJSON));

                if ($j('.resultSearch').attr('count') == 0) {
                    $j('.resultSearch').html('Aucun produit trouvé !');
                }
            } else {
                $j('.resultSearch').html('Aucun produit trouvé !');
            }
        });
}

//Met au format html les produits sous forme de liste
function toHtmlProductListMyProduct(allProducts) {
    var html = '';

    for (var product of allProducts) {
        console.log('PRODUCT : ' + JSON.stringify(product));
        html += '<div class=\'oneProduct div' + product['asin'] + '\'>';
        html +=     '<img src=' + product['imgLink'] + ' class=\'principal\' onclick=\'getInfoProduct("' + product['asin'] + '")\'/>';
        html +=     '<span class=\'spanProductTitle\' title="' + product['title'] + '">';
        html +=         getLittleTitle(product['title']);
        html +=     '</span>';

        html +=     '<img src=\'/images/del.png\' class=\'del\' title=\'Supprimer le produit\' onclick=\'delProduct("' + product['asin'] + '")\'/>';

        html +=      '<div class=\'' + product['asin'] + '\'>';
        html +=          JSON.stringify(product);
        html +=      '</div>';
        html += '</div>';
    }

    return html;
}

function delProduct(asin) {
    $j.post(
        '/swap/delProduct', {
            asin: asin
        }, function(data) {
           if(data == 'ok') {
                $j('.div' + asin).hide();
                $j('.popinResult').removeClass('msgInfoNok');
                $j('.popinResult').addClass('msgInfoOk');
                $j('.resultSearch').attr('count',  $j('.resultSearch').attr('count') - 1);

                $j('.popinResult').html('Produit supprimé de votre bibliothèque !');

               if ($j('.resultSearch').attr('count') == 0) {
                   $j('.resultSearch').html('Aucun produit trouvé !');
               }
           } else {
                $j('.popinResult').addClass('msgInfoNok');
                $j('.popinResult').removeClass('msgInfoOk');

                $j('.popinResult').html('Erreur lors de la suppréssion');
           }

            $j('.popinResult').fadeIn(600).delay(1000).fadeOut(800);

        });
}