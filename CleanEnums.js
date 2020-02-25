
let lisWhiteList = ['enum.rooms.testraum',
                ];


let bRemoveNotExisting = false;
let bRemoveDuplicated = true;

function cleanEnums(){
    let rooms = getEnums('rooms');
    let funct = getEnums('functions');
    let bWhitelist = lisWhiteList.join('').length > 0;
    
    function clean(enu){
    enu.forEach(enumObject => {
        if(!bWhitelist || (bWhitelist && lisWhiteList.includes(enumObject.id))){ // Check whitelist
                let tmpEnumObject = getObject(enumObject.id);
                let newMembers = [];
                let sMessageNotExist = [];
                let sMessageDuplicate = [];
                tmpEnumObject.common.members.forEach(m => {
                    if(existsObject(m))
                        newMembers.push(m);
                    else{
                        if(bRemoveNotExisting)
                            sMessageNotExist.push('Remove not existing state ' + m);
                        else{
                            newMembers.push(m);
                            sMessageNotExist.push('Found not existing state ' + m);
                        }
                    }

                    if(!newMembers.includes(m))
                        newMembers.push(m);
                    else{
                        if(bRemoveDuplicated)
                            sMessageDuplicate.push('Remove duplicate state ' + m);
                        else{
                            log('check ' + m);
                            newMembers.push(m);
                            sMessageDuplicate.push('Found duplicate state ' + m);
                        }
                    }
                    
                });
                // Compare size
                let bClean = tmpEnumObject.common.members.length != newMembers.length && (bRemoveNotExisting || bRemoveDuplicated);
                
                if(bClean)
                    log('Clean enum ' + enumObject.id);
                else
                    log('Check enum ' + enumObject.id);

                sMessageNotExist.forEach(m => log(m));
                // sMessageDuplicate.forEach(m => log(m));
                 if(bClean){
                    // tmpEnumObject.common.members = newMembers;
                    // setObject(enumObject.id,tmpEnumObject,(err) =>{
                    //     if(err)
                    //         log('Error clean up enum ' + enumObject.id,'error');
                    // });
                 }
        }
    });}

    clean(rooms);
    clean(funct);
}

cleanEnums();

