$j(function() {
    if (window.location.pathname == '/product/myProducts') {
        sendRequestMyProduct();
    }

    $j('.removeProdut').on('click', function() {
        delProduct($j('.actionPopin input').attr('data'));
    });

    $j('.inputSearchMyProduct').on('keyup', function() {
        sendRequestMyProduct();
    });

    $j('.searchIndexMyProduct').on('click', function() {
        sendRequestMyProduct();
    });
});

//mets a jour la liste de mes produits
function sendRequestMyProduct() {
    $j.post(
        '/swap/getMyProducts', {
            title: $j('.inputSearchMyProduct').val(),
            group: $j('.searchIndexMyProduct').val()
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
        html += '<div class=\'oneProduct div' + product['asin'] + '\'>';
        html +=     '<img src=' + product['imgLink'] + ' class=\'principal\' onclick=\'getInfoProductMyLibrariy("' + product['asin'] + '")\'/>';
        html +=     '<span class=\'spanProductTitle\' title="' + product['title'] + '">';
        html +=         getLittleTitle(product['title']);
        html +=     '</span>';

        if (product.etat == 0) {
            html +=     '<img src=\'/images/redCircle.png\' class=\'imgEtat img' + product.asin + '\' title=\'Produit en prêt\' data=\'' + product.etat + '\' onclick=\'changeEtatProduct("' + product.asin + '")\'/>';
        } else if (product.etat == 1) {
            html +=     '<img src=\'/images/greenCircle.png\' class=\'imgEtat img' + product.asin + '\' title=\'Produit disponible\' data=\'' + product.etat + '\' onclick=\'changeEtatProduct("' + product.asin + '")\'/>';
        } else {
            html +=     '<img src=\'/images/blueCircle.png\' class=\'imgEtat img' + product.asin + '\' title=\'Produit disponible mais pas en prêt\' data=\'' + product.etat + '\' onclick=\'changeEtatProduct("' + product.asin + '")\'/>';
        }

        html +=     '<img src=\'/images/del.png\' class=\'del\' title=\'Supprimer le produit\' onclick=\'delProduct("' + product['asin'] + '")\'/>';

        html +=      '<div class=\'' + product['asin'] + '\'>';
        html +=          JSON.stringify(product);
        html +=      '</div>';
        html += '</div>';
    }

    return html;
}

//Ferme la popin
function closePopin() {
    $j('.popin').css('display', 'none');
    $j('.contentPopin').css('display', 'none');
    $j('.popinResult').css('display', 'none');
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

               closePopin();
           } else {
                $j('.popinResult').addClass('msgInfoNok');
                $j('.popinResult').removeClass('msgInfoOk');

                $j('.popinResult').html('Erreur lors de la suppréssion');
           }

            $j('.popinResult').fadeIn(600).delay(1000).fadeOut(800);

        });
}

//Prend les informations du produit selectionné et les mets dans la popin.
function getInfoProductMyLibrariy(productId) {
    //Affiche la popin par dessus
    $j('.popin').css('display', 'block');
    $j('.contentPopin').css('display', 'block');

    var infos = JSON.parse($j('.'+productId).html());
    console.log('INFOS : ');
    console.log(infos);

    //Les images du dessous
    var htmlImg = '';
    for(var image of JSON.parse(infos['imagesLink'])){
        htmlImg += '<img src=\'' + image['small'] + '\' onclick="changeImg(\'' + image['large'] + '\')"/>';
    }

    var htmlFeature = '';
    htmlFeature += '<ul>';
    for(var feature of JSON.parse(infos['features'])){
        htmlFeature += '<li>' + feature + '</li>';
    }
    htmlFeature += '</ul>';

    var htmlActor = '';
    let countActor = 0;
    for (let actor of JSON.parse(infos['actors'])) {
        htmlActor += actor;
        if (countActor < JSON.parse(infos['actors']).length - 1) {
            htmlActor += ', ';
        }
        countActor ++;
    }

    //Ajoutes toutes les infos dans le html
    $j('.actionPopin input').attr('data', infos['asin']);
    $j('.imgProductDetail').attr('src', infos['imgLink'].toString());
    $j('.imgProductDetail').attr('default-img', infos['imgLink'].toString());
    $j('.imagesProduct').html(htmlImg);
    $j('.right h1').html(getMediumTitle(infos['title']));
    $j('.detailPage a').attr('href', infos['detailPageURL']);
    $j('.codeEAN').html(infos['ean']);
    $j('.group').html(infos['group']);
    $j('.actionPopin input').attr('data', infos['asin']);

    if (htmlActor != '') {
        $j('.actors').html(htmlActor);
        $j('.divActors').css('display', 'block');
    } else {
        $j('.divActors').css('display', 'none');
    }

    if (htmlFeature != '<ul></ul>') {
        $j('.feature').html(htmlFeature);
        $j('.divFeature').css('display', 'block');
    } else {
        $j('.divFeature').css('display', 'none');
    }

    if (infos['public'] != null) {
        $j('.public').html(infos['public']);
        $j('.divPublic').css('display', 'block');
    } else {
        $j('.divPublic').css('display', 'none');
    }

    if (infos['brand'] != null) {
        $j('.brand').html(infos['brand']);
        $j('.divBrand').css('display', 'block');
    } else {
        $j('.divBrand').css('display', 'none');
    }

    if (infos['release'] != null) {
        var date = infos['release'].split('-');
        $j('.release').html(date[2] + '/' + date[1] + '/' + date[0]);
        $j('.divRelease').css('display', 'block');
    } else {
        $j('.divRelease').css('display', 'none');
    }
}

//Change l'etat du produit
function changeEtatProduct(asin) {

    $j.post(
        '/swap/changeEtat', {
            asin: asin,
            actual: $j('.img'+asin).attr('data')
        }, function(data) {
            if (data == '0') {
                $j('.img'+asin).attr('data', 0);
                $j('.img'+asin).attr('src', '/images/redCircle.png');
            } else if (data == '1') {
                $j('.img'+asin).attr('data', 1);
                $j('.img'+asin).attr('src', '/images/greenCircle.png');
            } else if (data == '2') {
                $j('.img'+asin).attr('data', 2);
                $j('.img'+asin).attr('src', '/images/blueCircle.png');
            }

        });
}