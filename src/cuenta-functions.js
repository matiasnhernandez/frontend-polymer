export function getDescripcionCuenta(cuenta) {

    return getTipoCuentaFmt(cuenta.tipoCuenta) + ' ' + getMonedaFmt(cuenta.moneda) + ' ' + cuenta.sucursal + '-' + cuenta.numero + '/' + cuenta.digito;
}

export function getSaldoFormat(cuenta) {

    return getMonedaFmt(cuenta.moneda) + ' ' + formatMoney(cuenta.saldo);
    
}

export function getTipoCuentaFmt(tipoCuenta){

    if (tipoCuenta == '1' || tipoCuenta == '20'){
        return 'Cuenta Corriente';
    }
    if (tipoCuenta == '2' || tipoCuenta == '40'){
        return 'Caja de Ahorros';
    }
    return 'N/A';
}

export function getMonedaFmt(moneda){

    if (moneda == '0'){
        return '$';
    }
    if (moneda == '2'){
        return 'U$S';
    }
    if (moneda == '8'){
        return 'Euro';
    }
    return 'N/A';
}

export function formatMoney(number, decPlaces, decSep, thouSep) {

    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
    decSep = typeof decSep === "undefined" ? "," : decSep;
    thouSep = typeof thouSep === "undefined" ? "." : thouSep;
    var sign = number < 0 ? "-" : "";
    var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
    var j = (j = i.length) > 3 ? j % 3 : 0;

    return sign +
    (j ? i.substr(0, j) + thouSep : "") +
    i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
    (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
}