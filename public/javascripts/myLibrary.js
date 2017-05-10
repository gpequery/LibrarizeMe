$j(function() {
    if (window.location.pathname == '/product/myProducts') {
        sendRequest();
    }

});

//mets a jour la liste de mes produits
function sendRequest() {
    $j.post(
        '/swap/getMyProducts', {
        }, function(allProducts) {
            var productsJSON = JSON.parse(allProducts);

            if (productsJSON != 'Nok' && productsJSON.lenth != 0) {
                $j('.resultSearch').html(toHtmlProductList(productsJSON));
            } else {
                $j('.resultSearch').html('Aucun produit trouvé !');
            }
        });
}

//Met au format html les produits sous forme de liste
function toHtmlProductList(allProducts) {
    var html = '';

    for (var product of allProducts) {
        html += '<div class=\'oneProduct\'>';
        html +=     '<img src=' + product['imgLink'] + ' onclick=\'getInfoProduct("' + product['ASIN'] + '")\'/>';
        html +=     '<span class=\'spanProductTitle\' title="' + product['title'] + '">';
        html +=         getLittleTitle(product['title']);
        html +=     '</span>';

        html +=      '<div class=\'' + product['ASIN'] + '\'>';
        html +=          JSON.stringify(product);
        html +=      '</div>';
        html += '</div>';
    }

    return html;
}

//Retourne le titre à la bonne taille avec '...' pour la liste de produit
function getLittleTitle(title) {
    if (title.length >= 10 ) {
        return title.substr(0, 10) + ' ...';
    } else {
        return title;
    }
}
