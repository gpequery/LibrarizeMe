$j(function() {
    sendRequest();

    $j('.inputSearch').on('keyup', function() {
        sendRequest();
    });

    $j('.searchIndex').on('click', function() {
        sendRequest();
    });

    $j('.popin').on('click', function() {
        closePopin();
    });

    $j('.left').on('mouseleave', function() {
        $j('.imgProductDetail').attr('src', $j('.imgProductDetail').attr('default-img'));
    });

    $j('.closePopin').on('click', function() {
        closePopin();
    });

    $j('.actionPopin input').on('click', function() {
        var infos = getInfoDetail(JSON.parse($j('.'+$j(this).attr('data')).html()));

        $j.post(
            'addProduct', {

            }, function(data) {
                console.log('DATA : ' + data);
            });

        console.log('FIN : ' + JSON.stringify(infos));
    });

});

function closePopin() {
    $j('.popin').css('display', 'none');
    $j('.contentPopin').css('display', 'none');
}


//mets a jour la liste des produits
function sendRequest() {

    if ($j('.inputSearch').val().length >= 3) {
        $j.post(
            'searchCode', {
                'code': $j('.inputSearch').val(),
                'searchIndex': $j('.searchIndex').val(),
                'page': '1'
            }, function(data) {
                if (data != 'Nok' && data.lenth != 0) {
                    $j('.resultSearch').html(toHtmlProductList(data));
                } else {
                    $j('.resultSearch').html('Aucun produit trouvé !');
                }
            });
    }
}

//Met au format html les produits sous forme de liste
function toHtmlProductList(allProducts) {
    var infos;
    var html = '';

    for (var product of allProducts) {
        infos = getInfoSmall(product);

        html += '<div class=\'oneProduct\'>';

            if (infos['imgLink'] != null) {
                html += '<img src=' + infos['imgLink'] + ' onclick=\'getInfoProduct("' + infos['ASIN'] + '")\'/>';
            } else {
               html += '<img src=\'/images/product_no_image.png\' style=\'width: 160px\' onclick=\'getInfoProduct("' + infos['ASIN'] + '")\'\/>';
            }

            html +=         '<span class=\'spanProductTitle\' title="' + infos['title'] + '">';
            html +=             getLittleTitle(infos['title']);
            html +=         '</span>';

            html +=         '<div class=\'' + infos['ASIN'] + '\'>';
            html +=             JSON.stringify(product);
            html +=         '</div>';

        html += '</div>';
    }

    return html;
}

//Retourn un tableau avec le lien de l'img, le titre et le code ASIN
function getInfoSmall(product) {
    var infos = [];

    infos['imgLink'] = product['MediumImage'] != undefined ? product['MediumImage'][0]['URL'][0] : null;
    infos['title'] = product['ItemAttributes'][0]['Title'][0].toString();
    infos['ASIN'] = product['ASIN'][0].toString();

    return infos;
}

function getInfoDetail(product) {
    console.log('ID : ' + product);
    var infos = [];

    infos['imgLink'] = product['LargeImage'] != undefined ? product['LargeImage'][0]['URL'][0] : '/images/product_no_image.png';
    infos['title'] = product['ItemAttributes'][0]['Title'][0].toString();
    infos['ASIN'] = product['ASIN'][0].toString();
    infos['DetailPageURL'] = product['DetailPageURL'][0].toString();
    infos['codeEAN'] = typeof product['ItemAttributes'][0]['EAN'] !== 'undefined' ? product['ItemAttributes'][0]['EAN'][0] : '&empty;';
    infos['public'] = typeof product['ItemAttributes'][0]['AudienceRating'] !== 'undefined' ? product['ItemAttributes'][0]['AudienceRating'][0] : null;
    infos['brand'] = typeof product['ItemAttributes'][0]['Brand'] !== 'undefined' ? product['ItemAttributes'][0]['Brand'][0] : null;
    infos['group'] = typeof product['ItemAttributes'][0]['ProductGroup'] !== 'undefined' ? product['ItemAttributes'][0]['ProductGroup'][0] : '&empty;';
    infos['release'] = typeof product['ItemAttributes'][0]['ReleaseDate'] !== 'undefined' ? product['ItemAttributes'][0]['ReleaseDate'][0] : null;


    //Formated price :
    if (typeof product['ItemAttributes'][0]['ListPrice'] !== 'undefined') {
        var amout = product['ItemAttributes'][0]['ListPrice'][0]['Amount'].toString();
        var code = product['ItemAttributes'][0]['ListPrice'][0]['CurrencyCode'].toString() == 'EUR' ? '&euro;' : ' ' + product['ItemAttributes'][0]['ListPrice'][0]['CurrencyCode'].toString();
        infos['price'] = amout.substr(0, amout.length - 2) + ',' +  amout.substr(-2) + code;
    } else { infos['price'] = '&empty;' }



    //Stock les differentes images != de la principale (max 4)
    infos['imagesLink'] = [];
    if (typeof product['ImageSets'] !== 'undefined') {
        var count = 0;
        for (var image of product['ImageSets'][0]['ImageSet']) {
            if (count == 4) {
                break;
            }

            if (image['$']['Category'] != 'primary') {
                infos['imagesLink'].push({
                    'large': image['LargeImage'][0]['URL'][0],
                    'small': image['TinyImage'][0]['URL'][0]
                });
            }
            count++;
        }
    }

    //Stock les acteurs (max 4)
    infos['actors'] = [];
    var count = 0;
    if (typeof product['ItemAttributes'][0]['Actor'] !== 'undefined') {
        var count = 0;
        for (var actor of product['ItemAttributes'][0]['Actor']) {
            if (count == 4) {
                break;
            }
            infos['actors'].push(actor);
        }
    }

    //Stock les feature (max 4)
    infos['features'] = [];
    var count = 0;
    if (typeof product['ItemAttributes'][0]['Feature'] !== 'undefined') {
        var count = 0;
        for (var feature of product['ItemAttributes'][0]['Feature']) {
            if (count == 4) {
                break;
            }
            infos['features'].push(feature);
        }
    }


    return infos;
}

//Retourne le titre à la bonne taille avec '...' + le titre complet pour le survole
function getLittleTitle(title) {
    if (title.length >= 10 ) {
        return title.substr(0, 10) + ' ...';
    } else {
        return title;
    }
}

//Prend les informations du produit selectionné et les mets dans la popin.
function getInfoProduct(productId) {
    //Affiche la popin par dessus
    $j('.popin').css('display', 'block');
    $j('.contentPopin').css('display', 'block');

    var infos = getInfoDetail(JSON.parse($j('.'+productId).html()));

    //Les images du dessous
    var htmlImg = '';
    for(var image of infos['imagesLink']){
        htmlImg += '<img src=\'' + image['small'] + '\' onclick="changeImg(\'' + image['large'] + '\')"/>';
    }

    var htmlFeature = '';
    htmlFeature += '<ul>';
    for(var feature of infos['features']){
        htmlFeature += '<li>' + feature + '</li>';
    }
    htmlFeature += '</ul>';

    var htmlActor = '';
    for(var i = 0; i < infos['actors'].length; i++){
        htmlActor += infos['actors'][i];
        if (i < infos['actors'].length - 1) {
            htmlActor += ', ';
        }
    }


    //Ajoutes toutes les infos dans le html
    $j('.imgProductDetail').attr('src', infos['imgLink'].toString());
    $j('.imgProductDetail').attr('default-img', infos['imgLink'].toString());
    $j('.imagesProduct').html(htmlImg);
    $j('.right h1').html(infos['title']);
    $j('.detailPage a').attr('href', infos['DetailPageURL']);
    $j('.amount').html(infos['price']);
    $j('.codeEAN').html(infos['codeEAN']);
    $j('.group').html(infos['group']);

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

    $j('.actionPopin input').attr('data', infos['ASIN'])
}

function changeImg(url) {
    $j('.imgProductDetail').attr('src', url);
}
