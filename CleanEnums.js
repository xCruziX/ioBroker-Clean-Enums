/**
 * Github - https://github.com/xCruziX/ioBroker-Clean-Enums/blob/master/CleanEnums.js
 * Dieses Skript bereinigt Räume und Funktionen
 * 
*/         

/**
 * Die Whitelist kann mit Räumen und Funktionen gefüllt werden.
 * Wenn sich mindestens ein Eintrag in der Whitelist befindet, 
 * werden nur noch diese Einträge in den Enums verändert.
 * Beispiel:
 * let lisWhiteList = ['enum.rooms.wohnzimmer',
 * ];
 */
let lisWhiteList = ['',
];

/**
 * @param {boolean} bRemoveNotExisting Wenn wahr -> enfernt nicht existierende States und gibt diese im Log aus, 
 * wenn falsch -> gibt diese nur im Log aus
 * 
 * @param {boolean} bRemoveDuplicated Wenn wahr -> enfernt doppelte States und gibt diese im Log aus, 
 * wenn falsch -> gibt diese nur im Log aus
 */
function cleanEnums(bRemoveNotExisting,bRemoveDuplicated){
    let rooms = getEnums('rooms');
    let funct = getEnums('functions');
    let bWhitelist = lisWhiteList.length == 0 || lisWhiteList.join('').length > 0;
    
    function clean(enu){
    enu.forEach(enumObject => {
        if(!bWhitelist || (bWhitelist && lisWhiteList.includes(enumObject.id))){ // Prüft die Whitelist
                let tmpEnumObject = getObject(enumObject.id);
                let newMembers = [];
                let sMessageNotExist = [];
                let sMessageDuplicate = [];
                tmpEnumObject.common.members.forEach(m => {
                    let bPush = false;
                    if(existsObject(m))
                        bPush = true;
                    else{
                        if(bRemoveNotExisting)
                            sMessageNotExist.push('Remove not existing state ' + m);
                        else{
                            bPush = true;
                            sMessageNotExist.push('Found not existing state ' + m);
                        }
                    }

                    if(bPush){
                        if(newMembers.includes(m)){
                            if(bRemoveDuplicated){
                                if(bPush)
                                    sMessageDuplicate.push('Remove duplicate state ' + m);
                                bPush = false;
                            }
                            else{
                                if(bPush)
                                    sMessageDuplicate.push('Found duplicate state ' + m);
                                bPush = true;
                            }
                        }
                    }

                    if(bPush)
                        newMembers.push(m);
                });
                // Größe vergleichen
                let bClean = tmpEnumObject.common.members.length != newMembers.length && (bRemoveNotExisting || bRemoveDuplicated);
                
                if(bClean)
                    log('Clean enum ' + enumObject.id);
                else
                    log('Check enum ' + enumObject.id);

                sMessageNotExist.forEach(m => log(m));
                sMessageDuplicate.forEach(m => log(m));
                 if(bClean){
                    tmpEnumObject.common.members = newMembers;
                    setObject(enumObject.id,tmpEnumObject,(err) =>{
                        if(err)
                            log('Error clean up enum ' + enumObject.id,'error');
                    });
                 }
        }
    });}

    clean(rooms);
    clean(funct);
}

/**
 * Aufruf der Funktion
 */
cleanEnums(false,false);
